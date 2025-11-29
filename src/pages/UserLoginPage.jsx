
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserLoginPage.split.css';

function UserLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
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
        if (data.ok && data.token && data.user) {
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          setSuccess('Login sukses!');
          if (data.user.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/');
          }
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
      if (data.ok && data.token && data.user) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setSuccess('Login sukses!');
        if (data.user.role === 'admin') {
          setTimeout(() => navigate('/admin'), 1200);
        } else {
          setTimeout(() => navigate('/', 1200));
        }
      } else {
        setError(data.error || 'Email atau password salah');
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="login-modern-root">
      <div className="login-modern-card">
        <div className="login-modern-header">
          <h2 className="login-modern-title">Form Login</h2>
        </div>
        <div id="google-login-btn" className="google-login-btn-modern"></div>
        <div className="login-modern-or">atau login dengan email</div>
        <form className="login-modern-form" onSubmit={handleLogin}>
          <input
            type="email"
            className="login-modern-input"
            placeholder="Masukan Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            className="login-modern-input"
            placeholder="Masukan Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <div className="login-modern-row">
            <label className="login-modern-remember">
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} /> Ingatkan saya
            </label>
            <a href="#" className="login-modern-link" onClick={e => {e.preventDefault();alert('Fitur lupa password coming soon!')}}>Lupa password?</a>
          </div>
          <button className="login-modern-btn" type="submit" disabled={loading}>
            {loading ? 'Memproses...' : 'Login'}
          </button>
          {error && <div className="login-modern-error">{error}</div>}
          {success && <div className="login-modern-success">{success}</div>}
        </form>
        <div className="login-modern-register">
          Belum menjadi anggota?{' '}
          <a href="/register" onClick={e => {e.preventDefault();navigate('/register')}}>Daftar Sekarang</a>
        </div>
      </div>
    </div>
  );
}

export default UserLoginPage;
