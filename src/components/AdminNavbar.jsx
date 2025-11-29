import { useNavigate } from 'react-router-dom'
import { deleteCookie } from '../utils/cookieUtils'
import './AdminNavbar.css'

function AdminNavbar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    if (!window.confirm('Are you sure you want to logout?')) return
    
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    deleteCookie('authToken')
    deleteCookie('userInfo')
    deleteCookie('userEmail')
    
    navigate('/login', { replace: true })
  }

  const handleGoHome = () => {
    navigate('/', { replace: true })
  }

  const adminUser = localStorage.getItem('user')
  const userName = adminUser ? JSON.parse(adminUser).name : 'Admin'

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-container">
        <div className="admin-navbar-brand">
          <h2>⚙️ Admin Dashboard</h2>
        </div>

        <div className="admin-navbar-links">
          <button 
            className="admin-nav-link"
            onClick={() => navigate('/adminPanel/profile')}
            title="View Profile"
          >
            👤 View Profile
          </button>
          <button 
            className="admin-nav-link"
            onClick={() => window.scrollTo(0, 0)}
            title="Dashboard"
          >
            📊 Dashboard
          </button>
          <button 
            className="admin-nav-link"
            onClick={() => window.scrollTo(0, 0)}
            title="Courses"
          >
            📚 Courses
          </button>
          <button 
            className="admin-nav-link"
            onClick={() => window.scrollTo(0, 0)}
            title="Testimonials"
          >
            ⭐ Testimonials
          </button>
          <button 
            className="admin-nav-link"
            onClick={() => window.scrollTo(0, 0)}
            title="FAQs"
          >
            ❓ FAQs
          </button>
        </div>

        <div className="admin-navbar-menu">
          <div className="admin-user-info">
            <span className="admin-badge">👤 Admin</span>
            <span className="admin-name">{userName}</span>
          </div>

          <div className="admin-navbar-buttons">
            <button 
              className="btn btn-outline-light btn-sm"
              onClick={handleGoHome}
              title="Go to home page"
            >
              🏠 Home
            </button>
            <button 
              className="btn btn-outline-danger btn-sm"
              onClick={handleLogout}
              title="Logout from admin"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default AdminNavbar
