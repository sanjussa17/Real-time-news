import mongoose from 'mongoose';

const newsArticleSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        content: {
            type: String,
        },
        category: {
            type: String,
            required: true,
            enum: ['Technology', 'Politics', 'Sports', 'Business', 'Entertainment', 'Health', 'Science', 'India', 'World'],
        },
        source: {
            type: String,
            required: true,
        },
        author: {
            type: String,
            default: 'Editorial Staff',
        },
        url: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
        },
        publishedAt: {
            type: Date,
            default: Date.now,
        },
        isBreaking: {
            type: Boolean,
            default: false,
        },
        urgencyLevel: {
            type: String,
            enum: ['High', 'Medium', 'Low'],
            default: 'Medium',
        },
    },
    { timestamps: true }
);

export default mongoose.model('NewsArticle', newsArticleSchema);
