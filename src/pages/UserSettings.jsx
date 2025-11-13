import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteCookie } from '../utils/cookieUtils'
import './UserSettings.css'

function UserSettings() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '' })
  const navigate = useNavigate()

  const token = localStorage.getItem('authToken')
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true })
      return
    }
    
    const fetchUserProfile = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${backendUrl}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error('Failed to fetch profile')
        const data = await res.json()
        setUser(data.data)
        setFormData({ name: data.data.name, email: data.data.email })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchUserProfile()
  }, [token, navigate, backendUrl])

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email) {
      setError('All fields are required')
      return
    }

    try {
      setLoading(true)
      const res = await fetch(`${backendUrl}/auth/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to update profile')
      }

      const data = await res.json()
      setUser(data.data)
      setSuccess('Profile updated successfully')
      setEditMode(false)
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(data.data))
      
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    if (!window.confirm('Are you sure you want to logout?')) return

    console.log('Logging out...')
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    deleteCookie('authToken')
    deleteCookie('userInfo')
    deleteCookie('userEmail')
    console.log('All session data cleared')
    navigate('/login', { replace: true })
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure? This action cannot be undone!')) return

    try {
      setLoading(true)
      const res = await fetch(`${backendUrl}/auth/delete-account`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) throw new Error('Failed to delete account')

      // Clear session
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      deleteCookie('authToken')
      deleteCookie('userInfo')
      deleteCookie('userEmail')

      setSuccess('Account deleted successfully')
      setTimeout(() => navigate('/'), 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading && !user) {
    return <div className="settings-container"><p>Loading...</p></div>
  }

  return (
    <div className="settings-container">
      <div className="settings-wrapper">
        <div className="settings-header">
          <h1>User Settings</h1>
          <button className="btn-back" onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {user && (
          <div className="settings-content">
            {/* Profile Section */}
            <div className="settings-section">
              <div className="section-header">
                <h2>Profile Information</h2>
                <button
                  className={`btn-edit-toggle ${editMode ? 'active' : ''}`}
                  onClick={() => setEditMode(!editMode)}
                >
                  {editMode ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              {editMode ? (
                <form onSubmit={handleUpdateProfile} className="profile-form">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Your email"
                    />
                  </div>
                  <button type="submit" className="btn-save" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              ) : (
                <div className="profile-display">
                  <div className="profile-item">
                    <span className="label">Name:</span>
                    <span className="value">{user.name}</span>
                  </div>
                  <div className="profile-item">
                    <span className="label">Email:</span>
                    <span className="value">{user.email}</span>
                  </div>
                  {user.picture && (
                    <div className="profile-item">
                      <span className="label">Profile Picture:</span>
                      <img src={user.picture} alt="Profile" className="profile-pic" />
                    </div>
                  )}
                  <div className="profile-item">
                    <span className="label">Member Since:</span>
                    <span className="value">{new Date(user.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Account Section */}
            <div className="settings-section account-section">
              <h2>Account Settings</h2>
              
              <div className="account-actions">
                <button className="btn-logout" onClick={handleLogout} disabled={loading}>
                  🚪 Logout
                </button>
                <button className="btn-delete" onClick={handleDeleteAccount} disabled={loading}>
                  🗑️ Delete Account
                </button>
              </div>
            </div>

            {/* Session Info */}
            <div className="settings-section session-section">
              <h2>Session Information</h2>
              <div className="session-info">
                <p>
                  <strong>Logged In:</strong> Yes
                </p>
                <p>
                  <strong>Token Status:</strong> <span className="status-active">Active</span>
                </p>
                <p>
                  <strong>Last Login:</strong> Today
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserSettings
