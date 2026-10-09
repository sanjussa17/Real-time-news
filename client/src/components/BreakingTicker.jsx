import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Flame, Zap, AlertCircle } from 'lucide-react';
import { useSocket } from '../context/SocketContext';

export default function BreakingTicker({ onSelectArticle }) {
    const [breakingHeadlines, setBreakingHeadlines] = useState([]);
    const { alertHistory } = useSocket();

    useEffect(() => {
        const fetchBreaking = async () => {
            try {
                const { data } = await axios.get('/api/news/breaking');
                setBreakingHeadlines(data);
            } catch (e) {
                console.error('Failed to fetch breaking news for ticker:', e);
            }
        };
        fetchBreaking();
    }, []);

    const displayHeadlines = alertHistory.length > 0
        ? [...alertHistory, ...breakingHeadlines]
        : breakingHeadlines;

    if (!displayHeadlines || displayHeadlines.length === 0) {
        return (
            <div className="theme-header-bg border-b border-slate-300 dark:border-slate-800 text-xs py-2 px-4 flex items-center justify-between theme-text-secondary">
                <div className="flex items-center space-x-2">
                    <Zap className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                    <span className="font-semibold text-rose-500 uppercase tracking-wider">Live Wire:</span>
                    <span>Listening for breaking news alerts across 7 categories...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-r from-rose-900/10 via-slate-200 dark:via-slate-900 to-rose-900/10 border-b border-rose-500/20 text-xs py-2 overflow-hidden flex items-center shadow-inner">
            <div className="flex-none px-4 flex items-center space-x-2 z-10 theme-header-bg py-0.5 border-r border-rose-500/30 shadow-md">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
                <span className="font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center space-x-1">
                    <Flame className="w-3.5 h-3.5 text-rose-500 inline mr-1" />
                    BREAKING NEWS
                </span>
            </div>

            <div className="overflow-hidden whitespace-nowrap w-full">
                <div className="animate-marquee flex items-center space-x-8">
                    {displayHeadlines.concat(displayHeadlines).map((item, idx) => (
                        <div
                            key={`${item._id || idx}-${idx}`}
                            onClick={() => onSelectArticle && onSelectArticle(item)}
                            className="inline-flex items-center space-x-2 cursor-pointer hover:underline theme-text-primary transition"
                        >
                            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-rose-600/20 text-rose-600 dark:text-rose-300 border border-rose-500/30">
                                {item.category}
                            </span>
                            <span className="font-semibold theme-text-primary">{item.title}</span>
                            <span className="theme-text-secondary text-[11px]">• {item.source}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
