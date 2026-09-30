import { cacheHelper } from '../config/cache.js';
import * as userService from '../services/user.service.js';

export const getUsers = async (req, res) => {
    try {
        const users = await userService.fetchAllUsers();
        res.status(200).json({ data: users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await userService.fetchUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ data: user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUserSettings = async (req, res) => {
    try {
        const userId = req.user?.user_id;
        if (!userId) {
            return res.status(400).json({ message: 'User ID not found in authorization token' });
        }

        const settings = await userService.fetchUserSettingsByUserId(userId);
        res.status(200).json({ message: 'User settings fetched successfully', data: settings });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateSettings = async (req, res) => {
    try {
        const userId = req.user?.user_id;
        const { id } = req.params;
        const { daily_point_limit, weekly_point_limit } = req.body;

        if (!id) {
            return res.status(400).json({ message: 'Settings ID or User ID is required in params' });
        }

        const updated = await userService.updateUserSettings(id, {
            daily_point_limit,
            weekly_point_limit,
            userId
        });

        res.status(200).json({
            message: 'User settings updated successfully',
            data: updated,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await userService.loginUser(email, password);
        res.status(200).json({ message: 'Login successful', data: user });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

export const logout = async (req, res) => {
    const { jti, exp } = req.user;

    const ttl = exp - Math.floor(Date.now() / 1000);

    if (ttl > 0) {
        await cacheHelper.set(
            `blacklist:${jti}`,
            true,
            ttl
        );
    }

    res.json({
        message: 'Logged out successfully'
    });
};
