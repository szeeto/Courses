import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { setCookie, getCookie } from '../utils/cookieUtils'
import './LoginPage.css'

function AdminLoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const ADMIN_EMAILS = useMemo(() => ['patrasawali93@gmail.com', 'admin@ngoding.id'], [])

  const handleCredentialResponse = useCallback(async (response) => {
    setLoading(true)
    setError('')
    try {
      console.log('Starting admin login process...')
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

      // Check if user is admin
      if (!ADMIN_EMAILS.includes(data.user.email)) {
        console.error('User is not an admin:', data.user.email)
        setError('Access denied. You are not authorized as an admin.')
        setLoading(false)
        return
      }

      console.log('Admin verified:', data.user.email)

      console.log('Saving to localStorage and cookies...')
      // Save to localStorage
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      // Save to cookies (30 days expiry)
      setCookie('authToken', data.token, 30)
      setCookie('userInfo', JSON.stringify(data.user), 30)
      setCookie('userEmail', data.user.email, 30)
      
      console.log('Token saved to localStorage and cookies')
      console.log('Admin user logged in')

      // Redirect to admin dashboard
      console.log('Redirecting to admin panel profile...')
      navigate('/adminPanel/profile', { replace: true })
    } catch (err) {
      console.error('Login error:', err)
      setError(err.message || 'Login failed, please try again')
    } finally {
      setLoading(false)
    }
  }, [navigate, ADMIN_EMAILS])

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
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)

  useEffect(() => {
    const token = getCookie('authToken') || localStorage.getItem('authToken')
    if (token) {
      const user = localStorage.getItem('user')
      if (user) {
        const userData = JSON.parse(user)
        if (ADMIN_EMAILS.includes(userData.email)) {
          console.log('Admin already logged in')
          setIsAdminLoggedIn(true)
        }
      }
    }
  }, [ADMIN_EMAILS])

  return (
    <div className="page-root page-animate animate__animated animate__fadeIn login-container">
      <div className="login-card admin-login">
        <div className="login-icon">🔐</div>
        <h1>Admin Login</h1>
        <p className="login-subtitle">Sign in with your admin account</p>

        {error && <div className="alert alert-danger">{error}</div>}

        {isAdminLoggedIn ? (
          <div className="admin-already-logged">
            <div className="alert alert-success">
              ✅ You are already logged in as admin
            </div>
            <button 
              className="btn btn-primary btn-lg w-100 mb-3"
              onClick={() => navigate('/adminPanel/profile', { replace: true })}
            >
              Go to Admin Dashboard
            </button>
            <button 
              className="btn btn-outline-secondary w-100"
              onClick={() => {
                localStorage.removeItem('authToken')
                localStorage.removeItem('user')
                setIsAdminLoggedIn(false)
              }}
            >
              Logout & Login as Different Admin
            </button>
          </div>
          // Pastikan user admin punya properti role: 'admin'
          const adminUser = { ...data.user, role: 'admin' }
          console.log('Saving to localStorage and cookies...')
          localStorage.setItem('authToken', data.token)
          localStorage.setItem('user', JSON.stringify(adminUser))
          setCookie('authToken', data.token, 30)
          setCookie('userInfo', JSON.stringify(adminUser), 30)
          setCookie('userEmail', adminUser.email, 30)

          console.log('Token saved to localStorage and cookies')
          console.log('Admin user logged in')

          // Redirect ke admin profile
          console.log('Redirecting to admin panel profile...')
          navigate('/adminPanel/profile', { replace: true })
        <div className="login-footer">
          <p className="login-mode-link">
            Regular user? <a href="/login/user">Login as User</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminLoginPage
