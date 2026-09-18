import React, { useEffect, useState } from 'react';
import { Flame, Bell, Sliders, Rss, ShieldCheck, Mail, Zap, CheckCircle2, ArrowRight, Tv, Volume2, Globe, Sparkles } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import NewsCard from '../components/NewsCard';
import TrendingSidebar from '../components/TrendingSidebar';

export default function Dashboard({ setActiveTab, onOpenLiveTV, onOpenArticle, onOpenTestEmail }) {
    const { user } = useAuth();
    const [topArticles, setTopArticles] = useState([]);
    const [heroArticle, setHeroArticle] = useState(null);
    const [historyCount, setHistoryCount] = useState(0);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const [newsRes, notifRes] = await Promise.all([
                    axios.get('/api/news'),
                    axios.get('/api/notifications'),
                ]);
                const articles = newsRes.data || [];
                setTopArticles(articles);
                if (articles.length > 0) {
                    setHeroArticle(articles[0]);
                }
                setHistoryCount((notifRes.data || []).length);
            } catch (e) {
                console.error('Error loading dashboard data:', e);
            }
        };
        loadDashboardData();
    }, []);

    return (
        <div className="space-y-8 animate-fadeIn">

            {/* Top Times Now Style Hero Highlight Section */}
            {heroArticle && (
                <div
                    onClick={() => onOpenArticle && onOpenArticle(heroArticle)}
                    className="relative rounded-3xl overflow-hidden glass-card theme-card-bg border border-slate-700/60 group cursor-pointer shadow-2xl transition-all hover:border-rose-500/50"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">

                        {/* Hero Image */}
                        <div className="lg:col-span-7 relative h-72 lg:h-[420px] bg-slate-950 overflow-hidden">
                            <img
                                src={heroArticle.imageUrl || 'https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?auto=format&fit=crop&w=800&q=80'}
                                alt={heroArticle.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                onError={(e) => {
                                    e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80';
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-slate-950/60 lg:to-slate-950" />

                            <div className="absolute top-4 left-4 flex items-center space-x-2">
                                <span className="px-3 py-1 rounded-xl bg-rose-600 text-white font-extrabold text-xs uppercase tracking-widest flex items-center space-x-1.5 shadow-lg shadow-rose-600/50 animate-pulse">
                                    <span className="h-2 w-2 rounded-full bg-white" />
                                    <span>TOP STORY</span>
                                </span>
                                <span className="px-3 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800 text-slate-200 text-xs font-bold uppercase">
                                    {heroArticle.category}
                                </span>
                            </div>
                        </div>

                        {/* Hero Content Column */}
                        <div className="lg:col-span-5 p-6 lg:p-8 flex flex-col justify-between space-y-4 theme-card-bg">
                            <div className="space-y-3">
                                <div className="flex items-center space-x-2 text-xs text-rose-500 font-bold uppercase tracking-wider">
                                    <Globe className="w-3.5 h-3.5" />
                                    <span>{heroArticle.source} Wire Bureau</span>
                                </div>

                                <h1 className="text-xl lg:text-2xl font-extrabold theme-text-primary group-hover:text-rose-500 transition-colors leading-snug">
                                    {heroArticle.title}
                                </h1>

                                <p className="text-xs lg:text-sm theme-text-secondary line-clamp-4 leading-relaxed">
                                    {heroArticle.description}
                                </p>
                            </div>

                            <div className="pt-4 border-t border-slate-300 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (onOpenArticle) onOpenArticle(heroArticle);
                                    }}
                                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 flex items-center space-x-2 transition"
                                >
                                    <Volume2 className="w-4 h-4" />
                                    <span>Read & Listen to Audio</span>
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (onOpenLiveTV) onOpenLiveTV();
                                    }}
                                    className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-amber-600 dark:text-amber-400 border border-slate-300 dark:border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition"
                                >
                                    <Tv className="w-4 h-4" />
                                    <span>Watch Live Broadcast</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Layout (Grid + Sidebar) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left 8 Columns: News Feed Grid */}
                <div className="lg:col-span-8 space-y-8">

                    {/* Section Header */}
                    <div className="flex items-center justify-between border-b border-slate-300 dark:border-slate-800/80 pb-4">
                        <div>
                            <h2 className="text-xl font-extrabold theme-text-primary flex items-center space-x-2">
                                <Flame className="w-5 h-5 text-rose-500" />
                                <span>Prime Headlines & Breaking News</span>
                            </h2>
                            <p className="text-xs theme-text-secondary">Live verified updates across national and global desks</p>
                        </div>

                        <button
                            onClick={() => setActiveTab('feed')}
                            className="flex items-center space-x-1 text-xs font-extrabold text-rose-500 hover:text-rose-400 transition"
                        >
                            <span>Browse All Wire Stories ({topArticles.length})</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Article Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {topArticles.slice(1, 7).map((article) => (
                            <NewsCard
                                key={article._id}
                                article={article}
                                onOpenArticle={onOpenArticle}
                                onOpenTestEmail={onOpenTestEmail}
                            />
                        ))}
                    </div>
                </div>

                {/* Right 4 Columns: Trending Sidebar */}
                <div className="lg:col-span-4">
                    <TrendingSidebar onSelectCategory={(cat) => setActiveTab('feed')} />
                </div>
            </div>
        </div>
    );
}
