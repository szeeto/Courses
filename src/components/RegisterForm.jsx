import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setCookie } from '../utils/cookieUtils'
import './AuthForm.css'

function RegisterForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()

  const validateForm = () => {
    if (!name.trim()) throw new Error('Nama harus diisi')
    if (!email.trim()) throw new Error('Email harus diisi')
    if (!password) throw new Error('Kata sandi harus diisi')
    if (password.length < 6) throw new Error('Kata sandi minimal 6 karakter')
    if (password !== confirmPassword) throw new Error('Kata sandi tidak cocok')
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) throw new Error('Email tidak valid')
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      validateForm()

      const backendUrl = import.meta.env.VITE_BACKEND_URL || window.location.origin

      const response = await fetch(`${backendUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Pendaftaran gagal')
      }

      const data = await response.json()

      // Save to localStorage and cookies
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setCookie('authToken', data.token, 30)
      setCookie('userInfo', JSON.stringify(data.user), 30)
      setCookie('userEmail', data.user.email, 30)

      setSuccess('Pendaftaran berhasil! Mengalihkan...')
      setTimeout(() => navigate('/', { replace: true }), 1500)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-form-container">
      <div className="auth-form">
        <h2>Daftar</h2>
        <p className="auth-subtitle">Buat akun baru Anda</p>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="name">Nama Lengkap</label>
            <input
              type="text"
              id="name"
              placeholder="Masukkan nama lengkap"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>

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
                placeholder="Minimal 6 karakter"
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

          <div className="form-group">
            <label htmlFor="confirmPassword">Konfirmasi Kata Sandi</label>
            <div className="password-input-group">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                placeholder="Ulangi kata sandi"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Memproses...' : 'Daftar'}
          </button>
        </form>

        <p className="auth-link">
          Sudah punya akun? <a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Masuk di sini</a>
        </p>
      </div>
    </div>
  )
}

export default RegisterForm
