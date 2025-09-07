import express from 'express';
import { auth } from '../middleware/auth.js';
import { validateCodeReview } from '../middleware/validation.js';
import {
  codeReview,
  codeExplanation
} from '../controllers/geminiController.js';

const router = express.Router();

router.post('/review', auth, validateCodeReview, codeReview);
router.post('/explain', auth, validateCodeReview, codeExplanation);

export default router;