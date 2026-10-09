import React, { useState } from 'react';
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
    Tv,
    Globe,
    Search,
    User,
    Lock,
    ShieldCheck
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { useTheme } from '../context/ThemeContext';
import { useSocket } from '../context/SocketContext';
import MarketTicker from './MarketTicker';

export default function Navbar({
    activeTab,
    setActiveTab,
    onOpenLiveTV,
    onOpenTestEmail,
    onRssSync,
    edition,
    setEdition,
    searchQuery,
    setSearchQuery,
    onOpenAuth,
    onOpenProfile
}) {
    const { theme, toggleTheme } = useTheme();
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const { isConnected, audioEnabled, toggleAudio } = useSocket();

    const navItems = [
        { id: 'dashboard', label: 'Main Portal', icon: Flame },
        { id: 'feed', label: 'Live Wire', icon: Rss },
        { id: 'preferences', label: 'Alert Preferences', icon: Sliders },
        { id: 'history', label: 'Alert History', icon: History },
        { id: 'simulator', label: 'Alert Trigger', icon: Zap, badge: 'Simulator' },
    ];

    return (
        <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-300 dark:border-slate-800/80 theme-header-bg backdrop-blur-xl">

            {/* Top Financial & Weather Bar */}
            <MarketTicker onRssSync={onRssSync} />

            {/* Main Branding & Navigation Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

                {/* Left Brand Identity */}
                <div className="flex items-center space-x-3 cursor-pointer shrink-0" onClick={() => setActiveTab('dashboard')}>
                    <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 shadow-lg shadow-rose-600/30">
                        <BellRing className="w-5 h-5 text-white animate-pulse" />
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                        </span>
                    </div>

                    <div>
                        <div className="flex items-center space-x-2">
                            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 dark:from-white dark:via-slate-100 dark:to-rose-400 bg-clip-text text-transparent">
                                PulseNews
                            </span>
                            <span className="text-[9px] uppercase font-extrabold tracking-widest px-2 py-0.5 rounded-md bg-rose-600 text-white shadow-sm shadow-rose-600/40">
                                LIVE 24x7
                            </span>
                        </div>
                        <p className="text-[10px] theme-text-secondary font-medium">National & Global Real-Time News Network</p>
                    </div>
                </div>

                {/* Middle: Edition Switcher & Search Bar */}
                <div className="hidden lg:flex items-center space-x-3 flex-1 max-w-md mx-4">
                    {/* Search Input */}
                    <div className="relative w-full">
                        <Search className="w-4 h-4 theme-text-secondary absolute left-3 top-2.5" />
                        <input
                            type="text"
                            placeholder="Search breaking stories, topics..."
                            value={searchQuery || ''}
                            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-1.5 rounded-xl theme-input-bg border border-slate-300 dark:border-slate-800 text-xs theme-text-primary placeholder-slate-400 focus:outline-none focus:border-rose-500 transition"
                        />
                    </div>

                    {/* Edition Selector Pill */}
                    <div className="flex items-center space-x-1 theme-card-bg p-1 rounded-xl border border-slate-300 dark:border-slate-800 shrink-0 text-xs">
                        <Globe className="w-3.5 h-3.5 text-rose-500 ml-1.5" />
                        {['India', 'Global'].map((ed) => (
                            <button
                                key={ed}
                                onClick={() => setEdition && setEdition(ed)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${edition === ed ? 'bg-rose-600 text-white shadow-sm' : 'theme-text-secondary hover:theme-text-primary'
                                    }`}
                            >
                                {ed}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Desktop Navigation Tabs */}
                <nav className="hidden xl:flex items-center space-x-1 theme-card-bg p-1.5 rounded-2xl border border-slate-300 dark:border-slate-800">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`relative flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-medium text-xs transition-all duration-200 ${isActive
                                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 font-semibold'
                                    : 'theme-text-secondary hover:theme-text-primary hover:bg-slate-200 dark:hover:bg-slate-800/50'
                                    }`}
                            >
                                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'theme-text-secondary'}`} />
                                <span>{item.label}</span>
                                {item.badge && (
                                    <span className="text-[9px] font-bold uppercase px-1 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30">
                                        {item.badge}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Actions & Controls */}
                <div className="flex items-center space-x-2 shrink-0">

                    {/* RED PULSING LIVE TV BUTTON */}
                    <button
                        onClick={onOpenLiveTV}
                        className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-rose-600/30 transition transform hover:scale-105"
                        title="Open Live Broadcast TV Stream"
                    >
                        <span className="h-2 w-2 rounded-full bg-white animate-ping mr-0.5" />
                        <Tv className="w-4 h-4" />
                        <span>LIVE TV</span>
                    </button>

                    {/* User Auth Profile Dropdown / Button */}
                    <button
                        onClick={() => isAuthenticated ? onOpenProfile() : onOpenAuth()}
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 theme-text-primary border border-slate-300 dark:border-slate-700 text-xs font-bold transition"
                        title={isAuthenticated ? `Logged in as ${user?.name}` : 'Sign In to Account'}
                    >
                        <User className="w-3.5 h-3.5 text-rose-500" />
                        <span className="hidden sm:inline">{isAuthenticated ? user?.name || 'Profile' : 'Sign In'}</span>
                    </button>

                    {/* Audio Chime Toggle */}
                    <button
                        onClick={toggleAudio}
                        className={`p-2 rounded-xl border transition ${audioEnabled
                            ? 'bg-slate-200 dark:bg-slate-800 text-rose-500 border-slate-300 dark:border-slate-700'
                            : 'bg-slate-200 dark:bg-slate-900 theme-text-secondary border-slate-300 dark:border-slate-800'
                            }`}
                        title={audioEnabled ? 'Audio Alert Chime Active' : 'Audio Alert Chime Muted'}
                    >
                        {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    </button>

                    {/* Dark / Light Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 theme-text-primary hover:text-rose-500 border border-slate-300 dark:border-slate-700 transition cursor-pointer"
                        title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                    >
                        {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav Tabs */}
            <div className="xl:hidden flex items-center justify-around theme-header-bg px-2 py-2 border-t border-slate-300 dark:border-slate-800">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex flex-col items-center p-1 text-[10px] font-medium ${isActive ? 'text-rose-500 font-bold' : 'theme-text-secondary'
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
