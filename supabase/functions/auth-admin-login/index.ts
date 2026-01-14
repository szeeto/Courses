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
      const { email, password } = await req.json()

      // Validate input
      if (!email || !password) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Email and password are required'
          }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      // Get user from database
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('role', 'admin')
        .single()

      if (error || !user) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Invalid email or password'
          }),
          {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      // Verify password using SHA-256 hash
      const encoder = new TextEncoder()
      const data = encoder.encode(password)
      const hashBuffer = await crypto.subtle.digest('SHA-256', data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

      if (hashedPassword !== user.password) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Invalid email or password'
          }),
          {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      // Generate JWT token
      const jwtSecret = Deno.env.get('JWT_SECRET') || 'your_super_secret_jwt_key_change_in_production'
      const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
      }

      // Base64url encode function
      const base64urlEncode = (str) => {
        return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
      }

      // Simple JWT implementation for Deno
      const header = base64urlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
      const payloadB64 = base64urlEncode(JSON.stringify(payload))
      const message = `${header}.${payloadB64}`

      const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(jwtSecret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      )

      const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message))
      const signatureB64 = base64urlEncode(String.fromCharCode(...new Uint8Array(signature)))

      const token = `${message}.${signatureB64}`

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Admin login successful',
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          },
          token
        }),
        {
          status: 200,
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
    console.error('Auth admin login error:', error)
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