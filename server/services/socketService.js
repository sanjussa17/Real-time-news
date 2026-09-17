import { Server } from 'socket.io';

let io = null;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });

    io.on('connection', (socket) => {
        console.log(`[Socket.io] Client connected: ${socket.id}`);

        socket.on('join_category', (category) => {
            socket.join(`category_${category}`);
            console.log(`[Socket.io] Socket ${socket.id} joined room category_${category}`);
        });

        socket.on('leave_category', (category) => {
            socket.leave(`category_${category}`);
        });

        socket.on('disconnect', () => {
            console.log(`[Socket.io] Client disconnected: ${socket.id}`);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};

export const broadcastBreakingNews = (article) => {
    if (io) {
        // Broadcast to all connected clients
        io.emit('breaking_news', article);
        // Broadcast to category specific rooms
        io.to(`category_${article.category}`).emit('category_alert', article);
        console.log(`[Socket.io] Broadcasted breaking news: "${article.title}" to room category_${article.category}`);
    }
};
