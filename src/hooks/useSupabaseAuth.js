import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xuzqgxffbnpiezlkxmsv.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * useSupabaseAuth Hook - Manage Supabase authentication
 * 
 * Usage:
 * const { user, session, isLoggedIn, signUp, signIn, signOut, loading } = useSupabaseAuth()
 */
export function useSupabaseAuth() {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check auth state on mount
  useEffect(() => {
    let isMounted = true

    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession()
        
        if (isMounted) {
          if (currentSession) {
            setSession(currentSession)
            setUser(currentSession.user)
            localStorage.setItem('supabaseSession', JSON.stringify(currentSession))
          } else {
            setSession(null)
            setUser(null)
          }
          setLoading(false)
        }
      } catch (err) {
        console.error('Session check error:', err)
        if (isMounted) setLoading(false)
      }
    }

    checkSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      if (isMounted) {
        setSession(currentSession)
        setUser(currentSession?.user || null)
        if (currentSession) {
          localStorage.setItem('supabaseSession', JSON.stringify(currentSession))
        } else {
          localStorage.removeItem('supabaseSession')
        }
      }
    })

    return () => {
      isMounted = false
      subscription?.unsubscribe()
    }
  }, [])

  const signUp = useCallback(async (email, password, metadata = {}) => {
    try {
      setError(null)
      setLoading(true)

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      })

      if (error) throw error

      return { success: true, data }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const signIn = useCallback(async (email, password) => {
    try {
      setError(null)
      setLoading(true)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      setSession(data.session)
      setUser(data.user)
      return { success: true, data }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const signInWithGoogle = useCallback(async () => {
    try {
      setError(null)
      setLoading(true)

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      })

      if (error) throw error

      return { success: true, data }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const signOut = useCallback(async () => {
    try {
      setError(null)
      const { error } = await supabase.auth.signOut()
      
      if (error) throw error

      setSession(null)
      setUser(null)
      localStorage.removeItem('supabaseSession')
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    }
  }, [])

  const resetPassword = useCallback(async (email) => {
    try {
      setError(null)
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      
      if (error) throw error

      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    }
  }, [])

  return {
    user,
    session,
    isLoggedIn: !!session && !!user,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
  }
}

export { supabase }
