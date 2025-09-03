const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  validateUserPreferences,
  validatePagination
} = require('../middleware/validation');
const {
  getUserStats,
  getUserAttempts,
  updatePreferences
} = require('../controllers/userController');

router.get('/stats', auth, getUserStats);
router.get('/attempts', auth, validatePagination, getUserAttempts);
router.put('/preferences', auth, validateUserPreferences, updatePreferences);

module.exports = router;