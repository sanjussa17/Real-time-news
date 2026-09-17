import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export const connectDB = async () => {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/realtime_news_db';

    try {
        // Attempt connecting to local/remote MongoDB instance with 3s timeout
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 3000,
        });
        console.log(`[MongoDB] Connected successfully to live database: ${mongoose.connection.host}`);
    } catch (err) {
        console.warn(`[MongoDB] Live connection failed (${err.message}). Initializing MongoMemoryServer fallback...`);

        try {
            mongoMemoryServer = await MongoMemoryServer.create();
            const memoryUri = mongoMemoryServer.getUri();
            await mongoose.connect(memoryUri);
            console.log(`[MongoDB] Successfully connected to automated In-Memory Database at ${memoryUri}`);
        } catch (memErr) {
            console.error(`[MongoDB] Failed to start In-Memory Database: ${memErr.message}`);
        }
    }
};

export const getMemoryServerInstance = () => mongoMemoryServer;
