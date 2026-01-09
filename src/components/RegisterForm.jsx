import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSupabaseAuth } from '../hooks/useSupabaseAuth'
import { getCookie } from '../utils/cookieUtils'
import '../pages/RegisterPage.css'

function RegisterForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [passwordStrength, setPasswordStrength] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
  })

  const navigate = useNavigate()
  const { signUp, loading } = useSupabaseAuth()

  // Check if user is already logged in
  useEffect(() => {
    const token = getCookie('authToken') || localStorage.getItem('authToken')
    if (token) {
      navigate('/', { replace: true })
    }
  }, [navigate])

  // Check password strength
  useEffect(() => {
    setPasswordStrength({
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
    })
  }, [password])

  const validateForm = () => {
    const errors = {}

    if (!name.trim()) {
      errors.name = 'Nama wajib diisi'
    } else if (name.trim().length < 2) {
      errors.name = 'Nama minimal 2 karakter'
    }

    if (!email.trim()) {
      errors.email = 'Email wajib diisi'
    } else if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.email = 'Format email tidak valid'
    }

    if (!password) {
      errors.password = 'Password wajib diisi'
    } else if (password.length < 8) {
      errors.password = 'Password minimal 8 karakter'
    } else if (!/[A-Z]/.test(password)) {
      errors.password = 'Password harus mengandung huruf besar'
    } else if (!/[a-z]/.test(password)) {
      errors.password = 'Password harus mengandung huruf kecil'
    } else if (!/[0-9]/.test(password)) {
      errors.password = 'Password harus mengandung angka'
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Konfirmasi password wajib diisi'
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Password tidak cocok'
    }

    if (!agreeTerms) {
      errors.terms = 'Anda harus setuju dengan syarat dan ketentuan'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!validateForm()) {
      return
    }

    try {
      const result = await signUp(email.trim(), password, {
        full_name: name.trim(),
      })

      if (result.success) {
        setSuccess('✓ Registrasi berhasil! Silakan cek email Anda untuk verifikasi.')
        setName('')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        setAgreeTerms(false)
        setTimeout(() => navigate('/login/user'), 2000)
      } else {
        setError(result.error || 'Registrasi gagal. Silakan coba lagi.')
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan. Silakan coba lagi.')
    }
  }

  const isPasswordValid = Object.values(passwordStrength).every(v => v)
  const isFormValid = name && email && isPasswordValid && confirmPassword === password && agreeTerms && !loading

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1>Daftar Akun</h1>
          <p>Buat akun baru untuk mengakses kursus kami</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form className="register-form" onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="name">Nama Lengkap</label>
            <input
              id="name"
              type="text"
              placeholder="Masukkan nama lengkap Anda"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: '' })
              }}
              disabled={loading}
              style={{ borderColor: fieldErrors.name ? '#c53030' : undefined }}
            />
            {fieldErrors.name && <span style={{ color: '#c53030', fontSize: '0.85rem' }}>⚠ {fieldErrors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Masukkan email Anda"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' })
              }}
              disabled={loading}
              style={{ borderColor: fieldErrors.email ? '#c53030' : undefined }}
            />
            {fieldErrors.email && <span style={{ color: '#c53030', fontSize: '0.85rem' }}>⚠ {fieldErrors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Masukkan password yang kuat"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: '' })
              }}
              disabled={loading}
              style={{ borderColor: fieldErrors.password ? '#c53030' : undefined }}
            />
            {fieldErrors.password && (
              <span style={{ color: '#c53030', fontSize: '0.85rem' }}>⚠ {fieldErrors.password}</span>
            )}

            {password && (
              <div className="password-requirements">
                <p style={{ margin: '0 0 8px 0', fontWeight: 500 }}>Persyaratan password:</p>
                <div style={{ color: passwordStrength.minLength ? '#38a169' : '#718096' }} className="requirement-item">
                  Minimal 8 karakter
                </div>
                <div style={{ color: passwordStrength.hasUpperCase ? '#38a169' : '#718096' }} className="requirement-item">
                  Mengandung huruf besar (A-Z)
                </div>
                <div style={{ color: passwordStrength.hasLowerCase ? '#38a169' : '#718096' }} className="requirement-item">
                  Mengandung huruf kecil (a-z)
                </div>
                <div style={{ color: passwordStrength.hasNumber ? '#38a169' : '#718096' }} className="requirement-item">
                  Mengandung angka (0-9)
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Konfirmasi Password</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Konfirmasi password Anda"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                if (fieldErrors.confirmPassword) setFieldErrors({ ...fieldErrors, confirmPassword: '' })
              }}
              disabled={loading}
              style={{ borderColor: fieldErrors.confirmPassword ? '#c53030' : undefined }}
            />
            {fieldErrors.confirmPassword && (
              <span style={{ color: '#c53030', fontSize: '0.85rem' }}>⚠ {fieldErrors.confirmPassword}</span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '8px' }}>
            <input
              id="terms"
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => {
                setAgreeTerms(e.target.checked)
                if (fieldErrors.terms) setFieldErrors({ ...fieldErrors, terms: '' })
              }}
              disabled={loading}
              style={{ marginTop: '4px', cursor: 'pointer', width: '18px', height: '18px' }}
            />
            <label htmlFor="terms" style={{ cursor: 'pointer', fontSize: '0.9rem', margin: 0 }}>
              Saya setuju dengan Syarat & Ketentuan dan Kebijakan Privasi
            </label>
          </div>
          {fieldErrors.terms && <span style={{ color: '#c53030', fontSize: '0.85rem', marginTop: '8px' }}>⚠ {fieldErrors.terms}</span>}

          <button
            className="register-btn"
            type="submit"
            disabled={!isFormValid || loading}
            style={{
              opacity: !isFormValid || loading ? 0.6 : 1,
              cursor: !isFormValid || loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Sedang mendaftar...' : 'Daftar Sekarang'}
          </button>
        </form>

        <div className="register-footer">
          Sudah memiliki akun? <a href="/login/user" style={{ textDecoration: 'none' }}>Login di sini</a>
        </div>
      </div>
    </div>
  )
}

export default RegisterForm
