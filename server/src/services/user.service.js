import { generateToken } from '../utils/jwt.helper.js';
import db from '../models/index.js';
import { randomUUID } from 'node:crypto';

const User = db.User;
const UserSettings = db.UserSettings;

export const fetchUserById = async (id) => {
    return await User.findByPk(id, {
        attributes: { exclude: ['password'] },
    });
};

export const fetchAllUsers = async () => {
    return await User.findAll({
        attributes: { exclude: ['password'] },
    });
};

export const findUserByEmail = async (email, password) => {
    return await User.findOne({ where: { email } });
};

export const loginUser = async (email, password) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new Error('Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new Error('Invalid email or password');
    }

    const token = generateToken({ user_id: user.user_id, email: user.email });

    return {
        user: {
            user_id: user.user_id,
            name: user.name,
            email: user.email,
        },
        token,
    };
};

export const fetchUserSettingsByUserId = async (userId) => {
    let settings = await UserSettings.findOne({ where: { user_id: userId } });
    if (!settings) {
        const new_settings_id = randomUUID();
        const new_setting = await updateUserSettings(new_settings_id, {
            daily_point_limit: 10,
            weekly_point_limit: 50,
            userId
        });
        return new_setting;
    }
    return settings;
};

export const updateUserSettings = async (id, { daily_point_limit, weekly_point_limit, userId }) => {
    let settings = await UserSettings.findOne({
        where: {
            settings_id: id
        },
    });

    if (!settings) {
        settings = await UserSettings.create({
            settings_id: id,
            user_id: userId,
            daily_point_limit: daily_point_limit !== undefined ? daily_point_limit : 10,
            weekly_point_limit: weekly_point_limit !== undefined ? weekly_point_limit : 50,
        });
        return settings;
    }

    if (daily_point_limit !== undefined) {
        settings.daily_point_limit = daily_point_limit;
    }
    if (weekly_point_limit !== undefined) {
        settings.weekly_point_limit = weekly_point_limit;
    }

    await settings.save();
    return settings;
};
