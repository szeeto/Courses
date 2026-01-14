import { useState, useEffect, useCallback } from 'react'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://xuzqgxffbnpiezlkxmsv.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1enFneGZmYm5waWV6bGt4bXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MTA5MDUsImV4cCI6MjA4MzE4NjkwNX0.eeA-3FSmW8dyvyAQZXJvRWG7k2ABIuSG4itE9LBgY5A'

/**
 * useSupabaseAuth Hook - Authentication with Supabase Edge Functions
 *
 * Handles authentication state and API calls to Supabase Edge Functions
 */
export function useSupabaseAuth() {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const userData = localStorage.getItem('user')

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        setSession({ access_token: token })
      } catch (e) {
        console.error('Error parsing stored user data:', e)
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')
      }
    }
  }, [])

  // API helper function for Edge Functions
  const edgeFunctionCall = async (functionName, options = {}) => {
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem('authToken')
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        ...options.headers,
      }

      if (token) {
        headers.Authorization = `Bearer ${token}`
      }

      const response = await fetch(`${SUPABASE_URL}/functions/v1/${functionName}`, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'API call failed')
      }

      return { data, error: null }
    } catch (error) {
      console.error('API call error:', error)
      setError(error.message)
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  // Sign up function
  const signUp = useCallback(async (email, password, name) => {
    const { data, error } = await edgeFunctionCall('auth-register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    })

    if (data && !error) {
      setUser(data.user)
      setSession({ access_token: data.token })
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
    }

    return { data, error }
  }, [])

  // Sign in function
  const signIn = useCallback(async (email, password) => {
    const { data, error } = await edgeFunctionCall('auth-login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })

    if (data && !error) {
      setUser(data.user)
      setSession({ access_token: data.token })
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
    }

    return { data, error }
  }, [])

  // Admin sign in function
  const signInAdmin = useCallback(async (email, password) => {
    const { data, error } = await edgeFunctionCall('auth-admin-login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })

    if (data && !error) {
      setUser(data.user)
      setSession({ access_token: data.token })
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
    }

    return { data, error }
  }, [])

  // Google sign in function
  const signInWithGoogle = useCallback(async (idToken) => {
    const { data, error } = await apiCall('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    })

    if (data && !error) {
      setUser(data.user)
      setSession({ access_token: data.token })
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
    }

    return { data, error }
  }, [])

  // Sign out function
  const signOut = useCallback(async () => {
    await apiCall('/auth/logout', { method: 'POST' })

    setUser(null)
    setSession(null)
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')

    return { error: null }
  }, [])

  // Reset password function
  const resetPassword = useCallback(async (email) => {
    const { data, error } = await apiCall('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })

    return { data, error }
  }, [])

  // Get current user profile
  const getProfile = useCallback(async () => {
    const { data, error } = await edgeFunctionCall('auth-profile')

    if (data && !error) {
      setUser(data.user)
      localStorage.setItem('user', JSON.stringify(data.user))
    }

    return { data, error }
  }, [])

  const isLoggedIn = !!user && !!session

  return {
    user,
    session,
    isLoggedIn,
    loading,
    error,
    signUp,
    signIn,
    signInAdmin,
    signInWithGoogle,
    signOut,
    resetPassword,
    getProfile,
  }
}