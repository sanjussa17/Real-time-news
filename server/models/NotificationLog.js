import mongoose from 'mongoose';

const notificationLogSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        userEmail: {
            type: String,
            required: true,
        },
        articleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'NewsArticle',
        },
        articleTitle: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        source: {
            type: String,
            required: true,
        },
        channel: {
            type: String,
            enum: ['Email', 'Push', 'In-App'],
            default: 'Email',
        },
        frequency: {
            type: String,
            enum: ['Immediate', 'Hourly', 'Daily'],
            default: 'Immediate',
        },
        status: {
            type: String,
            enum: ['Delivered', 'Sent', 'Failed', 'Read'],
            default: 'Sent',
        },
        previewUrl: {
            type: String,
        },
        readAt: {
            type: Date,
        },
    },
    { timestamps: true }
);

export default mongoose.model('NotificationLog', notificationLogSchema);
