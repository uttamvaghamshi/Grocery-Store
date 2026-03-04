import express from 'express';
import { loginUser, profile, registerUser, updateProfile } from '../Controller/UserController.js';
import authMiddleware from '../Middleware/authMiddleware.js';
import userRoleMiddleware from '../Middleware/userRoleMiddleware.js';
import upload from '../Middleware/upload.js';

const router = express.Router();

router.post('/register',upload.single("image"),registerUser);
router.post('/login',loginUser);
router.get('/profile',authMiddleware,userRoleMiddleware,profile);
router.put('/edit-profile',authMiddleware,userRoleMiddleware,upload.single("image"),updateProfile);

export default router;