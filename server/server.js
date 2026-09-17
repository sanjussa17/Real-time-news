import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';

import { connectDB } from './config/db.js';
import { initSocket } from './services/socketService.js';
import { seedInitialNews } from './services/newsAggregator.js';
import { initEmailTransporter } from './services/emailService.js';

import authRoutes from './routes/authRoutes.js';
import newsRoutes from './routes/newsRoutes.js';
import preferenceRoutes from './routes/preferenceRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware setup
app.use(cors());
app.use(express.json());

// Initialize Socket.io
initSocket(server);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/preferences', preferenceRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        timestamp: new Date(),
        service: 'PulseNews Real-time Alert System API',
    });
});

// Automated Cron Scheduler for Hourly & Daily alert digests
cron.schedule('0 * * * *', () => {
    console.log('[CronScheduler] Running hourly alert digest check...');
});

cron.schedule('0 9 * * *', () => {
    console.log('[CronScheduler] Running daily morning news digest check...');
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();
        await seedInitialNews();
        await initEmailTransporter();

        server.listen(PORT, () => {
            console.log(`[PulseNews Backend] Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error(`[PulseNews Backend] Failed to start server: ${error.message}`);
    }
};

startServer();
