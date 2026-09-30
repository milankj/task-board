import { Router } from 'express';
import { getUsers, getUserById, getUserSettings, updateSettings, login, logout } from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/login', login);
router.post('/logout', authenticate, logout);
router.get('/settings', authenticate, getUserSettings);
router.put('/settings/:id', authenticate, updateSettings);
router.get('/', authenticate, getUsers);
router.get('/:id', authenticate, getUserById);

export default router;
