import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { setCookie, getCookie } from '../utils/cookieUtils'
import './LoginPage.css'

function UserLoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleCredentialResponse = useCallback(async (response) => {
    setLoading(true)
    setError('')
    try {
      console.log('Starting user login process...')
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
      console.log('Backend URL:', backendUrl)

      const backendRes = await fetch(
        `${backendUrl}/auth/google-signin`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: response.credential }),
        }
      )

      console.log('Backend response status:', backendRes.status)

      if (!backendRes.ok) {
        const errorData = await backendRes.json()
        console.error('Backend error:', errorData)
        throw new Error(errorData.error || 'Sign in failed')
      }

      const data = await backendRes.json()
      console.log('Login successful, received data:', data)
      
      if (!data.token || !data.user) {
        console.error('Invalid response data:', data)
        throw new Error('Invalid response from server')
      }

      console.log('Saving to localStorage and cookies...')
      // Save to localStorage
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      // Save to cookies (30 days expiry)
      setCookie('authToken', data.token, 30)
      setCookie('userInfo', JSON.stringify(data.user), 30)
      setCookie('userEmail', data.user.email, 30)
      
      console.log('Token saved to localStorage and cookies')
      console.log('User info saved to localStorage and cookies')
      console.log('User already saved to database by backend')

      // Redirect immediately to home page for regular users
      console.log('Redirecting to home page...')
      navigate('/', { replace: true })
    } catch (err) {
      console.error('Login error:', err)
      setError(err.message || 'Login failed, please try again')
    } finally {
      setLoading(false)
    }
  }, [navigate])

  // Load Google API script
  useEffect(() => {
    // Register callback globally
    window.handleCredentialResponse = handleCredentialResponse

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = function () {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        })
        window.google.accounts.id.renderButton(
          document.getElementById('googleSignInButton'),
          { theme: 'outline', size: 'large' }
        )
      }
    }
    document.head.appendChild(script)
  }, [handleCredentialResponse])

  // Check if user is already logged in
  useEffect(() => {
    const token = getCookie('authToken') || localStorage.getItem('authToken')
    if (token) {
      console.log('User already logged in, redirecting to home...')
      navigate('/', { replace: true })
    }
  }, [navigate])

  return (
    <div className="page-root page-animate animate__animated animate__fadeIn login-container">
      <div className="login-card user-login">
        <div className="login-icon">👤</div>
        <h1>User Login</h1>
        <p className="login-subtitle">Sign in with your Google account</p>

        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : (
          <div id="googleSignInButton"></div>
        )}

        <div className="login-footer">
          <p>New here? Just sign in to create an account</p>
          <p className="login-mode-link">
            Admin? <a href="/login/admin">Login as Admin</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default UserLoginPage
