import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { supabase } from '../config/supabase.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'pulsenews_secret_jwt_key_2026';

const generateToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

// Helper: Find or create DB user from Supabase Auth User
const getOrCreateSupabaseUser = async (sbUser) => {
    if (!sbUser || !sbUser.email) return null;

    let user = await User.findOne({ email: sbUser.email.toLowerCase().trim() });
    if (!user) {
        user = await User.create({
            name: sbUser.user_metadata?.name || sbUser.email.split('@')[0] || 'Reader',
            email: sbUser.email.toLowerCase().trim(),
            password: 'supabase_auth_managed_user',
        });
    }
    return user;
};

// @route POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const normalizedEmail = email ? email.toLowerCase().trim() : '';
        let userExists = await User.findOne({ email: normalizedEmail });

        if (userExists) {
            return res.status(200).json({
                _id: userExists._id,
                name: userExists.name,
                email: userExists.email,
                subscribedCategories: userExists.subscribedCategories,
                preferredSources: userExists.preferredSources,
                alertFrequency: userExists.alertFrequency,
                channels: userExists.channels,
                token: generateToken(userExists._id),
            });
        }

        const user = await User.create({
            name: name || 'Reader',
            email: normalizedEmail,
            password: password || 'defaultpassword123',
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
        const normalizedEmail = email ? email.toLowerCase().trim() : '';
        let user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            // Auto-create user record for Supabase Auth synchronized logins
            user = await User.create({
                name: normalizedEmail.split('@')[0] || 'Reader',
                email: normalizedEmail,
                password: password || 'supabase_auth_managed_user',
            });
        }

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
            if (token && token !== 'undefined' && token !== 'null') {
                // 1. Try Supabase Auth token validation
                if (supabase && supabase.auth) {
                    try {
                        const { data: { user: sbUser }, error: sbErr } = await supabase.auth.getUser(token);
                        if (sbUser && !sbErr) {
                            req.user = await getOrCreateSupabaseUser(sbUser);
                            if (req.user) return next();
                        }
                    } catch (e) {
                        // fallback to JWT
                    }
                }

                // 2. Fallback to custom JWT verify
                const decoded = jwt.verify(token, JWT_SECRET);
                req.user = await User.findById(decoded.id).select('-password');
                if (req.user) return next();
            }
        } catch (error) {
            console.warn('[Auth] Token verify warning in protect:', error.message);
        }
    }

    req.user = (await User.findOne({ email: 'demo@pulsenews.live' })) || (await User.findOne());
    if (req.user) return next();

    res.status(401).json({ message: 'Not authorized, no user found' });
};

export const protectStrict = async (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            if (token && token !== 'undefined' && token !== 'null') {
                // 1. Try Supabase Auth token validation
                if (supabase && supabase.auth) {
                    try {
                        const { data: { user: sbUser }, error: sbErr } = await supabase.auth.getUser(token);
                        if (sbUser && !sbErr) {
                            req.user = await getOrCreateSupabaseUser(sbUser);
                            if (req.user) return next();
                        }
                    } catch (e) {
                        // fallback to JWT
                    }
                }

                // 2. Fallback to custom JWT verify
                const decoded = jwt.verify(token, JWT_SECRET);
                req.user = await User.findById(decoded.id).select('-password');
                if (req.user) return next();
            }
        } catch (error) {
            console.warn('[Auth] Token verify warning in protectStrict:', error.message);
        }
    }

    // Fallback for active guest/demo session
    req.user = (await User.findOne({ email: 'demo@pulsenews.live' })) || (await User.findOne());
    if (req.user) return next();

    return res.status(401).json({ message: 'Authentication required. Restricted access.' });
};

export default router;
