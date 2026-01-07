import { Router } from 'express'
import { verifyToken } from './auth.js'
import { getKelas, getTestimonial, getFaq, getUserById, supabase } from '../db.js'

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
    const { data, error } = await supabase.from('kelas').insert({ title, image, price }).select().single()
    if (error) {
      console.error('Insert kelas error:', error)
      return res.status(500).json({ error: 'Failed to create course' })
    }
    res.json({
      ok: true,
      message: 'Course created',
      id: data.id,
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
    const { error } = await supabase.from('kelas').update({ title, image, price }).eq('id', id)
    if (error) {
      console.error('Update kelas error:', error)
      return res.status(500).json({ error: 'Failed to update course' })
    }
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
    const { error } = await supabase.from('kelas').delete().eq('id', id)
    if (error) {
      console.error('Delete kelas error:', error)
      return res.status(500).json({ error: 'Failed to delete course' })
    }
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
    const { data, error } = await supabase.from('testimonial').insert({ name, skill, desc, image }).select().single()
    if (error) {
      console.error('Insert testimonial error:', error)
      return res.status(500).json({ error: 'Failed to create testimonial' })
    }
    res.json({
      ok: true,
      message: 'Testimonial created',
      id: data.id,
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
    const { error } = await supabase.from('testimonial').update({ name, skill, desc, image }).eq('id', id)
    if (error) {
      console.error('Update testimonial error:', error)
      return res.status(500).json({ error: 'Failed to update testimonial' })
    }
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
    const { error } = await supabase.from('testimonial').delete().eq('id', id)
    if (error) {
      console.error('Delete testimonial error:', error)
      return res.status(500).json({ error: 'Failed to delete testimonial' })
    }
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
    const { error } = await supabase.from('faq').insert({ id, title, desc })
    if (error) {
      console.error('Insert FAQ error:', error)
      return res.status(500).json({ error: 'Failed to create FAQ' })
    }
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
    const { error } = await supabase.from('faq').update({ title, desc }).eq('id', id)
    if (error) {
      console.error('Update FAQ error:', error)
      return res.status(500).json({ error: 'Failed to update FAQ' })
    }
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
    const { error } = await supabase.from('faq').delete().eq('id', id)
    if (error) {
      console.error('Delete FAQ error:', error)
      return res.status(500).json({ error: 'Failed to delete FAQ' })
    }
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
    const { data: users, error } = await supabase.from('users').select('id, email, name, picture, created_at').order('created_at', { ascending: false })
    if (error) {
      console.error('Get users error:', error)
      return res.status(500).json({ error: 'Failed to fetch users' })
    }
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
    const { data: subscribers, error } = await supabase.from('subscribers').select('*').order('date', { ascending: false })
    if (error) {
      console.error('Get subscribers error:', error)
      return res.status(500).json({ error: 'Failed to fetch subscribers' })
    }
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
    const { error } = await supabase.from('subscribers').delete().eq('id', id)
    if (error) {
      console.error('Delete subscriber error:', error)
      return res.status(500).json({ error: 'Failed to remove subscriber' })
    }
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
    const { count: kelasCount, error: kelasError } = await supabase.from('kelas').select('*', { count: 'exact', head: true })
    const { count: testimoniCount, error: testimoniError } = await supabase.from('testimonial').select('*', { count: 'exact', head: true })
    const { count: faqCount, error: faqError } = await supabase.from('faq').select('*', { count: 'exact', head: true })
    const { count: usersCount, error: usersError } = await supabase.from('users').select('*', { count: 'exact', head: true })
    const { count: subscribersCount, error: subscribersError } = await supabase.from('subscribers').select('*', { count: 'exact', head: true })

    if (kelasError || testimoniError || faqError || usersError || subscribersError) {
      console.error('Stats error:', { kelasError, testimoniError, faqError, usersError, subscribersError })
      return res.status(500).json({ error: 'Failed to fetch stats' })
    }

    res.json({
      ok: true,
      data: {
        courses: kelasCount,
        testimonials: testimoniCount,
        faqs: faqCount,
        users: usersCount,
        subscribers: subscribersCount,
      },
    })
  } catch (err) {
    console.error('Get stats error:', err)
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
})

export default router
