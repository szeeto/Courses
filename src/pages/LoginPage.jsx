import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { setCookie, getCookie } from '../utils/cookieUtils'
import './LoginPage.css'

function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleCredentialResponse = useCallback(async (response) => {
    setLoading(true)
    setError('')
    try {
      console.log('Starting Google login process...')
      
      // Get backend URL from environment or use current domain
      let backendUrl = import.meta.env.VITE_BACKEND_URL
      
      // If no backend URL is set, use the current domain (for same-domain deployment)
      if (!backendUrl) {
        const protocol = window.location.protocol
        const host = window.location.host
        backendUrl = `${protocol}//${host}`
      }
      
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
        try {
          const errorData = await backendRes.json()
          console.error('Backend error:', errorData)
          throw new Error(errorData.error || 'Sign in failed')
        } catch (err) {
          if (err instanceof SyntaxError) {
            throw new Error(`Server error: ${backendRes.status} ${backendRes.statusText}`)
          }
          throw err
        }
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
      console.log('User info saved')

      // Redirect to home page
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

    // Check if script already loaded
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      })
      window.google.accounts.id.renderButton(
        document.getElementById('googleSignInButton'),
        { theme: 'outline', size: 'large' }
      )
      return
    }

    // Only load script if not already present
    if (!document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
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
    }
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
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-card">
          <div className="login-icon">👤</div>
          <h1>Welcome to Ngoding</h1>
          <p className="login-subtitle">Choose your login method</p>

          {error && <div className="alert alert-danger">{error}</div>}

          {loading ? (
            <div className="spinner-container">
              <div className="spinner">
                <div className="spinner-ring"></div>
              </div>
              <p>Processing...</p>
            </div>
          ) : (
            <>
              {/* Google Sign In */}
              <div className="login-section">
                <h3>Sign in with Google</h3>
                <div id="googleSignInButton"></div>
              </div>

              {/* Divider */}
              <div className="login-divider">
                <span>OR</span>
              </div>

              {/* Custom Login/Register */}
              <div className="login-section custom-auth">
                <h3>Sign in with Email</h3>
                <div className="auth-buttons">
                  <button 
                    className="btn-auth btn-login"
                    onClick={() => navigate('/login/custom')}
                  >
                    <span className="btn-icon">📧</span>
                    <span className="btn-text">Email Login</span>
                  </button>
                  <button 
                    className="btn-auth btn-register"
                    onClick={() => navigate('/register')}
                  >
                    <span className="btn-icon">✍️</span>
                    <span className="btn-text">Create Account</span>
                  </button>
                </div>
              </div>
            </>
          )}

          <div className="login-footer">
            <p>🔒 Your data is secure and encrypted</p>
            <p className="footer-links">
              <a href="/syaratketen">Terms</a> • 
              <a href="/privacy.html"> Privacy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
