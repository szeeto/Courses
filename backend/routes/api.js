import express from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../server.js';

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// Get all courses/kelas
router.get('/courses', async (req, res) => {
  try {
    const { data: courses, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Courses fetch error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch courses'
      });
    }

    res.json({
      success: true,
      courses: courses || []
    });

  } catch (error) {
    console.error('Courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get course by ID
router.get('/courses/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: course, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Course fetch error:', error);
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.json({
      success: true,
      course
    });

  } catch (error) {
    console.error('Course error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get testimonials
router.get('/testimonials', async (req, res) => {
  try {
    const { data: testimonials, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Testimonials fetch error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch testimonials'
      });
    }

    res.json({
      success: true,
      testimonials: testimonials || []
    });

  } catch (error) {
    console.error('Testimonials error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get FAQ
router.get('/faq', async (req, res) => {
  try {
    const { data: faq, error } = await supabase
      .from('faq')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('FAQ fetch error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch FAQ'
      });
    }

    res.json({
      success: true,
      faq: faq || []
    });

  } catch (error) {
    console.error('FAQ error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Contact form submission
router.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required'
      });
    }

    const { data, error } = await supabase
      .from('contacts')
      .insert([
        {
          name,
          email,
          subject: subject || 'General Inquiry',
          message,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Contact submission error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to submit contact form'
      });
    }

    res.json({
      success: true,
      message: 'Contact form submitted successfully',
      contact: data
    });

  } catch (error) {
    console.error('Contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get user profile (protected route)
router.get('/user/profile', authenticateToken, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, role, created_at')
      .eq('id', req.user.id)
      .single();

    if (error || !user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('User profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update user profile (protected route)
router.put('/user/profile', authenticateToken, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
      });
    }

    const { data, error } = await supabase
      .from('users')
      .update({ name })
      .eq('id', req.user.id)
      .select('id, name, email, role, created_at')
      .single();

    if (error) {
      console.error('Profile update error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update profile'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: data
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
