import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'pulsenews_secret_jwt_key_2026';

const generateToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

// @route POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const user = await User.create({
            name: name || 'Reader',
            email,
            password,
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            subscribedCategories: user.subscribedCategories,
            preferredSources: user.preferredSources,
            alertFrequency: user.alertFrequency,
            channels: user.channels,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                subscribedCategories: user.subscribedCategories,
                preferredSources: user.preferredSources,
                alertFrequency: user.alertFrequency,
                channels: user.channels,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route POST /api/auth/guest
router.post('/guest', async (req, res) => {
    try {
        let guestUser = await User.findOne({ email: 'demo@pulsenews.live' });
        if (!guestUser) {
            guestUser = await User.create({
                name: 'Reader',
                email: 'demo@pulsenews.live',
                password: 'demopassword123',
                isGuest: true,
            });
        } else if (guestUser.name !== 'Reader') {
            guestUser.name = 'Reader';
            await guestUser.save();
        }

        res.json({
            _id: guestUser._id,
            name: guestUser.name,
            email: guestUser.email,
            subscribedCategories: guestUser.subscribedCategories,
            preferredSources: guestUser.preferredSources,
            alertFrequency: guestUser.alertFrequency,
            channels: guestUser.channels,
            token: generateToken(guestUser._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            return next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    req.user = await User.findOne({ email: 'demo@pulsenews.live' }) || await User.findOne();
    if (req.user) return next();

    res.status(401).json({ message: 'Not authorized, no token' });
};

export default router;
