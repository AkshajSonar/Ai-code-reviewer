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

module.exports = router;