import express from 'express';
import {
  authUser,
  registerUser,
  getUserProfile,
  getUsers,
} from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/me', protect, getUserProfile);
router.get('/users', protect, admin, getUsers);

export default router;
