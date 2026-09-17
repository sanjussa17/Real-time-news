import React, { useEffect, useState } from 'react';
import { Flame, Bell, Sliders, Rss, ShieldCheck, Mail, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import NewsCard from '../components/NewsCard';

export default function Dashboard({ setActiveTab, onOpenTestEmail }) {
    const { user } = useAuth();
    const { alertHistory, isConnected } = useSocket();
    const [topArticles, setTopArticles] = useState([]);
    const [historyCount, setHistoryCount] = useState(0);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const [newsRes, notifRes] = await Promise.all([
                    axios.get('/api/news?isBreaking=true'),
                    axios.get('/api/notifications'),
                ]);
                setTopArticles(newsRes.data);
                setHistoryCount(notifRes.data.length);
            } catch (e) {
                console.error('Error loading dashboard data:', e);
            }
        };
        loadDashboardData();
    }, []);

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Hero Banner */}
            <div className="relative rounded-3xl overflow-hidden glass-panel border border-slate-800 p-6 md:p-8 bg-gradient-to-r from-slate-900 via-slate-950 to-rose-950/40 shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 max-w-3xl space-y-4">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider">
                        <Zap className="w-3.5 h-3.5" />
                        <span>MERN Real-Time News Engine</span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                        Welcome, <span className="bg-gradient-to-r from-rose-400 via-amber-300 to-rose-400 bg-clip-text text-transparent">{user?.name || 'Reader'}</span>
                    </h1>

                    <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                        Your real-time breaking news alert center is operational. Subscribed to <strong className="text-white">{user?.subscribedCategories?.length || 7} categories</strong> with <strong className="text-rose-400">{user?.alertFrequency || 'Immediate'}</strong> notification dispatch via Email & WebSockets.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                        <button
                            onClick={() => setActiveTab('simulator')}
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center space-x-2 transition"
                        >
                            <Zap className="w-4 h-4" />
                            <span>Trigger Breaking Alert</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('preferences')}
                            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold text-xs flex items-center space-x-2 transition"
                        >
                            <Sliders className="w-4 h-4 text-amber-400" />
                            <span>Customize Preferences</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Metrics & Quick Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center space-x-4">
                    <div className="p-3.5 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <Flame className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-extrabold text-white">{topArticles.length}</div>
                        <div className="text-xs text-slate-400 font-medium">Breaking News Articles</div>
                    </div>
                </div>

                <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center space-x-4">
                    <div className="p-3.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        <Rss className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-extrabold text-white">{user?.subscribedCategories?.length || 0}</div>
                        <div className="text-xs text-slate-400 font-medium">Subscribed Categories</div>
                    </div>
                </div>

                <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center space-x-4">
                    <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <Mail className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-extrabold text-white">{historyCount}</div>
                        <div className="text-xs text-slate-400 font-medium">Delivered Email Alerts</div>
                    </div>
                </div>

                <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center space-x-4">
                    <div className="p-3.5 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-extrabold text-white">{user?.alertFrequency || 'Immediate'}</div>
                        <div className="text-xs text-slate-400 font-medium">Alert Frequency Mode</div>
                    </div>
                </div>
            </div>

            {/* Subscribed Category Badges */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800/80">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Active Subscriptions ({user?.subscribedCategories?.length || 0})</span>
                    </h3>
                    <button
                        onClick={() => setActiveTab('preferences')}
                        className="text-xs font-semibold text-rose-400 hover:underline"
                    >
                        Edit Preferences →
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {user?.subscribedCategories?.map((cat) => (
                        <span
                            key={cat}
                            className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 font-semibold flex items-center space-x-1.5"
                        >
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                            <span>{cat}</span>
                        </span>
                    ))}
                </div>
            </div>

            {/* Recent Breaking News Grid */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                            <Flame className="w-5 h-5 text-rose-500" />
                            <span>Current Breaking News Alerts</span>
                        </h2>
                        <p className="text-xs text-slate-400">Live breaking updates broadcasted in real time</p>
                    </div>
                    <button
                        onClick={() => setActiveTab('feed')}
                        className="flex items-center space-x-1 text-xs font-semibold text-rose-400 hover:text-rose-300 transition"
                    >
                        <span>View All News</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {topArticles.slice(0, 3).map((article) => (
                        <NewsCard key={article._id} article={article} onOpenTestEmail={onOpenTestEmail} />
                    ))}
                </div>
            </div>
        </div>
    );
}
