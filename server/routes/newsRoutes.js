import express from 'express';
import NewsArticle from '../models/NewsArticle.js';
import { triggerBreakingNewsAlert } from '../services/newsAggregator.js';

const router = express.Router();

// @route GET /api/news
// Query params: category, source, search, isBreaking
router.get('/', async (req, res) => {
    try {
        const { category, source, search, isBreaking } = req.query;
        const filter = {};

        if (category && category !== 'All') {
            filter.category = category;
        }

        if (source && source !== 'All') {
            filter.source = source;
        }

        if (isBreaking === 'true') {
            filter.isBreaking = true;
        }

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        const articles = await NewsArticle.find(filter).sort({ publishedAt: -1 }).limit(50);
        res.json(articles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route GET /api/news/breaking
router.get('/breaking', async (req, res) => {
    try {
        const breakingArticles = await NewsArticle.find({ isBreaking: true }).sort({ publishedAt: -1 }).limit(10);
        res.json(breakingArticles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route POST /api/news/trigger-breaking
// Allows frontend simulator / user to send breaking news alert
router.post('/trigger-breaking', async (req, res) => {
    try {
        const { category, customTitle, source, customDescription } = req.body;
        const result = await triggerBreakingNewsAlert({
            category,
            customTitle,
            source,
            customDescription,
        });

        res.status(201).json({
            message: 'Breaking news alert triggered & broadcasted successfully!',
            article: result.article,
            notificationsSent: result.notificationsCount,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
