import { useState, useEffect, useCallback } from 'react'

/**
 * useAuth Hook - Manage authentication state
 * 
 * Usage:
 * const { user, token, isLoggedIn, logout, checkAuth } = useAuth()
 */
export function useAuth() {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check if user is logged in on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('authToken')
    const savedUser = localStorage.getItem('user')
    
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const verifyToken = useCallback(async (authToken) => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
      const response = await fetch(`${backendUrl}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      })
      
      if (!response.ok) {
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')
        setToken(null)
        setUser(null)
        return false
      }
      
      const data = await response.json()
      setUser(data.user)
      return true
    } catch (err) {
      console.error('Token verification failed:', err)
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      setToken(null)
      setUser(null)
      return false
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    setError(null)
  }, [])

  const isLoggedIn = !!token && !!user

  return {
    user,
    token,
    isLoggedIn,
    loading,
    error,
    logout,
    verifyToken,
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
