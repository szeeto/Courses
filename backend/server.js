/* eslint-env node */
import express from 'express'
import cors from 'cors'
import apiRouter from './routes/api.js'
import authRouter from './routes/auth.js'
import adminRouter from './routes/admin.js'
import { initDB } from './db.js'
import { env, exit } from 'process'

const app = express()
const PORT = env.PORT ?? 4000

app.use(cors())
app.use(express.json())

// Initialize DB then mount routes and start server
;(async () => {
  try {
    await initDB()
    app.use('/api', apiRouter)
    app.use('/auth', authRouter)
    app.use('/admin', adminRouter)

    app.get('/', (req, res) => {
      res.send({ status: 'ok', message: 'Courses backend is running' })
    })

    app.listen(PORT, () => {
      console.log(`Backend listening on http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('Failed to initialize DB', err)
    exit(1)
  }
})()
