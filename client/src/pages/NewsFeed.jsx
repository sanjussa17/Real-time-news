import React, { useState, useEffect } from 'react';
import { Search, Filter, RefreshCw, Rss, Layers, Globe } from 'lucide-react';
import axios from 'axios';
import NewsCard from '../components/NewsCard';

const CATEGORIES = ['All', 'India', 'World', 'Technology', 'Politics', 'Sports', 'Business', 'Entertainment', 'Health', 'Science'];
const SOURCES = ['All', 'Times News Desk', 'Global News Wire', 'Tech Frontier', 'Market Pulse Wire', 'National Express Wire', 'Prime Sports Wire', 'Health Digest', 'Science Frontier'];

export default function NewsFeed({ onOpenArticle, onOpenTestEmail, globalSearchQuery }) {
    const [articles, setArticles] = useState([]);
    const [category, setCategory] = useState('All');
    const [source, setSource] = useState('All');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (globalSearchQuery !== undefined) {
            setSearch(globalSearchQuery);
        }
    }, [globalSearchQuery]);

    const fetchArticles = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/api/news', {
                params: { category, source, search },
            });
            setArticles(data || []);
        } catch (e) {
            console.error('Error loading news feed:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, [category, source, search]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchArticles();
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header & Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold theme-text-primary flex items-center space-x-2">
                        <Rss className="w-6 h-6 text-rose-500" />
                        <span>Live Wire News Feed</span>
                    </h1>
                    <p className="text-xs theme-text-secondary">Real-time news aggregator with category, wire source, and keyword search</p>
                </div>

                {/* Search Input Form */}
                <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search breaking stories, topics..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl theme-input-bg border border-slate-300 dark:border-slate-800 text-xs theme-text-primary placeholder-slate-400 focus:outline-none focus:border-rose-500 transition"
                    />
                    <Search className="w-4 h-4 theme-text-secondary absolute left-3.5 top-3" />
                </form>
            </div>

            {/* Category Pills & Source Filters */}
            <div className="glass-panel theme-card-bg p-4 rounded-3xl border border-slate-300 dark:border-slate-800/80 space-y-3">
                {/* Category Pills */}
                <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
                    <span className="text-xs font-bold theme-text-secondary shrink-0 mr-1 flex items-center">
                        <Filter className="w-3.5 h-3.5 mr-1 text-rose-500" /> Category:
                    </span>
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${category === cat
                                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 font-bold'
                                : 'bg-slate-200 dark:bg-slate-900 theme-text-secondary hover:theme-text-primary border border-slate-300 dark:border-slate-800'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Source Pills */}
                <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar border-t border-slate-300 dark:border-slate-800/60 pt-3">
                    <span className="text-xs font-bold theme-text-secondary shrink-0 mr-1 flex items-center">
                        <Layers className="w-3.5 h-3.5 mr-1 text-amber-500" /> Bureau Source:
                    </span>
                    {SOURCES.map((src) => (
                        <button
                            key={src}
                            onClick={() => setSource(src)}
                            className={`px-3 py-1 rounded-xl text-[11px] font-semibold whitespace-nowrap transition ${source === src
                                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30 font-bold'
                                : 'bg-slate-200 dark:bg-slate-900 theme-text-secondary hover:theme-text-primary border border-slate-300 dark:border-slate-800'
                                }`}
                        >
                            {src}
                        </button>
                    ))}
                </div>
            </div>

            {/* News Grid */}
            {loading ? (
                <div className="py-20 text-center space-y-3">
                    <RefreshCw className="w-8 h-8 text-rose-500 animate-spin mx-auto" />
                    <p className="text-xs theme-text-secondary">Fetching live news updates...</p>
                </div>
            ) : articles.length === 0 ? (
                <div className="glass-card theme-card-bg py-16 text-center rounded-3xl border border-slate-300 dark:border-slate-800 space-y-2">
                    <p className="text-sm font-bold theme-text-primary">No news stories matched your search criteria.</p>
                    <p className="text-xs theme-text-secondary">Try selecting "All" categories or changing your search terms.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article) => (
                        <NewsCard
                            key={article._id}
                            article={article}
                            onOpenArticle={onOpenArticle}
                            onOpenTestEmail={onOpenTestEmail}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
