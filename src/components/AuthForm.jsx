import { useState } from 'react'

const AuthForm = ({ mode, formData, onInputChange, onSubmit, onGoogleSignIn, loading, error }) => {
  const [showPassword, setShowPassword] = useState(false)

  const isLogin = mode === 'login'

  return (
    <form onSubmit={onSubmit}>
      {/* Name field for registration */}
      {!isLogin && (
        <div className="mb-3">
          <label htmlFor="name" className="form-label fw-semibold">
            Nama Lengkap
          </label>
          <input
            type="text"
            className="form-control form-control-lg"
            id="name"
            name="name"
            value={formData.name}
            onChange={onInputChange}
            placeholder="Masukkan nama lengkap"
            required={!isLogin}
            disabled={loading}
          />
        </div>
      )}

      {/* Email field */}
      <div className="mb-3">
        <label htmlFor="email" className="form-label fw-semibold">
          Email
        </label>
        <input
          type="email"
          className="form-control form-control-lg"
          id="email"
          name="email"
          value={formData.email}
          onChange={onInputChange}
          placeholder="Masukkan email"
          required
          disabled={loading}
        />
      </div>

      {/* Password field */}
      <div className="mb-3">
        <label htmlFor="password" className="form-label fw-semibold">
          Password
        </label>
        <div className="input-group">
          <input
            type={showPassword ? 'text' : 'password'}
            className="form-control form-control-lg"
            id="password"
            name="password"
            value={formData.password}
            onChange={onInputChange}
            placeholder="Masukkan password"
            required
            disabled={loading}
            minLength="6"
          />
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => setShowPassword(!showPassword)}
            disabled={loading}
          >
            <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
          </button>
        </div>
      </div>

      {/* Confirm Password field for registration */}
      {!isLogin && (
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label fw-semibold">
            Konfirmasi Password
          </label>
          <div className="input-group">
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-control form-control-lg"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={onInputChange}
              placeholder="Konfirmasi password"
              required={!isLogin}
              disabled={loading}
              minLength="6"
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
            </button>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        className="btn btn-primary btn-lg w-100 mb-3"
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            {isLogin ? 'Sedang Masuk...' : 'Mendaftarkan...'}
          </>
        ) : (
          isLogin ? 'Masuk' : 'Daftar'
        )}
      </button>

      {/* Divider */}
      <div className="text-center mb-3">
        <span className="text-muted">atau</span>
      </div>

      {/* Google Sign In button */}
      <button
        type="button"
        className="btn btn-outline-secondary btn-lg w-100 mb-3"
        onClick={onGoogleSignIn}
        disabled={loading}
      >
        <i className="bi bi-google me-2"></i>
        {isLogin ? 'Masuk dengan Google' : 'Daftar dengan Google'}
      </button>

      {/* Forgot password link for login */}
      {isLogin && (
        <div className="text-center">
          <a href="#" className="text-decoration-none small">
            Lupa password?
          </a>
        </div>
      )}
    </form>
  )
}

export default AuthForm