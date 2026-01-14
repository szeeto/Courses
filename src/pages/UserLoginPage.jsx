import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSupabaseAuth } from '../hooks/useSupabaseAuth'
import AuthForm from '../components/AuthForm'

const UserLoginPage = () => {
  const navigate = useNavigate()
  const { signIn, signInWithGoogle, loading, error } = useSupabaseAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { data, error } = await signIn(formData.email, formData.password)

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
                <h2 className="fw-bold text-primary">Login</h2>
                <p className="text-muted">Masuk ke akun Anda</p>
              </div>

              <AuthForm
                mode="login"
                formData={formData}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
                onGoogleSignIn={handleGoogleSignIn}
                loading={loading}
                error={error}
              />

              <div className="text-center mt-4">
                <p className="mb-0">
                  Belum punya akun?{' '}
                  <Link to="/register" className="text-primary fw-bold text-decoration-none">
                    Daftar sekarang
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

export default UserLoginPage