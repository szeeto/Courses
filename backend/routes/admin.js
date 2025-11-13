import { Router } from 'express'
import { verifyToken } from './auth.js'
import { getKelas, getTestimonial, getFaq, getUserById, pool } from '../db.js'

const router = Router()

// Admin middleware - check if user is admin (you can customize this)
async function isAdmin(req, res, next) {
  try {
    // For development, use a hardcoded admin email or check user role
    // In production, add an 'is_admin' or 'role' column to users table
    const ADMIN_EMAILS = ['patrasawali93@gmail.com'] // Update this with your admin emails
    const user = await getUserById(req.userId)
    
    if (!user || !ADMIN_EMAILS.includes(user.email)) {
      return res.status(403).json({ error: 'Unauthorized - Admin access required' })
    }
    
    req.user = user
    next()
  } catch (err) {
    console.error('Admin check error:', err)
    res.status(500).json({ error: 'Failed to verify admin status' })
  }
}

// ==================== KELAS (Courses) ====================

// GET all courses
router.get('/kelas', async (req, res) => {
  try {
    const kelas = await getKelas()
    res.json({ ok: true, data: kelas })
  } catch (err) {
    console.error('Get kelas error:', err)
    res.status(500).json({ error: 'Failed to fetch courses' })
  }
})

// POST create course (admin only)
router.post('/kelas', verifyToken, isAdmin, async (req, res) => {
  const { title, image, price } = req.body
  if (!title || !image || !price) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO kelas (title, image, price) VALUES (?, ?, ?)',
      [title, image, price]
    )
    res.json({
      ok: true,
      message: 'Course created',
      id: result.insertId,
    })
  } catch (err) {
    console.error('Create kelas error:', err)
    res.status(500).json({ error: 'Failed to create course' })
  }
})

// PUT update course (admin only)
router.put('/kelas/:id', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params
  const { title, image, price } = req.body

  try {
    await pool.query('UPDATE kelas SET title = ?, image = ?, price = ? WHERE id = ?', [
      title,
      image,
      price,
      id,
    ])
    res.json({ ok: true, message: 'Course updated' })
  } catch (err) {
    console.error('Update kelas error:', err)
    res.status(500).json({ error: 'Failed to update course' })
  }
})

// DELETE course (admin only)
router.delete('/kelas/:id', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params

  try {
    await pool.query('DELETE FROM kelas WHERE id = ?', [id])
    res.json({ ok: true, message: 'Course deleted' })
  } catch (err) {
    console.error('Delete kelas error:', err)
    res.status(500).json({ error: 'Failed to delete course' })
  }
})

// ==================== TESTIMONIAL ====================

// GET all testimonials
router.get('/testimonial', async (req, res) => {
  try {
    const testimonial = await getTestimonial()
    res.json({ ok: true, data: testimonial })
  } catch (err) {
    console.error('Get testimonial error:', err)
    res.status(500).json({ error: 'Failed to fetch testimonials' })
  }
})

// POST create testimonial (admin only)
router.post('/testimonial', verifyToken, isAdmin, async (req, res) => {
  const { name, skill, desc, image } = req.body
  if (!name || !skill || !desc || !image) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO testimonial (name, skill, `desc`, image) VALUES (?, ?, ?, ?)',
      [name, skill, desc, image]
    )
    res.json({
      ok: true,
      message: 'Testimonial created',
      id: result.insertId,
    })
  } catch (err) {
    console.error('Create testimonial error:', err)
    res.status(500).json({ error: 'Failed to create testimonial' })
  }
})

// PUT update testimonial (admin only)
router.put('/testimonial/:id', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params
  const { name, skill, desc, image } = req.body

  try {
    await pool.query(
      'UPDATE testimonial SET name = ?, skill = ?, `desc` = ?, image = ? WHERE id = ?',
      [name, skill, desc, image, id]
    )
    res.json({ ok: true, message: 'Testimonial updated' })
  } catch (err) {
    console.error('Update testimonial error:', err)
    res.status(500).json({ error: 'Failed to update testimonial' })
  }
})

