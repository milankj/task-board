import { Router } from 'express';
import {
    createTask,
    getTasks,
    getTaskAnalytics,
    getTaskById,
    editTask,
    updateTaskStatus,
    deleteTask,
} from '../controllers/task.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', authenticate, createTask);
router.get('/', authenticate, getTasks);
router.get('/analytics', authenticate, getTaskAnalytics);
router.get('/:id', authenticate, getTaskById);
router.put('/:id', authenticate, editTask);
router.patch('/:id/status', authenticate, updateTaskStatus);
router.delete('/:id', authenticate, deleteTask);

export default router;
