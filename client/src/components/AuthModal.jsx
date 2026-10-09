import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Lock, Mail, User, ShieldCheck, Zap, AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { loginUser, registerUser, guestLogin, clearError } from '../redux/slices/authSlice';

export default function AuthModal({ isOpen, onClose }) {
    const [mode, setMode] = useState('login'); // 'login' | 'register'
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (mode === 'login') {
            const res = await dispatch(loginUser({ email, password }));
            if (!res.error) onClose();
        } else {
            const res = await dispatch(registerUser({ name, email, password }));
            if (!res.error) onClose();
        }
    };

    const handleGuestClick = async () => {
        const res = await dispatch(guestLogin());
        if (!res.error) onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-md glass-card theme-card-bg border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl space-y-6 p-6">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-rose-500 transition"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Header Branding */}
                <div className="text-center space-y-2 pt-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white shadow-lg shadow-rose-600/30">
                        <Lock className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-extrabold theme-text-primary tracking-tight">
                        {mode === 'login' ? 'Welcome Back to PulseNews' : 'Create Reader Account'}
                    </h2>
                    <p className="text-xs theme-text-secondary">
                        {mode === 'login' ? 'Sign in to access your alert preferences & RSS feeds' : 'Subscribe to personalized real-time breaking news alerts'}
                    </p>
                </div>

                {/* Mode Switcher Tabs */}
                <div className="flex bg-slate-200 dark:bg-slate-950 p-1 rounded-2xl border border-slate-300 dark:border-slate-800">
                    <button
                        onClick={() => { setMode('login'); dispatch(clearError()); }}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${mode === 'login'
                            ? 'bg-rose-600 text-white shadow-md'
                            : 'theme-text-secondary hover:theme-text-primary'
                            }`}
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => { setMode('register'); dispatch(clearError()); }}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${mode === 'register'
                            ? 'bg-rose-600 text-white shadow-md'
                            : 'theme-text-secondary hover:theme-text-primary'
                            }`}
                    >
                        Register
                    </button>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="flex items-center space-x-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Form Inputs */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === 'register' && (
                        <div className="space-y-1">
                            <label className="text-[11px] font-bold theme-text-secondary uppercase">Full Name</label>
                            <div className="relative">
                                <User className="w-4 h-4 theme-text-secondary absolute left-3.5 top-3" />
                                <input
                                    type="text"
                                    required
                                    placeholder="Jane Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl theme-input-bg border border-slate-300 dark:border-slate-800 text-xs theme-text-primary focus:outline-none focus:border-rose-500"
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-[11px] font-bold theme-text-secondary uppercase">Email Address</label>
                        <div className="relative">
                            <Mail className="w-4 h-4 theme-text-secondary absolute left-3.5 top-3" />
                            <input
                                type="email"
                                required
                                placeholder="reader@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl theme-input-bg border border-slate-300 dark:border-slate-800 text-xs theme-text-primary focus:outline-none focus:border-rose-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[11px] font-bold theme-text-secondary uppercase">Password</label>
                        <div className="relative">
                            <Lock className="w-4 h-4 theme-text-secondary absolute left-3.5 top-3" />
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl theme-input-bg border border-slate-300 dark:border-slate-800 text-xs theme-text-primary focus:outline-none focus:border-rose-500"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center justify-center space-x-2 transition"
                    >
                        {loading ? (
                            <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        ) : (
                            <>
                                <span>{mode === 'login' ? 'Sign In to Portal' : 'Create Account'}</span>
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

                {/* Quick Guest Demo Button */}
                <div className="pt-2 border-t border-slate-300 dark:border-slate-800 text-center">
                    <button
                        type="button"
                        onClick={handleGuestClick}
                        className="w-full py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 theme-text-primary text-xs font-bold border border-slate-300 dark:border-slate-700 flex items-center justify-center space-x-2 transition"
                    >
                        <Zap className="w-4 h-4 text-amber-500" />
                        <span>Instant 1-Click Guest Demo</span>
                    </button>
                </div>

            </div>
        </div>
    );
}
