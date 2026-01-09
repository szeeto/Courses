
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';
import './UserLoginPage.split.css';

function UserLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { signIn, signInWithGoogle, loading } = useSupabaseAuth();

  // Google Sign-In handler
  const handleGoogleLogin = async () => {
    setError('');
    setSuccess('');
    const result = await signInWithGoogle();
    if (result.success) {
      setSuccess('Login sukses!');
      setTimeout(() => navigate('/'), 1200);
    } else {
      setError(result.error || 'Google login gagal');
    }
  };

  // Email login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) throw new Error('Email tidak valid');
      if (!password || password.length < 6) throw new Error('Password minimal 6 karakter');

      const result = await signIn(email, password);
      if (result.success) {
        setSuccess('Login sukses!');
        setTimeout(() => navigate('/'), 1200);
      } else {
        setError(result.error || 'Email atau password salah');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-modern-root">
      <div className="login-modern-card">
        <div className="login-modern-header">
          <h2 className="login-modern-title">Form Login</h2>
        </div>
        <button 
          className="login-modern-btn" 
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{marginBottom: '16px'}}
        >
          {loading ? 'Memproses...' : '🔗 Login dengan Google'}
        </button>
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
