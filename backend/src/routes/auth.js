const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  googleAuth,
  googleAuthCallback,
  googleAuthCallbackHandler,
  getCurrentUser,
  logout,
  tokenAuth // Make sure this is imported
} = require('../controllers/authController');

// Add this route for Postman testing
router.post('/token', tokenAuth);

router.get('/google', googleAuth);
router.get('/google/callback', googleAuthCallback, googleAuthCallbackHandler);
router.get('/me', auth, getCurrentUser);
router.get('/logout', auth, logout);

module.exports = router;