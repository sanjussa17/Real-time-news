import React, { useState } from 'react';
import { ExternalLink, Mail, Flame, Share2, Bookmark, Check } from 'lucide-react';
import axios from 'axios';

export default function NewsCard({ article, onOpenTestEmail }) {
    const [copied, setCopied] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);

    const handleShare = () => {
        navigator.clipboard.writeText(article.url || window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getCategoryColor = (cat) => {
        switch (cat) {
            case 'Technology': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
            case 'Politics': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
            case 'Sports': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
            case 'Business': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
            case 'Health': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
            case 'Science': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
        }
    };

    return (
        <div className="glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col justify-between h-full group">
            <div>
                {/* Article Image / Header Banner */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                    <img
                        src={article.imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80'}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80';
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex items-center space-x-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border backdrop-blur-md ${getCategoryColor(article.category)}`}>
                            {article.category}
                        </span>
                        {article.isBreaking && (
                            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-1 rounded-lg bg-rose-600 text-white shadow-lg shadow-rose-600/50 flex items-center space-x-1 animate-pulse">
                                <Flame className="w-3 h-3 fill-current" />
                                <span>BREAKING</span>
                            </span>
                        )}
                    </div>

                    <button
                        onClick={() => setBookmarked(!bookmarked)}
                        className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition ${bookmarked ? 'bg-amber-500 text-white' : 'bg-slate-900/60 text-slate-300 hover:text-white'
                            }`}
                        title={bookmarked ? 'Remove Bookmark' : 'Bookmark Article'}
                    >
                        <Bookmark className="w-4 h-4" />
                    </button>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300 font-medium">
                        <span className="bg-slate-950/80 px-2.5 py-0.5 rounded-md border border-slate-800">
                            {article.source}
                        </span>
                        <span>{new Date(article.publishedAt || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </div>

                {/* Content Body */}
                <div className="p-5">
                    <h3 className="text-base font-bold text-slate-100 group-hover:text-rose-400 transition-colors line-clamp-2 leading-snug">
                        {article.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2.5 line-clamp-3 leading-relaxed">
                        {article.description}
                    </p>
                </div>
            </div>

            {/* Card Footer Actions */}
            <div className="px-5 pb-5 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => onOpenTestEmail && onOpenTestEmail(article)}
                        className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-rose-300 font-medium transition"
                        title="Dispatch email notification for this article"
                    >
                        <Mail className="w-3.5 h-3.5 text-rose-400" />
                        <span>Email Alert</span>
                    </button>

                    <button
                        onClick={handleShare}
                        className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-300 transition"
                        title="Share Article Link"
                    >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                    </button>
                </div>

                <a
                    href={article.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-1 font-semibold text-rose-400 hover:text-rose-300 transition"
                >
                    <span>Read Full</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                </a>
            </div>
        </div>
    );
}
