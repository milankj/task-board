import moment from 'moment';
import db from '../models/index.js';
import { sequelize } from '../config/database.js';
import { STATUS } from '../config/constants.js';
import { Op } from 'sequelize';

const Tasks = db.Tasks;
const UserSettings = db.UserSettings;

export const createTask = async (taskData) => {
    if (taskData.status !== 'backlog') {
        await validateLimits(taskData.owner_id, taskData.planned_date, taskData.story_point);
    }
    return await Tasks.create(taskData);
};

export const fetchAllTasks = async () => {
    return await Tasks.findAll();
};

export const fetchTasksGroupedByStatus = async () => {
    const tasks = await Tasks.findAll({ raw: true });
    console.log("tasks", tasks);
    const groupe = Object.entries(STATUS).map(([key, value]) => ({
        id: key,
        name: value,
        tasks: tasks.filter((task) => task.status === key)
    }));
    console.log("group", groupe);
    return groupe;
};

export const fetchTaskAnalytics = async () => {
    const [statusCounts, totalStoryPoints] = await Promise.all([
        Tasks.findAll({
            attributes: [
                'status',
                [sequelize.fn('COUNT', sequelize.col('tasks_id')), 'count'],
            ],
            group: ['status'],
            raw: true,
        }),
        Tasks.sum('story_point')
    ]);

    const total_tasks = statusCounts.reduce((acc, stat) => acc + Number(stat.count), 0);

    const status_counts = Object.entries(STATUS).map(([key, label]) => {
        const found = statusCounts.find(item => item.status === key);

        return {
            status: key,
            label,
            count: found ? Number(found.count) : 0,
        };
    });

    return {
        total_tasks: (total_tasks || 0),
        total_story_points: Number(totalStoryPoints || 0),
        status_counts
    };
};

export const fetchTaskById = async (id) => {
    return await Tasks.findByPk(id);
};

export const updateTaskStatus = async (id, status) => {
    const task = await Tasks.findByPk(id);
    if (!task) {
        const error = new Error('Task not found');
        error.statusCode = 404;
        throw error;
    }

    if (task.status === 'backlog' && status !== 'planned') {
        const error = new Error('Backlog tasks can only be moved to Planned');
        error.statusCode = 400;
        throw error;
    }

    if (task.status === 'completed' && status === 'backlog') {
        const error = new Error('Completed tasks cannot be moved back to Backlog');
        error.statusCode = 400;
        throw error;
    }

    // Validation when moving from Backlog to Planned
    if (task.status === 'backlog' && status === 'planned') {
        await validateLimits(task.owner_id, task.planned_date, task.story_point, id);
    }

    task.status = status;
    await task.save();
    return task;

};
export const updateTask = async (id, updateData) => {
    const task = await Tasks.findByPk(id);
    Object.assign(task, updateData);

    if (task.status !== 'backlog') {
        await validateLimits(task.owner_id, task.planned_date, task.story_point, id);
    }
    await task.save();
    return task;
};
export const deleteTask = async (id) => {
    const task = await Tasks.findByPk(id);
    if (!task) {
        const error = new Error('Task not found');
        error.statusCode = 404;
        throw error;
    }

    await task.destroy();
    return { tasks_id: id };
};

async function getSumOfStoryPointsForUserInDateRange(user_id, start_date, end_date, exclude_task_id = null) {
    const where = {
        owner_id: user_id,
        status: { [Op.in]: ['planned', 'progress', 'completed'] },
        planned_date: {
            [Op.between]: [start_date, end_date]
        }
    };
    if (exclude_task_id) {
        where.tasks_id = { [Op.ne]: exclude_task_id };
    }
    return await Tasks.sum('story_point', { where }) || 0;
}


async function validateLimits(user_id, planned_day, task_points, exclude_task_id = null) {
    const settings = await UserSettings.findOne({ where: { user_id: user_id } });

    if (!settings) return true;

    const { daily_point_limit, weekly_point_limit } = settings;
    const taskPoints = Number(task_points) || 0;
    const day = moment.utc(planned_day).format('YYYY-MM-DD');
    if (daily_point_limit > 0) {

        const existingDailyUsage = await getSumOfStoryPointsForUserInDateRange(user_id, day, day, exclude_task_id);

        if (existingDailyUsage + taskPoints > daily_point_limit) {
            const error = new Error(
                `Daily capacity exceeded for ${day}: limit ${daily_point_limit}, already planned ${existingDailyUsage}, this task ${taskPoints}`
            );
            error.statusCode = 409;
            throw error;
        }
    }

    if (weekly_point_limit !== null && weekly_point_limit !== undefined && weekly_point_limit > 0) {
        const weekStart = moment(day).startOf('isoWeek').format('YYYY-MM-DD');
        const weekEnd = moment(day).endOf('isoWeek').format('YYYY-MM-DD');
        const existingWeeklySum = await getSumOfStoryPointsForUserInDateRange(user_id, weekStart, weekEnd, exclude_task_id);

        if (existingWeeklySum + taskPoints > weekly_point_limit) {
            const error = new Error(
                `Weekly capacity exceeded for ${weekStart} to ${weekEnd}: limit ${weekly_point_limit}, already planned ${existingWeeklySum}, this task ${taskPoints}`
            );
            error.statusCode = 409;
            throw error;
        }
    }

    return true;
}