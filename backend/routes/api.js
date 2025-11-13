import { Router } from 'express'
import { getKelas, getTestimonial, getFaq, addSubscriber } from '../db.js'

const router = Router()

router.get('/kelas', (req, res) => {
  const rows = getKelas()
  res.json(rows)
})

router.get('/testimoni', (req, res) => {
  const rows = getTestimonial()
  res.json(rows)
})

router.get('/faq', (req, res) => {
  const rows = getFaq()
  res.json(rows)
})

router.post('/subscribe', (req, res) => {
  const { email } = req.body
  if(!email) return res.status(400).json({ error: 'email required' })
  const added = addSubscriber(email)
  if(!added) return res.status(409).json({ error: 'already subscribed' })
  return res.json({ ok: true })
})

export default router
