import React from 'react';
import {
    Flame,
    Rss,
    Sliders,
    History,
    Zap,
    Moon,
    Sun,
    Volume2,
    VolumeX,
    Mail,
    BellRing,
    Activity
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ activeTab, setActiveTab, onOpenTestEmail }) {
    const { theme, toggleTheme } = useTheme();
    const { isConnected, audioEnabled, toggleAudio } = useSocket();
    const { user } = useAuth();

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Flame },
        { id: 'feed', label: 'Live News', icon: Rss },
        { id: 'preferences', label: 'Alert Preferences', icon: Sliders },
        { id: 'history', label: 'Alert History', icon: History },
        { id: 'simulator', label: 'Alert Trigger', icon: Zap, badge: 'Simulator' },
    ];

    return (
        <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

                {/* Brand Logo */}
                <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
                    <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 shadow-lg shadow-rose-500/25">
                        <BellRing className="w-5 h-5 text-white animate-pulse" />
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                        </span>
                    </div>
                    <div>
                        <div className="flex items-center space-x-2">
                            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-rose-400 bg-clip-text text-transparent">
                                PulseNews
                            </span>
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                Real-Time
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-400">Breaking News & Notification Hub</p>
                    </div>
                </div>

                {/* Desktop Navigation Tabs */}
                <nav className="hidden md:flex items-center space-x-1 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`relative flex items-center space-x-2 px-3.5 py-1.5 rounded-xl font-medium text-xs transition-all duration-200 ${isActive
                                        ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 font-semibold'
                                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                                    }`}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                                <span>{item.label}</span>
                                {item.badge && (
                                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                        {item.badge}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Actions & Controls */}
                <div className="flex items-center space-x-2">
                    {/* Real-time Status Indicator */}
                    <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800">
                        <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50 animate-pulse' : 'bg-amber-500'}`} />
                        <span className="text-[11px] font-medium text-slate-300">
                            {isConnected ? 'Live Socket Connected' : 'Connecting...'}
                        </span>
                    </div>

                    {/* Test Email Dispatch Button */}
                    <button
                        onClick={onOpenTestEmail}
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 text-xs font-medium transition"
                        title="Dispatch Test Email Alert"
                    >
                        <Mail className="w-3.5 h-3.5 text-rose-400" />
                        <span className="hidden lg:inline">Test Email</span>
                    </button>

                    {/* Audio Chime Toggle */}
                    <button
                        onClick={toggleAudio}
                        className={`p-2 rounded-xl border transition ${audioEnabled
                                ? 'bg-slate-800 text-rose-400 border-slate-700'
                                : 'bg-slate-900 text-slate-500 border-slate-800'
                            }`}
                        title={audioEnabled ? 'Alert Audio Enabled' : 'Alert Audio Muted'}
                    >
                        {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    </button>

                    {/* Dark / Light Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700/60 transition"
                        title="Toggle Theme"
                    >
                        {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav Tabs */}
            <div className="md:hidden flex items-center justify-around bg-slate-950 px-2 py-2 border-t border-slate-800">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex flex-col items-center p-1 text-[10px] font-medium ${isActive ? 'text-rose-500 font-bold' : 'text-slate-400'
                                }`}
                        >
                            <Icon className="w-4 h-4 mb-0.5" />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </header>
    );
}
