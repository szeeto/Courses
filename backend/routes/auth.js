import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library'
import { createOrUpdateUser, getUserById } from '../db.js'
import { env } from 'process'

const router = Router()

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID)
const JWT_SECRET = env.JWT_SECRET || 'your-secret-key-change-in-production'

// Verify token middleware
export function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'No token provided' })
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.userId = decoded.userId
    next()
  } catch (err) {
    console.error('Token verification error:', err)
    return res.status(401).json({ error: 'Invalid token' })
  }
}

// Google Sign In
router.post('/google-signin', async (req, res) => {
  const { token } = req.body
  if (!token) return res.status(400).json({ error: 'Token required' })

  try {
    console.log('Processing Google Sign In...')
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    const { sub: googleId, email, name, picture } = payload
    
    console.log('Google payload verified:', { googleId, email, name })

    let user = await createOrUpdateUser(googleId, email, name, picture)
    if (!user) {
      console.error('Failed to create/update user in database')
      return res.status(500).json({ error: 'Failed to create/update user' })
    }

    console.log('User saved to database:', { id: user.id, email: user.email, name: user.name })

    // Create JWT token
    const jwtToken = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '30d',
    })

    console.log('JWT token generated for user:', user.id)

    return res.json({
      ok: true,
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
    })
  } catch (err) {
    console.error('Google signin error:', err)
    return res.status(401).json({ error: 'Invalid token' })
  }
})

// Get current user
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await getUserById(req.userId)
    if (!user) return res.status(404).json({ error: 'User not found' })
    return res.json({ ok: true, user })
  } catch (err) {
    console.error('Get user error:', err)
    return res.status(500).json({ error: 'Failed to get user' })
  }
})

// Logout (client-side handled, but optional backend route)
router.post('/logout', verifyToken, (req, res) => {
  console.log('User logout:', req.userId)
  // Token is typically invalidated on client side
  return res.json({ ok: true, message: 'Logged out successfully' })
})

// Check auth status
router.get('/status', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.json({ authenticated: false })
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return res.json({ 
      authenticated: true, 
      userId: decoded.userId,
      email: decoded.email 
    })
  } catch {
    return res.json({ authenticated: false })
  }
})

export default router
