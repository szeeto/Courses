
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserLoginPage.split.css';

function UserLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Google Sign-In callback
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';
    const handleGoogleResponse = async (response) => {
      setLoading(true);
      setError('');
      setSuccess('');
      try {
        if (!response.credential) {
          setError('Google credential tidak ditemukan');
          setLoading(false);
          return;
        }
        const res = await fetch('http://localhost:4000/auth/google-signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: response.credential }),
        });
        const data = await res.json();
        if (data.ok && data.token) {
          localStorage.setItem('token', data.token);
          setSuccess('Login sukses!');
          navigate('/');
        } else {
          setError(data.error || 'Google login failed');
        }
      } catch (err) {
        setError('Google login error: ' + err.message);
      }
      setLoading(false);
    };
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleResponse,
      });
      window.google.accounts.id.renderButton(
        document.getElementById('google-login-btn'),
        { theme: 'outline', size: 'large' }
      );
    }
  }, [navigate]);

  // Email login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) throw new Error('Email tidak valid');
      if (!password || password.length < 6) throw new Error('Password minimal 6 karakter');

      const res = await fetch('http://localhost:4000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.ok && data.token) {
        localStorage.setItem('token', data.token);
        setSuccess('Login sukses!');
        setTimeout(() => navigate('/'), 1200);
      } else {
        setError(data.error || 'Email atau password salah');
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="login-responsive-root">
      <div className="login-responsive-card">
        <div className="login-responsive-title">Login</div>
        <div className="login-responsive-subtitle">Masuk dengan Google atau Email</div>
        <button
          type="button"
          className="google-login-btn-beauty"
          style={{width:'100%',marginBottom:'18px',background:'#fff',color:'#222',border:'1px solid #eee',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px'}}
          onClick={() => window.google && window.google.accounts.id.prompt()}
        >
          <svg width="22" height="22" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.72 1.22 9.22 3.22l6.9-6.9C35.62 2.34 30.13 0 24 0 14.61 0 6.27 5.74 2.44 14.1l8.06 6.27C12.36 13.13 17.73 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.5c0-1.64-.15-3.22-.43-4.75H24v9.02h12.44c-.54 2.9-2.18 5.36-4.64 7.02l7.18 5.59C43.73 37.13 46.1 31.27 46.1 24.5z"/><path fill="#FBBC05" d="M10.5 28.37c-.6-1.8-.95-3.7-.95-5.62s.35-3.82.95-5.62l-8.06-6.27C.82 14.61 0 19.13 0 24s.82 9.39 2.44 13.14l8.06 6.27z"/><path fill="#EA4335" d="M24 46c6.13 0 11.62-2.02 15.82-5.5l-7.18-5.59c-2.01 1.35-4.59 2.15-7.64 2.15-6.27 0-11.64-3.63-13.5-8.87l-8.06 6.27C6.27 42.26 14.61 48 24 48z"/></g></svg>
          Login dengan Google
        </button>
        <div className="login-or">atau login dengan email</div>
        <form className="login-responsive-form" onSubmit={handleLogin}>
          <input
            type="email"
            className="login-responsive-input"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            className="login-responsive-input"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <button className="login-responsive-btn" type="submit" disabled={loading}>
            {loading ? 'Memproses...' : 'Login'}
          </button>
          {error && <div className="login-responsive-error">{error}</div>}
          {success && <div className="login-responsive-success">{success}</div>}
        </form>
        <div className="login-responsive-register">
          Belum punya akun?{' '}
          <a href="/register" onClick={e => {e.preventDefault();navigate('/register')}}>Daftar sekarang</a>
        </div>
      </div>
    </div>
  );
}

export default UserLoginPage;
