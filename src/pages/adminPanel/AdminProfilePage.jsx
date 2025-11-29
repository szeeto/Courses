import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminProfilePage.css";

const AdminProfilePage = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) {
      navigate('/login', { replace: true });
      return;
    }
    const user = JSON.parse(userStr);
    setAdmin(user);
    setLoading(false);
  }, [navigate]);

  if (loading) return <div className="admin-profile-container"><p>Loading...</p></div>;
  if (!admin) return null;

  return (
    <div className="admin-profile-container">
      <h2>Profil Admin</h2>
      <div className="admin-profile-card">
        <div className="admin-profile-info">
          <p><strong>Nama:</strong> {admin.name}</p>
          <p><strong>Email:</strong> {admin.email}</p>
          <p><strong>Role:</strong> {admin.role || 'Admin'}</p>
          <p><strong>Bergabung:</strong> {admin.created_at ? new Date(admin.created_at).toLocaleDateString() : '-'}</p>
        </div>
      </div>
      <div style={{textAlign:'center', marginTop:'32px'}}>
        <button
          style={{
            background: 'linear-gradient(90deg, #764ba2 0%, #667eea 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 32px',
            fontSize: '1.08rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(76,0,130,0.07)'
          }}
          onClick={() => window.location.href = '/register'}
        >Daftar Sekarang</button>
      </div>
    </div>
  );
};

export default AdminProfilePage;
