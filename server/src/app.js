import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes.js';
import taskRoutes from './routes/task.routes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/health', (req, res) => {
    return res.status(200).json({ status: 'OK', message: 'Server is running' });
});

export default app;
