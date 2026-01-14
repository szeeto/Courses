import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSupabaseAuth } from '../hooks/useSupabaseAuth'
import AuthForm from '../components/AuthForm'

const UserRegisterForm = () => {
  const navigate = useNavigate()
  const { signUp, signInWithGoogle, loading, error } = useSupabaseAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      alert('Password dan konfirmasi password tidak cocok')
      return
    }

    if (formData.password.length < 6) {
      alert('Password minimal 6 karakter')
      return
    }

    const { data, error } = await signUp(formData.email, formData.password, formData.name)

    if (!error && data) {
      navigate('/')
    }
  }

  const handleGoogleSignIn = async () => {
    // For Google Sign-In, you would typically use Google OAuth library
    // This is a placeholder for the actual implementation
    console.log('Google Sign-In clicked')
  }

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row w-100 justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold text-primary">Daftar</h2>
                <p className="text-muted">Buat akun baru Anda</p>
              </div>

              <AuthForm
                mode="register"
                formData={formData}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
                onGoogleSignIn={handleGoogleSignIn}
                loading={loading}
                error={error}
              />

              <div className="text-center mt-4">
                <p className="mb-0">
                  Sudah punya akun?{' '}
                  <Link to="/login" className="text-primary fw-bold text-decoration-none">
                    Masuk sekarang
                  </Link>
                </p>
              </div>

              <div className="text-center mt-3">
                <Link to="/" className="text-muted text-decoration-none">
                  ← Kembali ke Beranda
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserRegisterForm