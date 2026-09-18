import express from 'express';
import NewsArticle from '../models/NewsArticle.js';
import { triggerBreakingNewsAlert } from '../services/newsAggregator.js';
import { fetchLiveRssNews } from '../services/rssService.js';

const router = express.Router();

// Mock store for live opinion poll
let livePollData = {
    question: "Will AI & Automated Systems transform broadcast journalism by 2030?",
    options: [
        { id: 'yes', label: 'Yes, full transformational shift', votes: 1420 },
        { id: 'hybrid', label: 'Hybrid human-AI co-creation', votes: 2890 },
        { id: 'no', label: 'No, human editorial remains core', votes: 610 },
    ],
    totalVotes: 4920,
};

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

        const articles = await NewsArticle.find(filter).sort({ publishedAt: -1 }).limit(60);
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

// @route POST /api/news/rss-sync
// Manually or automatically trigger live RSS sync
router.get('/rss-sync', async (req, res) => {
    try {
        const result = await fetchLiveRssNews();
        const updatedArticles = await NewsArticle.find().sort({ publishedAt: -1 }).limit(60);
        res.json({
            message: `RSS sync completed. ${result.newInserted} new articles ingested.`,
            stats: result,
            articles: updatedArticles,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route GET /api/news/market-ticker
router.get('/market-ticker', (req, res) => {
    res.json([
        { symbol: 'SENSEX', value: '82,840.15', change: '+380.40', percent: '+0.46%', isUp: true },
        { symbol: 'NIFTY 50', value: '25,310.80', change: '+115.20', percent: '+0.45%', isUp: true },
        { symbol: 'NASDAQ', value: '18,290.40', change: '+142.10', percent: '+0.78%', isUp: true },
        { symbol: 'GOLD (10g)', value: '₹74,250', change: '-120.00', percent: '-0.16%', isUp: false },
        { symbol: 'BITCOIN', value: '$64,850', change: '+$1,240', percent: '+1.95%', isUp: true },
        { symbol: 'CRUDE OIL', value: '$72.40/bbl', change: '-$0.85', percent: '-1.16%', isUp: false },
    ]);
});

// @route GET /api/news/weather
router.get('/weather', (req, res) => {
    res.json([
        { city: 'New Delhi', temp: '31°C', condition: 'Sunny / Haze' },
        { city: 'Mumbai', temp: '29°C', condition: 'Humid' },
        { city: 'Bengaluru', temp: '25°C', condition: 'Pleasant Rain' },
        { city: 'London', temp: '18°C', condition: 'Cloudy' },
        { city: 'New York', temp: '22°C', condition: 'Clear Sky' },
    ]);
});

// @route GET /api/news/poll
router.get('/poll', (req, res) => {
    res.json(livePollData);
});

// @route POST /api/news/poll/vote
router.post('/poll/vote', (req, res) => {
    const { optionId } = req.body;
    const option = livePollData.options.find((o) => o.id === optionId);
    if (option) {
        option.votes += 1;
        livePollData.totalVotes += 1;
    }
    res.json(livePollData);
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
