import React, { useState } from 'react';
import './UserRegisterForm.css';

const UserRegisterForm = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError('Semua field wajib diisi!');
      return;
    }
    if (!form.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
      setError('Email tidak valid!');
      return;
    }
    if (form.password.length < 6) {
      setError('Password minimal 6 karakter!');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Konfirmasi password tidak sama!');
      return;
    }
    setLoading(true);
    // Simulasi request
    setTimeout(() => {
      setSuccess('Pendaftaran berhasil! Silakan login.');
      setLoading(false);
      setForm({ name: '', email: '', password: '', confirmPassword: '' });
    }, 1200);
  };

  return (
    <div className="user-register-form-container">
      <h2>Form Pendaftaran User</h2>
      <form className="user-register-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nama Lengkap"
          value={form.name}
          onChange={handleChange}
          disabled={loading}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          disabled={loading}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          disabled={loading}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Konfirmasi Password"
          value={form.confirmPassword}
          onChange={handleChange}
          disabled={loading}
          required
        />
        <button type="submit" disabled={loading} className="user-register-btn">
          {loading ? 'Memproses...' : 'Daftar'}
        </button>
        {error && <div className="user-register-error">{error}</div>}
        {success && <div className="user-register-success">{success}</div>}
      </form>
    </div>
  );
};

export default UserRegisterForm;
