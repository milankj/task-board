import * as taskService from '../services/task.service.js';
import { STATUS, PRIORITIES } from '../config/constants.js';

export const createTask = async (req, res) => {
    try {
        const {
            task_name,
            description,
            story_point,
            priority,
            planned_date,
            due_date,
            status,
        } = req.body;

        const owner_id = req.user.user_id;

        if (!task_name || typeof task_name !== 'string' || !task_name.trim()) {
            return res.status(400).json({ message: 'task_name is required' });
        }

        if (story_point === undefined || story_point === null || Number(story_point) <= 0) {
            return res.status(400).json({ message: 'story_point must be greater than zero' });
        }

        const validPriorities = PRIORITIES;
        if (!priority || !validPriorities.includes(priority)) {
            return res.status(400).json({ message: 'priority is required' });
        }

        if (!planned_date) {
            return res.status(400).json({ message: 'planned_date is required' });
        }

        const planned = new Date(planned_date);
        if (isNaN(planned.getTime())) {
            return res.status(400).json({ message: 'Invalid planned_date format' });
        }

        let due = null;
        if (due_date) {
            due = new Date(due_date);
            if (isNaN(due.getTime())) {
                return res.status(400).json({ message: 'Invalid due_date format' });
            }
            if (due < planned) {
                return res.status(400).json({ message: 'due_date cannot be earlier than the Planned Date' });
            }
        }

        const task = await taskService.createTask({
            task_name: task_name.trim(),
            description: description || null,
            story_point: Number(story_point),
            priority,
            planned_date: planned,
            due_date: due,
            status: status,
            owner_id: owner_id,
        });

        return res.status(201).json({
            message: 'Task created successfully',
            data: task,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getTasks = async (req, res) => {
    try {
        const tasks = await taskService.fetchTasksGroupedByStatus();
        return res.status(200).json({ data: tasks });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getTaskAnalytics = async (req, res) => {
    try {
        const analytics = await taskService.fetchTaskAnalytics();
        return res.status(200).json({ data: analytics });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getTaskById = async (req, res) => {
    try {
        const task = await taskService.fetchTaskById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        return res.status(200).json({ data: task });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const editTask = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            task_name,
            description,
            story_point,
            priority,
            planned_date,
            due_date,
            status,
        } = req.body;

        if (task_name !== undefined) {
            if (typeof task_name !== 'string' || !task_name.trim()) {
                return res.status(400).json({ message: 'task_name cannot be empty' });
            }
        }

        if (story_point !== undefined) {
            if (story_point === null || Number(story_point) <= 0) {
                return res.status(400).json({ message: 'story_point must be greater than zero' });
            }
        }

        if (priority !== undefined) {
            if (!PRIORITIES.includes(priority)) {
                return res.status(400).json({ message: 'Invalid priority' });
            }
        }

        let planned = undefined;
        if (planned_date !== undefined) {
            planned = new Date(planned_date);
            if (isNaN(planned.getTime())) {
                return res.status(400).json({ message: 'Invalid planned_date format' });
            }
        }

        let due = undefined;
        if (due_date !== undefined) {
            if (due_date === null) {
                due = null;
            } else {
                due = new Date(due_date);
                if (isNaN(due.getTime())) {
                    return res.status(400).json({ message: 'Invalid due date format' });
                }
                if (planned && due < planned) {
                    return res.status(400).json({ message: 'Due date cannot be earlier than Planned Date' });
                }
            }
        }

        if (status !== undefined) {
            const validStatuses = Object.keys(STATUS);
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ message: 'Invalid status' });
            }
        }

        const updateData = {};
        if (task_name !== undefined) updateData.task_name = task_name.trim();
        if (description !== undefined) updateData.description = description;
        if (story_point !== undefined) updateData.story_point = Number(story_point);
        if (priority !== undefined) updateData.priority = priority;
        if (planned !== undefined) updateData.planned_date = planned;
        if (due !== undefined) updateData.due_date = due;
        if (status !== undefined) updateData.status = status;

        const updatedTask = await taskService.updateTask(id, updateData);
        return res.status(200).json({
            message: 'Task updated successfully',
            data: updatedTask,
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({ message: error.message });
    }
};

export const updateTaskStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = Object.keys(STATUS);
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                message: 'status is required and must be one of: backlog, planned, progress, completed',
            });
        }

        const updatedTask = await taskService.updateTaskStatus(id, status);
        return res.status(200).json({
            message: 'Task status updated successfully',
            data: updatedTask,
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({ message: error.message });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await taskService.deleteTask(id);
        return res.status(200).json({
            message: 'Task deleted successfully',
            data: result,
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({ message: error.message });
    }
};