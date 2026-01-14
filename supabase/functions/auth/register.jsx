import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    if (req.method === 'POST') {
      const { name, email, password, role = 'user' } = await req.json()

      // Validate input
      if (!name || !email || !password) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Name, email, and password are required'
          }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      if (password.length < 6) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Password must be at least 6 characters long'
          }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', email)
        .single()

      if (existingUser) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'User already exists with this email'
          }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      // Hash password using Web Crypto API
      const encoder = new TextEncoder()
      const passwordData = encoder.encode(password)
      const hashBuffer = await crypto.subtle.digest('SHA-256', data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

      // Create user in Supabase
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            name,
            email,
            password: hashedPassword,
            role,
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single()

      if (error) {
        console.error('User creation error:', error)
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Failed to create user'
          }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      // Generate JWT token
      const jwtSecret = Deno.env.get('JWT_SECRET') || 'your_super_secret_jwt_key_change_in_production'
      const payload = {
        id: data.id,
        email: data.email,
        role: data.role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
      }

      // Simple JWT implementation for Deno
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
      const payloadB64 = btoa(JSON.stringify(payload))
      const message = `${header}.${payloadB64}`

      const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(jwtSecret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      )

      const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message))
      const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))

      const token = `${message}.${signatureB64}`

      return new Response(
        JSON.stringify({
          success: true,
          message: 'User registered successfully',
          user: {
            id: data.id,
            name: data.name,
            email: data.email,
            role: data.role
          },
          token
        }),
        {
          status: 201,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    return new Response(
      JSON.stringify({ message: 'Method not allowed' }),
      {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Auth register error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Internal server error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})