const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getUserStats,
  getSolvedProblems,
  getProblemAttempt,
  getUserCode,
  getAIReview,
  getChartData,
  // updatePreferences
} = require('../controllers/statsContoller');

// User statistics routes
router.get('/stats', auth, getUserStats);
router.get('/solved', auth, getSolvedProblems);
router.get('/chart-data', auth, getChartData); // New route for chart data
// router.put('/preferences', auth, updatePreferences);

// New routes for problem attempts
router.get('/attempt/:contestId/:problemIndex', auth, getProblemAttempt);
router.get('/code/:contestId/:problemIndex', auth, getUserCode);
router.get('/review/:contestId/:problemIndex', auth, getAIReview);
router.get('/profile', auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar,
        createdAt: req.user.createdAt
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;