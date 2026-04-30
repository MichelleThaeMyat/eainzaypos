import express from 'express';
import { registerUser, authUser, getUserProfile, getUsers } from '../controllers/userController';
import { protect, admin } from '../middlewares/authMiddleware';

const router = express.Router();

router.route('/').post(registerUser).get(protect, admin, getUsers);
router.post('/login', authUser);
router.route('/profile').get(protect, getUserProfile);

export default router;
