import { useState, useEffect, useCallback } from 'react'
import { useSupabaseAuth } from './useSupabaseAuth'

/**
 * useAuth Hook - Manage authentication state (Legacy for backward compatibility)
 * Now uses Supabase Auth
 * 
 * Usage:
 * const { user, token, isLoggedIn, logout, checkAuth } = useAuth()
 */
export function useAuth() {
  const supabaseAuth = useSupabaseAuth()
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Sync with Supabase auth state
  useEffect(() => {
    if (supabaseAuth.user && supabaseAuth.session) {
      setUser(supabaseAuth.user)
      setToken(supabaseAuth.session.access_token)
    } else {
      setUser(null)
      setToken(null)
    }
    setLoading(supabaseAuth.loading)
    setError(supabaseAuth.error)
  }, [supabaseAuth.user, supabaseAuth.session, supabaseAuth.loading, supabaseAuth.error])

  const logout = useCallback(async () => {
    await supabaseAuth.signOut()
  }, [supabaseAuth])

  const isLoggedIn = !!token && !!user

  return {
    user,
    token,
    isLoggedIn,
    loading,
    error,
    logout,
    setUser,
    setToken,
  }
}

/**
 * useApi Hook - Make authenticated API calls
 * 
 * Usage:
 * const { data, loading, error, execute } = useApi('/api/endpoint')
 */
export function useApi(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { token } = useAuth()

  const execute = useCallback(async (method = 'GET', body = null) => {
    setLoading(true)
    setError(null)
    
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
      const fullUrl = url.startsWith('http') ? url : `${backendUrl}${url}`
      
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
        }
      }
      
      if (token) {
        options.headers['Authorization'] = `Bearer ${token}`
      }
      
      if (body) {
        options.body = JSON.stringify(body)
      }
      
      const response = await fetch(fullUrl, options)
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }
      
      const result = await response.json()
      setData(result)
      return result
    } catch (err) {
      setError(err.message)
      console.error('API Error:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [url, token])

  return { data, loading, error, execute }
}

export default useAuth
