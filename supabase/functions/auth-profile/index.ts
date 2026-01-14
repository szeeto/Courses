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

    if (req.method === 'GET') {
      // Get token from Authorization header
      const authHeader = req.headers.get('authorization')
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Access token required'
          }),
          {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      const token = authHeader.split(' ')[1]

      // Verify JWT token
      const jwtSecret = Deno.env.get('JWT_SECRET') || 'your_super_secret_jwt_key_change_in_production'

      try {
        // Simple JWT verification
        const parts = token.split('.')
        if (parts.length !== 3) throw new Error('Invalid token')

        const payload = JSON.parse(atob(parts[1]))
        const now = Math.floor(Date.now() / 1000)

        if (payload.exp < now) {
          throw new Error('Token expired')
        }

        // Get user from database
        const { data: user, error } = await supabase
          .from('users')
          .select('id, name, email, role, created_at')
          .eq('id', payload.id)
          .single()

        if (error || !user) {
          return new Response(
            JSON.stringify({
              success: false,
              message: 'User not found'
            }),
            {
              status: 404,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }

        return new Response(
          JSON.stringify({
            success: true,
            user
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )

      } catch (error) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Invalid or expired token'
          }),
          {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }
    }

    return new Response(
      JSON.stringify({ message: 'Method not allowed' }),
      {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Auth profile error:', error)
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