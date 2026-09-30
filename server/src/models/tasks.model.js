import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Tasks = sequelize.define('Tasks', {
    tasks_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    task_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    story_point: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    priority: {
        type: DataTypes.ENUM('critical', 'high', 'medium', 'low'),
        allowNull: false,
    },
    owner_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    planned_date: {
        type: DataTypes.DATE,
    },
    due_date: {
        type: DataTypes.DATE,
    },
    status: {
        type: DataTypes.ENUM('backlog', 'planned', 'progress', 'completed'),
    },
}, {
    tableName: 'tasks',
    timestamps: true,
});

export default Tasks;
