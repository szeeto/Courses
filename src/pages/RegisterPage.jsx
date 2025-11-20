import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) throw new Error('Email tidak valid');
      if (!password || password.length < 6) throw new Error('Password minimal 6 karakter');
      if (!name) throw new Error('Nama wajib diisi');
      const res = await fetch('http://localhost:4000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });
      const data = await res.json();
      if (data.ok) {
        setSuccess('Registrasi sukses!');
        setTimeout(() => navigate('/'), 1200);
      } else {
        setError(data.error || 'Registrasi gagal');
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="register-root">
      <div className="register-card">
        <div className="register-title">Register</div>
        <form className="register-form" onSubmit={handleRegister}>
          <input
            type="text"
            className="register-input"
            placeholder="Nama"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="email"
            className="register-input"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            className="register-input"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <button className="register-btn" type="submit" disabled={loading}>
            {loading ? 'Memproses...' : 'Register'}
          </button>
          {error && <div className="register-error">{error}</div>}
          {success && <div className="register-success">{success}</div>}
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import RegisterForm from '../components/RegisterForm'
import { getCookie } from '../utils/cookieUtils'

function RegisterPage() {
  const navigate = useNavigate()

  // Check if user is already logged in
  useEffect(() => {
    const token = getCookie('authToken') || localStorage.getItem('authToken')
    if (token) {
      navigate('/', { replace: true })
    }
  }, [navigate])

  return (
    <div className="page-root">
      <RegisterForm />
    </div>
  )
}

export default RegisterPage
