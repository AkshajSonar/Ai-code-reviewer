const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  validateProblemTags,
  validateProblemAttempt,
  validateBookmarkProblem,
  validatePagination
} = require('../middleware/validation');
const {
  getProblemsByTags,
  getRandomProblem,
  saveProblemAttempt,
  bookmarkProblem,
  removeBookmark,
  getBookmarks
} = require('../controllers/codeforcesController');

router.get('/problems', auth, validateProblemTags, getProblemsByTags);
router.get('/problems/random', auth, validateProblemTags, getRandomProblem);
router.post('/attempt', auth, validateProblemAttempt, saveProblemAttempt);
router.post('/bookmark', auth, validateBookmarkProblem, bookmarkProblem);
router.delete('/bookmark/:contestId/:problemIndex', auth, removeBookmark);
router.get('/bookmarks', auth, getBookmarks);

module.exports = router;