// DELETE testimonial (admin only)
router.delete('/testimonial/:id', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params

  try {
    await pool.query('DELETE FROM testimonial WHERE id = ?', [id])
    res.json({ ok: true, message: 'Testimonial deleted' })
  } catch (err) {
    console.error('Delete testimonial error:', err)
    res.status(500).json({ error: 'Failed to delete testimonial' })
  }
})

// ==================== FAQ ====================

// GET all FAQs
router.get('/faq', async (req, res) => {
  try {
    const faq = await getFaq()
    res.json({ ok: true, data: faq })
  } catch (err) {
    console.error('Get FAQ error:', err)
    res.status(500).json({ error: 'Failed to fetch FAQs' })
  }
})

// POST create FAQ (admin only)
router.post('/faq', verifyToken, isAdmin, async (req, res) => {
  const { title, desc } = req.body
  if (!title || !desc) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    const id = `faq-${Date.now()}`
    await pool.query('INSERT INTO faq (id, title, `desc`) VALUES (?, ?, ?)', [id, title, desc])
    res.json({
      ok: true,
      message: 'FAQ created',
      id: id,
    })
  } catch (err) {
    console.error('Create FAQ error:', err)
    res.status(500).json({ error: 'Failed to create FAQ' })
  }
})

// PUT update FAQ (admin only)
router.put('/faq/:id', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params
  const { title, desc } = req.body

  try {
    await pool.query('UPDATE faq SET title = ?, `desc` = ? WHERE id = ?', [title, desc, id])
    res.json({ ok: true, message: 'FAQ updated' })
  } catch (err) {
    console.error('Update FAQ error:', err)
    res.status(500).json({ error: 'Failed to update FAQ' })
  }
})

// DELETE FAQ (admin only)
router.delete('/faq/:id', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params

  try {
    await pool.query('DELETE FROM faq WHERE id = ?', [id])
    res.json({ ok: true, message: 'FAQ deleted' })
  } catch (err) {
    console.error('Delete FAQ error:', err)
    res.status(500).json({ error: 'Failed to delete FAQ' })
  }
})

// ==================== USERS ====================

// GET all users (admin only)
router.get('/users', verifyToken, isAdmin, async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, email, name, picture, created_at FROM users ORDER BY created_at DESC')
    res.json({ ok: true, data: users })
  } catch (err) {
    console.error('Get users error:', err)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

// GET user by ID (admin only)
router.get('/users/:id', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params
  try {
    const user = await getUserById(id)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json({ ok: true, data: user })
  } catch (err) {
    console.error('Get user error:', err)
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

// ==================== SUBSCRIBERS ====================

// GET all subscribers (admin only)
router.get('/subscribers', verifyToken, isAdmin, async (req, res) => {
  try {
    const [subscribers] = await pool.query('SELECT * FROM subscribers ORDER BY date DESC')
    res.json({ ok: true, data: subscribers })
  } catch (err) {
    console.error('Get subscribers error:', err)
    res.status(500).json({ error: 'Failed to fetch subscribers' })
  }
})

// DELETE subscriber (admin only)
router.delete('/subscribers/:id', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params

  try {
    await pool.query('DELETE FROM subscribers WHERE id = ?', [id])
    res.json({ ok: true, message: 'Subscriber removed' })
  } catch (err) {
    console.error('Delete subscriber error:', err)
    res.status(500).json({ error: 'Failed to delete subscriber' })
  }
})

// ==================== ADMIN STATS ====================

// GET dashboard stats (admin only)
router.get('/stats', verifyToken, isAdmin, async (req, res) => {
  try {
    const [kelasCount] = await pool.query('SELECT COUNT(*) as count FROM kelas')
    const [testimoniCount] = await pool.query('SELECT COUNT(*) as count FROM testimonial')
    const [faqCount] = await pool.query('SELECT COUNT(*) as count FROM faq')
    const [usersCount] = await pool.query('SELECT COUNT(*) as count FROM users')
    const [subscribersCount] = await pool.query('SELECT COUNT(*) as count FROM subscribers')

    res.json({
      ok: true,
      data: {
        courses: kelasCount[0].count,
        testimonials: testimoniCount[0].count,
        faqs: faqCount[0].count,
        users: usersCount[0].count,
        subscribers: subscribersCount[0].count,
      },
    })
  } catch (err) {
    console.error('Get stats error:', err)
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
})

export default router
