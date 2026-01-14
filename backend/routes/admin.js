import express from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../server.js';

const router = express.Router();

// Middleware to verify JWT token and admin role
const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production');

    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// Get all users
router.get('/users', authenticateAdmin, async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, email, role, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Users fetch error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch users'
      });
    }

    res.json({
      success: true,
      users: users || []
    });

  } catch (error) {
    console.error('Users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update user role
router.put('/users/:id/role', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be user or admin'
      });
    }

    const { data, error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', id)
      .select('id, name, email, role, created_at')
      .single();

    if (error) {
      console.error('Role update error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update user role'
      });
    }

    res.json({
      success: true,
      message: 'User role updated successfully',
      user: data
    });

  } catch (error) {
    console.error('Role update error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete user
router.delete('/users/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('User delete error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete user'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('User delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all courses for admin management
router.get('/courses', authenticateAdmin, async (req, res) => {
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

// Create new course
router.post('/courses', authenticateAdmin, async (req, res) => {
  try {
    const { title, description, image_url, price, duration, level } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }

    const { data, error } = await supabase
      .from('courses')
      .insert([
        {
          title,
          description,
          image_url: image_url || null,
          price: price || 0,
          duration: duration || null,
          level: level || 'beginner',
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Course creation error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create course'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      course: data
    });

  } catch (error) {
    console.error('Course creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update course
router.put('/courses/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image_url, price, duration, level } = req.body;

    const { data, error } = await supabase
      .from('courses')
      .update({
        title,
        description,
        image_url,
        price,
        duration,
        level
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Course update error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update course'
      });
    }

    res.json({
      success: true,
      message: 'Course updated successfully',
      course: data
    });

  } catch (error) {
    console.error('Course update error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete course
router.delete('/courses/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Course delete error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete course'
      });
    }

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });

  } catch (error) {
    console.error('Course delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get contact submissions
router.get('/contacts', authenticateAdmin, async (req, res) => {
  try {
    const { data: contacts, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Contacts fetch error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch contacts'
      });
    }

    res.json({
      success: true,
      contacts: contacts || []
    });

  } catch (error) {
    console.error('Contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get dashboard statistics
router.get('/stats', authenticateAdmin, async (req, res) => {
  try {
    // Get user count
    const { count: userCount, error: userError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    // Get course count
    const { count: courseCount, error: courseError } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true });

    // Get contact count
    const { count: contactCount, error: contactError } = await supabase
      .from('contacts')
      .select('*', { count: 'exact', head: true });

    if (userError || courseError || contactError) {
      console.error('Stats fetch error:', { userError, courseError, contactError });
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch statistics'
      });
    }

    res.json({
      success: true,
      stats: {
        totalUsers: userCount || 0,
        totalCourses: courseCount || 0,
        totalContacts: contactCount || 0
      }
    });

  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
