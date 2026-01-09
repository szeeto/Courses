import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSupabaseAuth } from '../hooks/useSupabaseAuth'
import { setCookie, getCookie } from '../utils/cookieUtils'
import './LoginPage.css'

function AdminLoginPage() {
  const [error, setError] = useState('')
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const navigate = useNavigate()
  const { signInWithGoogle, loading } = useSupabaseAuth()
  const ADMIN_EMAILS = useMemo(() => ['patrasawali93@gmail.com', 'admin@ngoding.id'], [])

  const handleGoogleLogin = useCallback(async () => {
    setError('')
    try {
      const result = await signInWithGoogle()
      
      if (result.success && result.data?.user) {
        // Check if user is admin
        if (!ADMIN_EMAILS.includes(result.data.user.email)) {
          setError('Akses ditolak. Anda bukan admin.')
          return
        }

        // Save session info
        const userData = {
          id: result.data.user.id,
          email: result.data.user.email,
          name: result.data.user.user_metadata?.full_name || result.data.user.email.split('@')[0],
          role: 'admin'
        }
        
        localStorage.setItem('authToken', result.data.session?.access_token)
        localStorage.setItem('user', JSON.stringify(userData))
        setCookie('authToken', result.data.session?.access_token, 30)
        setCookie('userInfo', JSON.stringify(userData), 30)
        setCookie('userEmail', userData.email, 30)

        navigate('/adminPanel/profile', { replace: true })
      } else {
        setError(result.error || 'Login gagal')
      }
    } catch (err) {
      setError(err.message || 'Login gagal')
    }
  }, [navigate, ADMIN_EMAILS, signInWithGoogle])

  // Check if user is already logged in
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

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;'
    document.cookie = 'userInfo=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;'
    document.cookie = 'userEmail=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;'
    setIsAdminLoggedIn(false)
  }

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
              onClick={handleLogout}
            >
              Logout & Login as Different Admin
            </button>
          </div>
        ) : (
          <>
            <button 
              className="btn btn-primary btn-lg w-100"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              {loading ? 'Memproses...' : '🔗 Login dengan Google'}
            </button>
            <div className="login-footer">
              <p className="login-mode-link">
                Regular user? <a href="/login/user">Login as User</a>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AdminLoginPage
