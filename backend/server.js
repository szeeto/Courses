
/* eslint-env node */
import express from 'express'
import cors from 'cors'
import path from 'path'
import apiRouter from './routes/api.js'
import authRouter from './routes/auth.js'
import adminRouter from './routes/admin.js'
import { initDB } from './db.js'
import { env, exit } from 'process'

const app = express()
const PORT = env.PORT ?? 4001

// CORS configuration for Vercel and local development
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  env.FRONTEND_URL || 'http://localhost:5173',
  // Add your Vercel frontend domain
  ...(env.VERCEL_URL ? [`https://${env.VERCEL_URL}`] : []),
]

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      console.warn(`CORS blocked request from origin: ${origin}`)
      callback(null, true) // Allow for now, log for debugging
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions))
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

    
  // Serve profile pictures statically
  app.use('/profile_pics', express.static(path.resolve('./public/profile_pics')))
    app.listen(PORT, () => {
      console.log(`Backend listening on http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('Failed to initialize DB', err)
    exit(1)
  }
})()
