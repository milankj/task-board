import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const UserSettings = sequelize.define('UserSettings', {
    settings_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    daily_point_limit: {
        type: DataTypes.INTEGER,
    },
    weekly_point_limit: {
        type: DataTypes.INTEGER,
    }
}, {
    tableName: 'user_settings',
    timestamps: true,
});

export default UserSettings;