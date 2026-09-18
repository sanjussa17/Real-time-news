import React, { useState } from 'react';
import { ExternalLink, Mail, Flame, Share2, Bookmark, Check, Volume2, Clock, ShieldCheck, Eye } from 'lucide-react';

export default function NewsCard({ article, onOpenArticle, onOpenTestEmail }) {
    const [copied, setCopied] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);

    const handleShare = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(article.url || window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getCategoryColor = (cat) => {
        switch (cat) {
            case 'India': return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
            case 'World': return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
            case 'Technology': return 'bg-cyan-500/10 text-cyan-500 border-cyan-500/30';
            case 'Politics': return 'bg-purple-500/10 text-purple-500 border-purple-500/30';
            case 'Sports': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30';
            case 'Business': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
            case 'Health': return 'bg-rose-500/10 text-rose-500 border-rose-500/30';
            case 'Science': return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/30';
            default: return 'bg-slate-500/10 text-slate-500 border-slate-500/30';
        }
    };

    return (
        <div
            onClick={() => onOpenArticle && onOpenArticle(article)}
            className="glass-card glass-card-hover theme-card-bg rounded-3xl overflow-hidden flex flex-col justify-between h-full group cursor-pointer border border-slate-300 dark:border-slate-800/80 transition-all duration-300 hover:border-rose-500/50 hover:shadow-2xl"
        >
            <div>
                {/* Article Image Header Banner */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                    <img
                        src={article.imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80'}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80';
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                        <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg border backdrop-blur-md ${getCategoryColor(article.category)}`}>
                            {article.category || 'News'}
                        </span>

                        {article.isBreaking && (
                            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-1 rounded-lg bg-rose-600 text-white shadow-lg shadow-rose-600/50 flex items-center space-x-1 animate-pulse">
                                <Flame className="w-3 h-3 fill-current" />
                                <span>BREAKING</span>
                            </span>
                        )}
                    </div>

                    {/* Bookmark Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setBookmarked(!bookmarked);
                        }}
                        className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition ${bookmarked ? 'bg-amber-500 text-white' : 'bg-slate-950/60 text-slate-300 hover:text-white'
                            }`}
                        title={bookmarked ? 'Remove Bookmark' : 'Bookmark Article'}
                    >
                        <Bookmark className="w-4 h-4" />
                    </button>

                    {/* Source & Timestamp */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white font-medium">
                        <span className="bg-slate-950/90 px-2.5 py-0.5 rounded-md border border-slate-700 text-rose-300 font-bold tracking-tight">
                            {article.source}
                        </span>
                        <span className="flex items-center text-[10px] text-slate-200 bg-slate-950/80 px-2 py-0.5 rounded">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(article.publishedAt || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                    </div>
                </div>

                {/* Content Body */}
                <div className="p-5 space-y-2.5">
                    <h3 className="text-base font-extrabold theme-text-primary group-hover:text-rose-500 transition-colors line-clamp-2 leading-snug">
                        {article.title}
                    </h3>
                    <p className="text-xs theme-text-secondary line-clamp-3 leading-relaxed">
                        {article.description}
                    </p>
                </div>
            </div>

            {/* Card Footer Actions */}
            <div className="px-5 pb-5 pt-3 border-t border-slate-300 dark:border-slate-800/60 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onOpenArticle) onOpenArticle(article);
                        }}
                        className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800/90 hover:bg-slate-300 dark:hover:bg-slate-700 text-rose-600 dark:text-rose-400 font-semibold transition"
                        title="Listen / Read full story"
                    >
                        <Volume2 className="w-3.5 h-3.5 text-rose-500" />
                        <span>Listen</span>
                    </button>

                    <button
                        onClick={handleShare}
                        className="p-1.5 rounded-xl bg-slate-200 dark:bg-slate-800/60 hover:bg-slate-300 dark:hover:bg-slate-700 theme-text-secondary transition"
                        title="Share Article Link"
                    >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
                    </button>
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenArticle) onOpenArticle(article);
                    }}
                    className="flex items-center space-x-1 font-bold text-rose-600 dark:text-rose-400 hover:text-rose-500 transition"
                >
                    <span>Read Story</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
}
