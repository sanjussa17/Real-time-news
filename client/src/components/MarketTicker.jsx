import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Sun, RefreshCw, Globe, ShieldCheck } from 'lucide-react';
import axios from 'axios';

export default function MarketTicker({ onRssSync }) {
    const [markets, setMarkets] = useState([
        { symbol: 'SENSEX', value: '82,840.15', change: '+380.40', percent: '+0.46%', isUp: true },
        { symbol: 'NIFTY 50', value: '25,310.80', change: '+115.20', percent: '+0.45%', isUp: true },
        { symbol: 'NASDAQ', value: '18,290.40', change: '+142.10', percent: '+0.78%', isUp: true },
        { symbol: 'GOLD (10g)', value: '₹74,250', change: '-120.00', percent: '-0.16%', isUp: false },
        { symbol: 'BITCOIN', value: '$64,850', change: '+$1,240', percent: '+1.95%', isUp: true },
    ]);

    const [weather, setWeather] = useState([
        { city: 'New Delhi', temp: '31°C', condition: 'Sunny' },
        { city: 'Mumbai', temp: '29°C', condition: 'Humid' },
        { city: 'Bengaluru', temp: '25°C', condition: 'Pleasant' },
        { city: 'London', temp: '18°C', condition: 'Cloudy' },
    ]);

    const [syncing, setSyncing] = useState(false);

    useEffect(() => {
        const fetchTickerData = async () => {
            try {
                const [mRes, wRes] = await Promise.all([
                    axios.get('/api/news/market-ticker'),
                    axios.get('/api/news/weather'),
                ]);
                if (mRes.data) setMarkets(mRes.data);
                if (wRes.data) setWeather(wRes.data);
            } catch (err) {
                // fallback to state default
            }
        };
        fetchTickerData();
    }, []);

    const handleSyncClick = async () => {
        setSyncing(true);
        try {
            await axios.get('/api/news/rss-sync');
            if (onRssSync) onRssSync();
        } catch (e) {
            console.error('RSS Sync failed', e);
        } finally {
            setTimeout(() => setSyncing(false), 1200);
        }
    };

    return (
        <div className="theme-header-bg border-b text-xs py-1.5 px-4 overflow-hidden backdrop-blur-md">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">

                {/* Left: Market Indices Ticker */}
                <div className="flex items-center space-x-4 overflow-x-auto no-scrollbar scroll-smooth">
                    <div className="flex items-center space-x-1 font-bold text-rose-500 uppercase tracking-wider text-[10px] shrink-0 border-r border-slate-300 dark:border-slate-800 pr-3">
                        <TrendingUp className="w-3.5 h-3.5 text-rose-500" />
                        <span>Markets</span>
                    </div>

                    <div className="flex items-center space-x-4 shrink-0 font-mono text-[11px]">
                        {markets.map((m, idx) => (
                            <div key={idx} className="flex items-center space-x-1.5 shrink-0">
                                <span className="font-semibold theme-text-secondary">{m.symbol}:</span>
                                <span className="theme-text-primary">{m.value}</span>
                                <span className={`flex items-center text-[10px] font-bold ${m.isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {m.isUp ? <TrendingUp className="w-3 h-3 mr-0.5 inline" /> : <TrendingDown className="w-3 h-3 mr-0.5 inline" />}
                                    {m.percent}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Weather & Live RSS Sync */}
                <div className="hidden lg:flex items-center space-x-4 text-[11px]">
                    {/* Weather Bar */}
                    <div className="flex items-center space-x-3 theme-text-secondary border-r border-slate-300 dark:border-slate-800 pr-3">
                        <Sun className="w-3.5 h-3.5 text-amber-500" />
                        {weather.map((w, i) => (
                            <span key={i}>
                                <strong className="theme-text-primary">{w.city}:</strong> {w.temp}
                            </span>
                        ))}
                    </div>

                    {/* RSS Live Fetch Action Button */}
                    <button
                        onClick={handleSyncClick}
                        disabled={syncing}
                        className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-600 dark:text-rose-300 border border-rose-500/30 text-[10px] font-semibold tracking-wide uppercase transition hover:text-white"
                        title="Fetch live news feeds automatically"
                    >
                        <RefreshCw className={`w-3 h-3 ${syncing ? 'animate-spin text-rose-500' : ''}`} />
                        <span>{syncing ? 'Syncing RSS...' : 'Fetch Live RSS'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
