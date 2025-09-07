import express from 'express';
const router = express.Router();

import { auth } from '../middleware/auth.js';
import {
  googleAuth,
  googleAuthCallback,
  googleAuthCallbackHandler,
  getCurrentUser,
  logout,
  tokenAuth // Make sure this is imported
} from '../controllers/authController.js';

// Add this route for Postman testing
router.post('/token', tokenAuth);

router.get('/google', googleAuth);
router.get('/google/callback', googleAuthCallback, googleAuthCallbackHandler);
router.get('/me', auth, getCurrentUser);
router.get('/logout', auth, logout);

export default router;