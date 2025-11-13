import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteCookie } from '../utils/cookieUtils'
import './AdminPage.css'

function AdminPage() {
  const [stats, setStats] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [courses, setCourses] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [faqs, setFaqs] = useState([])
  const [users, setUsers] = useState([])
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const token = localStorage.getItem('authToken')
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

  useEffect(() => {
    if (!token) {
      // Redirect to login if no token
      navigate('/login', { replace: true })
      return
    }
    fetchStats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch(`${backendUrl}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to fetch stats')
      const data = await res.json()
      setStats(data.data)
    } catch (err) {
      setError(err.message)
    }
  }

  const fetchCourses = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${backendUrl}/admin/kelas`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to fetch courses')
      const data = await res.json()
      setCourses(data.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchTestimonials = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${backendUrl}/admin/testimonial`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to fetch testimonials')
      const data = await res.json()
      setTestimonials(data.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchFaqs = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${backendUrl}/admin/faq`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to fetch FAQs')
      const data = await res.json()
      setFaqs(data.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${backendUrl}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to fetch users')
      const data = await res.json()
      setUsers(data.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchSubscribers = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${backendUrl}/admin/subscribers`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to fetch subscribers')
      const data = await res.json()
      setSubscribers(data.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setError('')
    if (tab === 'courses') fetchCourses()
    else if (tab === 'testimonials') fetchTestimonials()
    else if (tab === 'faqs') fetchFaqs()
    else if (tab === 'users') fetchUsers()
    else if (tab === 'subscribers') fetchSubscribers()
  }

  const handleLogout = () => {
    console.log('Logging out...')
    // Clear localStorage
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    
    // Clear cookies
    deleteCookie('authToken')
    deleteCookie('userInfo')
    deleteCookie('userEmail')
    
    console.log('All session data cleared')
    navigate('/login', { replace: true })
  }

  const deleteCourse = async (id) => {
    if (!window.confirm('Are you sure?')) return
    try {
      const res = await fetch(`${backendUrl}/admin/kelas/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to delete course')
      fetchCourses()
    } catch (err) {
      setError(err.message)
    }
  }

  const deleteTestimonial = async (id) => {
    if (!window.confirm('Are you sure?')) return
    try {
      const res = await fetch(`${backendUrl}/admin/testimonial/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to delete testimonial')
      fetchTestimonials()
    } catch (err) {
      setError(err.message)
    }
  }

  const deleteFaq = async (id) => {
    if (!window.confirm('Are you sure?')) return
    try {
      const res = await fetch(`${backendUrl}/admin/faq/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to delete FAQ')
      fetchFaqs()
    } catch (err) {
      setError(err.message)
    }
  }

  if (error && error.includes('You must be logged in')) {
    return <div className="admin-error">{error}</div>
  }

  if (!token) {
    return null // User is being redirected to login
  }

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <h2>Admin Panel</h2>
        <nav className="admin-nav">
          <button
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleTabChange('dashboard')}
          >
            📊 Dashboard
          </button>
          <button
            className={`nav-item ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => handleTabChange('courses')}
          >
            📚 Courses
          </button>
          <button
            className={`nav-item ${activeTab === 'testimonials' ? 'active' : ''}`}
            onClick={() => handleTabChange('testimonials')}
          >
            ⭐ Testimonials
          </button>
          <button
            className={`nav-item ${activeTab === 'faqs' ? 'active' : ''}`}
            onClick={() => handleTabChange('faqs')}
          >
            ❓ FAQs
          </button>
          <button
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => handleTabChange('users')}
          >
            👥 Users
          </button>
          <button
            className={`nav-item ${activeTab === 'subscribers' ? 'active' : ''}`}
            onClick={() => handleTabChange('subscribers')}
          >
            📧 Subscribers
          </button>
          <button className="nav-item logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </nav>
      </div>

      <div className="admin-content">
        <h1>Admin Dashboard</h1>

        {error && <div className="alert alert-danger">{error}</div>}

        {activeTab === 'dashboard' && stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-info">
                <h3>Courses</h3>
                <p className="stat-number">{stats.courses}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-info">
                <h3>Testimonials</h3>
                <p className="stat-number">{stats.testimonials}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">❓</div>
              <div className="stat-info">
                <h3>FAQs</h3>
                <p className="stat-number">{stats.faqs}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <h3>Users</h3>
                <p className="stat-number">{stats.users}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📧</div>
              <div className="stat-info">
                <h3>Subscribers</h3>
                <p className="stat-number">{stats.subscribers}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="table-section">
            <h2>Manage Courses</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id}>
                      <td>{course.id}</td>
                      <td>{course.title}</td>
                      <td>{course.price}</td>
                      <td>
                        <button className="btn-edit">Edit</button>
                        <button className="btn-delete" onClick={() => deleteCourse(course.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'testimonials' && (
          <div className="table-section">
            <h2>Manage Testimonials</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Skill</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {testimonials.map((testimonial) => (
                    <tr key={testimonial.id}>
                      <td>{testimonial.id}</td>
                      <td>{testimonial.name}</td>
                      <td>{testimonial.skill}</td>
                      <td>
                        <button className="btn-edit">Edit</button>
                        <button className="btn-delete" onClick={() => deleteTestimonial(testimonial.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'faqs' && (
          <div className="table-section">
            <h2>Manage FAQs</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {faqs.map((faq) => (
                    <tr key={faq.id}>
                      <td>{faq.id}</td>
                      <td>{faq.title}</td>
                      <td>
                        <button className="btn-edit">Edit</button>
                        <button className="btn-delete" onClick={() => deleteFaq(faq.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="table-section">
            <h2>Manage Users</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.email}</td>
                      <td>{user.name}</td>
                      <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'subscribers' && (
          <div className="table-section">
            <h2>Manage Subscribers</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((sub) => (
                    <tr key={sub.id}>
                      <td>{sub.email}</td>
                      <td>{new Date(sub.date).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="btn-delete"
                          onClick={() => {
                            if (window.confirm('Remove subscriber?')) {
                              fetch(`${backendUrl}/admin/subscribers/${sub.id}`, {
                                method: 'DELETE',
                                headers: { Authorization: `Bearer ${token}` },
                              })
                                .then(() => fetchSubscribers())
                                .catch((err) => setError(err.message))
                            }
                          }}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPage
