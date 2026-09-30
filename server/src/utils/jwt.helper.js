import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '1d';

export const generateToken = (payload, expiresIn = JWT_EXPIRES_IN) => {
    return jwt.sign(
        payload,
        JWT_SECRET,
        {
            expiresIn,
            jwtid: randomUUID()
        }
    );
};

export const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);

};
