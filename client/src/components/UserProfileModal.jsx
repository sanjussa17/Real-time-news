import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, LogOut, User, Mail, ShieldCheck, Key, CheckCircle2, Sliders } from 'lucide-react';
import { logout } from '../redux/slices/authSlice';

export default function UserProfileModal({ isOpen, onClose, onOpenPreferences }) {
    const dispatch = useDispatch();
    const { user, token } = useSelector((state) => state.auth);

    if (!isOpen || !user) return null;

    const handleLogout = () => {
        dispatch(logout());
        onClose();
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

                {/* Profile Header */}
                <div className="flex items-center space-x-4 pt-2">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white flex items-center justify-center font-extrabold text-xl shadow-lg shadow-rose-600/30">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'R'}
                    </div>

                    <div>
                        <h2 className="text-lg font-extrabold theme-text-primary leading-tight">
                            {user.name || 'Reader'}
                        </h2>
                        <p className="text-xs theme-text-secondary flex items-center space-x-1">
                            <Mail className="w-3.5 h-3.5 mr-1" />
                            <span>{user.email || 'demo@pulsenews.live'}</span>
                        </p>
                        <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                            Authenticated Reader
                        </span>
                    </div>
                </div>

                {/* Subscriptions & Frequency Summary */}
                <div className="p-4 rounded-2xl theme-header-bg border border-slate-300 dark:border-slate-800 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                        <span className="font-bold theme-text-secondary flex items-center space-x-1">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span>Active Subscriptions</span>
                        </span>
                        <span className="font-bold theme-text-primary">
                            {user.subscribedCategories?.length || 0} Categories
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                        {user.subscribedCategories?.map((cat) => (
                            <span key={cat} className="px-2.5 py-0.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-[10px] font-bold theme-text-primary border border-slate-300 dark:border-slate-700">
                                {cat}
                            </span>
                        ))}
                    </div>

                    <div className="pt-2 border-t border-slate-300 dark:border-slate-800 flex justify-between items-center text-[11px]">
                        <span className="theme-text-secondary">Alert Dispatch Mode</span>
                        <span className="font-bold text-rose-500">{user.alertFrequency || 'Immediate'}</span>
                    </div>
                </div>

                {/* JWT Session Token Preview */}
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 space-y-1 text-[10px]">
                    <div className="flex items-center space-x-1 font-bold theme-text-secondary uppercase">
                        <Key className="w-3 h-3 text-amber-500" />
                        <span>JWT Authentication Token</span>
                    </div>
                    <p className="font-mono theme-text-secondary truncate">
                        {token ? `${token.substring(0, 32)}...` : 'Session Active'}
                    </p>
                </div>

                {/* Action Controls */}
                <div className="space-y-2 pt-2">
                    <button
                        onClick={() => { onClose(); if (onOpenPreferences) onOpenPreferences(); }}
                        className="w-full py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 theme-text-primary text-xs font-bold border border-slate-300 dark:border-slate-700 flex items-center justify-center space-x-2 transition"
                    >
                        <Sliders className="w-4 h-4 text-rose-500" />
                        <span>Customize Alert Preferences</span>
                    </button>

                    <button
                        onClick={handleLogout}
                        className="w-full py-2.5 rounded-xl bg-rose-600/10 hover:bg-rose-600/20 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-500/30 flex items-center justify-center space-x-2 transition"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out of Account</span>
                    </button>
                </div>

            </div>
        </div>
    );
}
