import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteCookie } from '../utils/cookieUtils'
import Modal from '../components/Modal'
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
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  // Modal states
  const [modals, setModals] = useState({
    courseModal: false,
    testimonialModal: false,
    faqModal: false,
  })

  // Form states
  const [courseForm, setCourseForm] = useState({ id: null, title: '', image: '', price: '' })
  const [testimonialForm, setTestimonialForm] = useState({ id: null, name: '', skill: '', desc: '', image: '' })
  const [faqForm, setFaqForm] = useState({ id: null, title: '', desc: '' })

  const token = localStorage.getItem('authToken')
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

  // ==================== USEEFFECT ====================
  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true })
      return
    }
    fetchStats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, navigate])

  // ==================== HELPER FUNCTIONS ====================

  const closeModal = (modalName) => {
    setModals((prev) => ({ ...prev, [modalName]: false }))
    setError('')
  }

  const openModal = (modalName) => {
    setModals((prev) => ({ ...prev, [modalName]: true }))
  }

  // ==================== COURSE CRUD ====================

  const openCourseModal = (course = null) => {
    if (course) {
      setCourseForm(course)
    } else {
      setCourseForm({ id: null, title: '', image: '', price: '' })
    }
    openModal('courseModal')
  }

  const handleSaveCourse = async () => {
    if (!courseForm.title || !courseForm.image || !courseForm.price) {
      setError('All fields are required')
      return
    }

    try {
      setLoading(true)
      const method = courseForm.id ? 'PUT' : 'POST'
      const url = courseForm.id ? `${backendUrl}/admin/kelas/${courseForm.id}` : `${backendUrl}/admin/kelas`

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(courseForm),
      })

      if (!res.ok) throw new Error('Failed to save course')
      closeModal('courseModal')
      setSuccess(courseForm.id ? 'Course updated' : 'Course created')
      fetchCourses()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ==================== TESTIMONIAL CRUD ====================

  const openTestimonialModal = (testimonial = null) => {
    if (testimonial) {
      setTestimonialForm(testimonial)
    } else {
      setTestimonialForm({ id: null, name: '', skill: '', desc: '', image: '' })
    }
    openModal('testimonialModal')
  }

  const handleSaveTestimonial = async () => {
    if (!testimonialForm.name || !testimonialForm.skill || !testimonialForm.desc || !testimonialForm.image) {
      setError('All fields are required')
      return
    }

    try {
      setLoading(true)
      const method = testimonialForm.id ? 'PUT' : 'POST'
      const url = testimonialForm.id ? `${backendUrl}/admin/testimonial/${testimonialForm.id}` : `${backendUrl}/admin/testimonial`

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(testimonialForm),
      })

      if (!res.ok) throw new Error('Failed to save testimonial')
      closeModal('testimonialModal')
      setSuccess(testimonialForm.id ? 'Testimonial updated' : 'Testimonial created')
      fetchTestimonials()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ==================== FAQ CRUD ====================

  const openFaqModal = (faq = null) => {
    if (faq) {
      setFaqForm(faq)
    } else {
      setFaqForm({ id: null, title: '', desc: '' })
    }
    openModal('faqModal')
  }

  const handleSaveFaq = async () => {
    if (!faqForm.title || !faqForm.desc) {
      setError('All fields are required')
      return
    }

    try {
      setLoading(true)
      const method = faqForm.id ? 'PUT' : 'POST'
      const url = faqForm.id ? `${backendUrl}/admin/faq/${faqForm.id}` : `${backendUrl}/admin/faq`

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(faqForm),
      })

      if (!res.ok) throw new Error('Failed to save FAQ')
      closeModal('faqModal')
      setSuccess(faqForm.id ? 'FAQ updated' : 'FAQ created')
      fetchFaqs()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ==================== FETCH FUNCTIONS ====================

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
    else if (tab === 'dashboard') fetchStats()
  }

  const handleLogout = () => {
    console.log('Logging out...')
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
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
      setSuccess('Course deleted')
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
      setSuccess('Testimonial deleted')
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
      setSuccess('FAQ deleted')
      fetchFaqs()
    } catch (err) {
      setError(err.message)
    }
  }

  if (error && error.includes('You must be logged in')) {
    return <div className="admin-error">{error}</div>
  }

  if (!token) {
    return null
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
        <div className="admin-header">
          <div className="admin-header-left">
            <div>
              <h1 className="admin-header-title">⚙️ Admin Dashboard</h1>
              <p className="admin-header-subtitle">Manage your courses, testimonials, FAQs, and more</p>
            </div>
          </div>
          <div className="admin-header-right">
            <div className="admin-user-badge">
              👤 {localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).name : 'Admin'}
            </div>
            <div className="admin-header-buttons">
              <button onClick={() => window.location.href = '/'} title="Go to home page">🏠 Home</button>
              <button 
                className="btn-danger"
                onClick={() => {
                  if (window.confirm('Are you sure you want to logout?')) {
                    localStorage.removeItem('authToken')
                    localStorage.removeItem('user')
                    window.location.href = '/login'
                  }
                }}
                title="Logout"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

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
            <div className="section-header">
              <h2>Manage Courses</h2>
              <button className="btn-create" onClick={() => openCourseModal()}>
                ➕ Add Course
              </button>
            </div>
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
                        <button className="btn-edit" onClick={() => openCourseModal(course)}>
                          Edit
                        </button>
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
            <div className="section-header">
              <h2>Manage Testimonials</h2>
              <button className="btn-create" onClick={() => openTestimonialModal()}>
                ➕ Add Testimonial
              </button>
            </div>
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
                        <button className="btn-edit" onClick={() => openTestimonialModal(testimonial)}>
                          Edit
                        </button>
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
            <div className="section-header">
              <h2>Manage FAQs</h2>
              <button className="btn-create" onClick={() => openFaqModal()}>
                ➕ Add FAQ
              </button>
            </div>
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
                        <button className="btn-edit" onClick={() => openFaqModal(faq)}>
                          Edit
                        </button>
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
                                .then(() => {
                                  setSuccess('Subscriber removed')
                                  fetchSubscribers()
                                })
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

        {/* MODALS */}

        {/* Course Modal */}
        <Modal
          isOpen={modals.courseModal}
          title={courseForm.id ? 'Edit Course' : 'Add Course'}
          onClose={() => closeModal('courseModal')}
          onSubmit={handleSaveCourse}
          submitLabel={loading ? 'Saving...' : 'Save'}
        >
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              value={courseForm.title}
              onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
              placeholder="Course title"
            />
          </div>
          <div className="form-group">
            <label>Image URL *</label>
            <input
              type="text"
              value={courseForm.image}
              onChange={(e) => setCourseForm({ ...courseForm, image: e.target.value })}
              placeholder="Image URL"
            />
          </div>
          <div className="form-group">
            <label>Price *</label>
            <input
              type="text"
              value={courseForm.price}
              onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
              placeholder="Price"
            />
          </div>
        </Modal>

        {/* Testimonial Modal */}
        <Modal
          isOpen={modals.testimonialModal}
          title={testimonialForm.id ? 'Edit Testimonial' : 'Add Testimonial'}
          onClose={() => closeModal('testimonialModal')}
          onSubmit={handleSaveTestimonial}
          submitLabel={loading ? 'Saving...' : 'Save'}
        >
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              value={testimonialForm.name}
              onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
              placeholder="Person's name"
            />
          </div>
          <div className="form-group">
            <label>Skill *</label>
            <input
              type="text"
              value={testimonialForm.skill}
              onChange={(e) => setTestimonialForm({ ...testimonialForm, skill: e.target.value })}
              placeholder="Skill/Profession"
            />
          </div>
          <div className="form-group">
            <label>Description *</label>
            <textarea
              value={testimonialForm.desc}
              onChange={(e) => setTestimonialForm({ ...testimonialForm, desc: e.target.value })}
              placeholder="Testimonial description"
            />
          </div>
          <div className="form-group">
            <label>Image URL *</label>
            <input
              type="text"
              value={testimonialForm.image}
              onChange={(e) => setTestimonialForm({ ...testimonialForm, image: e.target.value })}
              placeholder="Image URL"
            />
          </div>
        </Modal>

        {/* FAQ Modal */}
        <Modal
          isOpen={modals.faqModal}
          title={faqForm.id ? 'Edit FAQ' : 'Add FAQ'}
          onClose={() => closeModal('faqModal')}
          onSubmit={handleSaveFaq}
          submitLabel={loading ? 'Saving...' : 'Save'}
        >
          <div className="form-group">
            <label>Question *</label>
            <input
              type="text"
              value={faqForm.title}
              onChange={(e) => setFaqForm({ ...faqForm, title: e.target.value })}
              placeholder="FAQ question"
            />
          </div>
          <div className="form-group">
            <label>Answer *</label>
            <textarea
              value={faqForm.desc}
              onChange={(e) => setFaqForm({ ...faqForm, desc: e.target.value })}
              placeholder="FAQ answer"
            />
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default AdminPage
