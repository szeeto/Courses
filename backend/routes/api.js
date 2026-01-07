import { Router } from 'express'
import { getKelas, getTestimonial, getFaq, addSubscriber } from '../db.js'

const router = Router()

router.get('/kelas', async (req, res) => {
  try {
    const rows = await getKelas()
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/testimoni', async (req, res) => {
  try {
    const rows = await getTestimonial()
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/faq', async (req, res) => {
  try {
    const rows = await getFaq()
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/subscribe', async (req, res) => {
  const { email } = req.body
  if(!email) return res.status(400).json({ error: 'email required' })
  try {
    const added = await addSubscriber(email)
    if(!added) return res.status(409).json({ error: 'already subscribed' })
    return res.json({ ok: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
