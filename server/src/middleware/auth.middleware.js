import { cacheHelper } from '../config/cache.js';
import { verifyToken } from '../utils/jwt.helper.js';

export const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization token required' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = verifyToken(token);

        const blacklisted = await cacheHelper.has(
            `blacklist:${decoded.jti}`
        );

        if (blacklisted) {
            return res.status(401).json({
                message: 'Invalid or expired token'
            });
        }

        req.user = decoded;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};
