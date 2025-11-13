import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setCookie } from '../utils/cookieUtils'
import './AuthForm.css'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!email || !password) {
        throw new Error('Email dan password harus diisi')
      }

      const backendUrl = import.meta.env.VITE_BACKEND_URL || window.location.origin

      const response = await fetch(`${backendUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        try {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Login gagal')
        } catch (err) {
          if (err instanceof SyntaxError) {
            throw new Error(`Server error: ${response.status} ${response.statusText}`)
          }
          throw err
        }
      }

      const data = await response.json()

      // Save to localStorage and cookies
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setCookie('authToken', data.token, 30)
      setCookie('userInfo', JSON.stringify(data.user), 30)
      setCookie('userEmail', data.user.email, 30)

      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-form-container">
      <div className="auth-form">
        <h2>Masuk</h2>
        <p className="auth-subtitle">Selamat datang kembali!</p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Masukkan email Anda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Kata Sandi</label>
            <div className="password-input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Masukkan kata sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <p className="auth-link">
          Belum punya akun? <a href="/register" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>Daftar di sini</a>
        </p>
      </div>
    </div>
  )
}

export default LoginForm
