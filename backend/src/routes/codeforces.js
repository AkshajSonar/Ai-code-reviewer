import express from 'express';
import { auth } from '../middleware/auth.js';
import {
  validateProblemTags,
  validateProblemAttempt,
  validateBookmarkProblem,
  validatePagination
} from '../middleware/validation.js';
import {
  getProblemsByTags,
  getRandomProblem,
  saveProblemAttempt,
  bookmarkProblem,
  removeBookmark,
  getBookmarks
} from '../controllers/codeforcesController.js';

const router = express.Router();

router.get('/problems', auth, validateProblemTags, getProblemsByTags);
router.get('/problems/random', auth, validateProblemTags, getRandomProblem);
router.post('/attempt', auth, validateProblemAttempt, saveProblemAttempt);
router.post('/bookmark', auth, validateBookmarkProblem, bookmarkProblem);
router.delete('/bookmark/:contestId/:problemIndex', auth, removeBookmark);
router.get('/bookmarks', auth, getBookmarks);

export default router;