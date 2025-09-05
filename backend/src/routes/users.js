const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getUserStats,
  getSolvedProblems, 
  updatePreferences
} = require('../controllers/statsContoller');

router.get('/stats', auth, getUserStats);
router.get('/solved', auth, getSolvedProblems); 
// router.put('/preferences', auth, updatePreferences);

module.exports = router;