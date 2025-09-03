const passport = require('passport');
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

// Simple token-based auth endpoint for Postman testing
exports.tokenAuth = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (token === 'test-token') {
      // Check if test user already exists
      let user = await User.findOne({ email: 'test@example.com' });
      
      if (!user) {
        // Create test user
        user = new User({
          googleId: 'test-123456',
          name: 'Test User',
          email: 'test@example.com',
          avatar: 'https://via.placeholder.com/150',
          preferences: {
            defaultTags: ['greedy', 'math', 'dp'],
            difficultyRange: {
              min: 800,
              max: 2000
            }
          }
        });
        await user.save();
      }
      
      // Generate JWT token
      const jwtToken = generateToken(user);
      
      res.json({ 
        message: 'Authenticated with token', 
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar
        },
        token: jwtToken
      });
    } else {
      res.status(401).json({ error: 'Invalid token' });
    }
  } catch (error) {
    console.error('Token auth error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Google OAuth authentication
exports.googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email']
});

// Google OAuth callback
exports.googleAuthCallback = passport.authenticate('google', {
  failureRedirect: process.env.FRONTEND_LOGIN_URL || '/login',
  session: false
});

exports.googleAuthCallbackHandler = (req, res) => {
  // Generate JWT token
  const token = generateToken(req.user);
  
  // Redirect to frontend with token
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  res.redirect(`${frontendUrl}/auth/success?token=${token}`);
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar,
        preferences: req.user.preferences
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Logout
exports.logout = (req, res) => {
  // In a real application, you might want to blacklist the token
  res.json({ message: 'Logged out successfully' });
};