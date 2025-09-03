const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { validateCodeReview } = require('../middleware/validation');
const {
  codeReview,
  codeExplanation
} = require('../controllers/geminiController');

router.post('/review', auth, validateCodeReview, codeReview);
router.post('/explain', auth, validateCodeReview, codeExplanation);

module.exports = router;