import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserProfilePage.css';

function UserProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // State untuk edit profil
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${backendUrl}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch user profile');
        const data = await res.json();
        setUser(data.data);
        setEditName(data.data.name || '');
        setEditEmail(data.data.email || '');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token, backendUrl, navigate]);


  if (loading) return <div className="profile-container"><p>Loading...</p></div>;
  if (error) return <div className="profile-container"><p className="error">{error}</p></div>;

  if (!user) return null;

  const handleEdit = () => {
    setEditMode(true);
    setEditName(user.name);
    setEditEmail(user.email);
    setSaveMsg('');
  };

  const handleCancel = () => {
    setEditMode(false);
    setSaveMsg('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setSaveMsg('');
    try {
      const res = await fetch(`${backendUrl}/auth/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: editName, email: editEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal update profil');
      setUser((prev) => ({ ...prev, name: editName, email: editEmail }));
      localStorage.setItem('user', JSON.stringify({ ...user, name: editName, email: editEmail }));
      setSaveMsg('Profil berhasil diperbarui!');
      setEditMode(false);
    } catch (err) {
      setSaveMsg(err.message);
    }
    setSaveLoading(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-avatar-section">
          {user.picture ? (
            <img src={user.picture} alt="Profile" className="profile-avatar" />
          ) : (
            <div className="profile-avatar default">
              <svg width="64" height="64" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#B2E3F6"/><path d="M16 17.5c2.485 0 4.5-2.015 4.5-4.5s-2.015-4.5-4.5-4.5-4.5 2.015-4.5 4.5 2.015 4.5 4.5 4.5Zm0 2c-3.038 0-9 1.523-9 4.5V26h18v-2c0-2.977-5.962-4.5-9-4.5Z" fill="#2B3A4A"/></svg>
            </div>
          )}
        </div>
        <div className="profile-info">
          {editMode ? (
            <form className="profile-edit-form" onSubmit={handleSave}>
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="profile-edit-input"
                placeholder="Nama"
                required
                disabled={saveLoading}
              />
              <input
                type="email"
                value={editEmail}
                onChange={e => setEditEmail(e.target.value)}
                className="profile-edit-input"
                placeholder="Email"
                required
                disabled={saveLoading}
              />
              <div className="profile-edit-actions">
                <button type="submit" className="profile-edit-save" disabled={saveLoading}>{saveLoading ? 'Menyimpan...' : 'Simpan'}</button>
                <button type="button" className="profile-edit-cancel" onClick={handleCancel} disabled={saveLoading}>Batal</button>
              </div>
              {saveMsg && <div className="profile-edit-msg">{saveMsg}</div>}
            </form>
          ) : (
            <>
              <h2>{user.name}</h2>
              <div className="profile-email">{user.email}</div>
              <div className="profile-meta">
                <span>Member since: {new Date(user.created_at).toLocaleDateString()}</span>
              </div>
              <button className="profile-edit-btn" onClick={handleEdit}>Edit Profil</button>
              {saveMsg && <div className="profile-edit-msg">{saveMsg}</div>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;
