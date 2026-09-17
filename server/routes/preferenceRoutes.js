import express from 'express';
import User from '../models/User.js';
import { protect } from './authRoutes.js';

const router = express.Router();

const CATEGORIES = ['Technology', 'Politics', 'Sports', 'Business', 'Entertainment', 'Health', 'Science'];
const SOURCES = ['TechCrunch', 'BBC News', 'Reuters', 'CNN', 'Bloomberg', 'The Wall Street Journal', 'Associated Press'];
const FREQUENCIES = ['Immediate', 'Hourly', 'Daily'];

// @route GET /api/preferences/meta
router.get('/meta', (req, res) => {
    res.json({
        availableCategories: CATEGORIES,
        availableSources: SOURCES,
        availableFrequencies: FREQUENCIES,
    });
});

// @route GET /api/preferences
router.get('/', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json({
            subscribedCategories: user.subscribedCategories,
            preferredSources: user.preferredSources,
            alertFrequency: user.alertFrequency,
            channels: user.channels,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route PUT /api/preferences
router.put('/', protect, async (req, res) => {
    try {
        const { subscribedCategories, preferredSources, alertFrequency, channels } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (subscribedCategories) user.subscribedCategories = subscribedCategories;
        if (preferredSources) user.preferredSources = preferredSources;
        if (alertFrequency) user.alertFrequency = alertFrequency;
        if (channels) user.channels = { ...user.channels, ...channels };

        const updatedUser = await user.save();

        res.json({
            message: 'Preferences updated successfully!',
            subscribedCategories: updatedUser.subscribedCategories,
            preferredSources: updatedUser.preferredSources,
            alertFrequency: updatedUser.alertFrequency,
            channels: updatedUser.channels,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
