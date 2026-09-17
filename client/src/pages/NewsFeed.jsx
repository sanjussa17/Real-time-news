import React, { useState, useEffect } from 'react';
import { Search, Filter, RefreshCw, Rss, Layers } from 'lucide-react';
import axios from 'axios';
import NewsCard from '../components/NewsCard';

const CATEGORIES = ['All', 'Technology', 'Politics', 'Sports', 'Business', 'Entertainment', 'Health', 'Science'];
const SOURCES = ['All', 'TechCrunch', 'BBC News', 'Reuters', 'CNN', 'Bloomberg', 'The Wall Street Journal', 'Associated Press'];

export default function NewsFeed({ onOpenTestEmail }) {
    const [articles, setArticles] = useState([]);
    const [category, setCategory] = useState('All');
    const [source, setSource] = useState('All');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchArticles = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/api/news', {
                params: { category, source, search },
            });
            setArticles(data);
        } catch (e) {
            console.error('Error loading news feed:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, [category, source]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchArticles();
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header & Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
                        <Rss className="w-6 h-6 text-rose-500" />
                        <span>Live News Aggregator</span>
                    </h1>
                    <p className="text-xs text-slate-400">Filter news by category, source, or search keywords</p>
                </div>

                {/* Search Input Form */}
                <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search breaking headlines..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 transition"
                    />
                    <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                </form>
            </div>

            {/* Category Pills & Source Filters */}
            <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 space-y-3">
                {/* Category Pills */}
                <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
                    <span className="text-xs font-bold text-slate-400 shrink-0 mr-1 flex items-center">
                        <Filter className="w-3.5 h-3.5 mr-1 text-rose-400" /> Category:
                    </span>
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${category === cat
                                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Source Pills */}
                <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none border-t border-slate-800/60 pt-3">
                    <span className="text-xs font-bold text-slate-400 shrink-0 mr-1 flex items-center">
                        <Layers className="w-3.5 h-3.5 mr-1 text-amber-400" /> Source:
                    </span>
                    {SOURCES.map((src) => (
                        <button
                            key={src}
                            onClick={() => setSource(src)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${source === src
                                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
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
                    <p className="text-xs text-slate-400">Fetching latest articles...</p>
                </div>
            ) : articles.length === 0 ? (
                <div className="glass-card py-16 text-center rounded-3xl border border-slate-800 space-y-2">
                    <p className="text-sm font-bold text-slate-300">No articles matched your filter criteria.</p>
                    <p className="text-xs text-slate-500">Try adjusting your search query or selecting "All" categories.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article) => (
                        <NewsCard key={article._id} article={article} onOpenTestEmail={onOpenTestEmail} />
                    ))}
                </div>
            )}
        </div>
    );
}
