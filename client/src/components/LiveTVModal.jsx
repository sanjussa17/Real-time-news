import React, { useState } from 'react';
import { X, Tv, Radio, Flame, Volume2, VolumeX, Eye, Play, Pause, Maximize2, Sparkles, Shield } from 'lucide-react';

const CHANNELS = [
    {
        id: 'pulse-live',
        name: 'PULSE LIVE 24x7',
        badge: 'Top National News',
        videoUrl: 'https://www.youtube.com/embed/live_stream?channel=UCq-Fj5jknLsUf-MWSy4_brA', // Generic news stream embed
        viewers: '184.2K',
        headline: 'PRIME DEBATE: High-Speed Rail Corridor & Economy Breakthrough',
        anchor: 'Rajesh Sharma',
        themeColor: 'from-rose-600 to-rose-800',
    },
    {
        id: 'world-wire',
        name: 'WORLD NEWS 24x7',
        badge: 'Global Coverage',
        videoUrl: 'https://www.youtube.com/embed/5qap5aO4i9A',
        viewers: '92.5K',
        headline: 'Global Summit Unveils Historic AI Governance Treaty in Geneva',
        anchor: 'Elena Rostova',
        themeColor: 'from-blue-600 to-indigo-800',
    },
    {
        id: 'market-watch',
        name: 'MARKET PULSE LIVE',
        badge: 'Financial & Economy',
        videoUrl: 'https://www.youtube.com/embed/live_stream?channel=UC4R8DWoMoI7CAwX8_LjQHig',
        viewers: '64.1K',
        headline: 'Sensex & Nifty Surge to All-Time Highs on FII Inflows',
        anchor: 'Vikram Mehta',
        themeColor: 'from-emerald-600 to-teal-800',
    },
    {
        id: 'tech-wire',
        name: 'TECH FRONTIER TV',
        badge: 'Science & Innovation',
        videoUrl: 'https://www.youtube.com/embed/live_stream?channel=UCsooa4yRKGN_zEE8iknghZA',
        viewers: '48.9K',
        headline: 'Quantum 10,000 Qubit Processor Achieves Fault-Tolerant Benchmark',
        anchor: 'Dr. Evelyn Reed',
        themeColor: 'from-cyan-600 to-slate-800',
    },
];

export default function LiveTVModal({ isOpen, onClose }) {
    const [selectedChannel, setSelectedChannel] = useState(CHANNELS[0]);
    const [isMuted, setIsMuted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">

                {/* Top Channel Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90">
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2 px-3 py-1 rounded-xl bg-rose-600/20 border border-rose-500/40 text-rose-400 font-extrabold text-xs tracking-wider uppercase">
                            <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping mr-1" />
                            <span>LIVE BROADCAST NETWORK</span>
                        </div>
                        <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center space-x-2">
                            <span>{selectedChannel.name}</span>
                        </h2>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Channel Switcher Bar */}
                <div className="flex items-center space-x-2 px-6 py-3 bg-slate-950/60 overflow-x-auto border-b border-slate-800/80 no-scrollbar">
                    {CHANNELS.map((ch) => {
                        const isActive = ch.id === selectedChannel.id;
                        return (
                            <button
                                key={ch.id}
                                onClick={() => setSelectedChannel(ch)}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${isActive
                                    ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-lg shadow-rose-600/25'
                                    : 'bg-slate-800/70 hover:bg-slate-800 text-slate-300'
                                    }`}
                            >
                                <Tv className="w-3.5 h-3.5" />
                                <span>{ch.name}</span>
                                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${isActive ? 'bg-black/30 text-white' : 'bg-slate-900 text-slate-400'}`}>
                                    {ch.badge}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Main Video Viewport */}
                <div className="relative flex-1 bg-slate-950 flex flex-col justify-between min-h-[360px]">
                    {/* Simulated / Embedded Video Screen */}
                    <div className="relative w-full h-[380px] bg-black overflow-hidden flex items-center justify-center">
                        <iframe
                            src={`${selectedChannel.videoUrl}?autoplay=1&mute=${isMuted ? 1 : 0}`}
                            title={selectedChannel.name}
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />

                        {/* Top Right Live Viewers & Quality Badge Overlay */}
                        <div className="absolute top-4 right-4 flex items-center space-x-2 z-10">
                            <div className="flex items-center space-x-1 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-slate-200 text-xs font-semibold">
                                <Eye className="w-3.5 h-3.5 text-rose-400" />
                                <span>{selectedChannel.viewers} watching</span>
                            </div>
                            <div className="px-2.5 py-1 rounded-full bg-rose-600 text-white font-extrabold text-[10px] tracking-wider uppercase flex items-center space-x-1 shadow-md">
                                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                                <span>HD LIVE</span>
                            </div>
                        </div>

                        {/* Bottom Times-Now Style News Lower Third Ticker Banner */}
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent p-4 z-10">
                            <div className="flex flex-col space-y-1 max-w-4xl">
                                <div className="flex items-center space-x-2">
                                    <span className="px-2.5 py-0.5 rounded bg-rose-600 text-white text-[10px] font-extrabold uppercase tracking-widest animate-pulse">
                                        BREAKING HEADLINE
                                    </span>
                                    <span className="text-xs font-bold text-amber-400">
                                        ANCHOR: {selectedChannel.anchor}
                                    </span>
                                </div>
                                <p className="text-base font-extrabold text-white leading-tight drop-shadow-md">
                                    {selectedChannel.headline}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Stream Controls Bar */}
                    <div className="flex items-center justify-between px-6 py-3 bg-slate-900 border-t border-slate-800 text-xs text-slate-400">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setIsMuted(!isMuted)}
                                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition"
                            >
                                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                                <span>{isMuted ? 'Unmute Audio' : 'Mute Audio'}</span>
                            </button>
                            <span className="hidden sm:inline text-slate-500">|</span>
                            <span className="hidden sm:inline text-slate-300 font-medium">
                                Studio Desk: <strong>New Delhi Broadcast Hub 1</strong>
                            </span>
                        </div>

                        <div className="flex items-center space-x-2">
                            <span className="flex items-center text-emerald-400 font-semibold text-[11px]">
                                <Shield className="w-3.5 h-3.5 mr-1" />
                                Verified Satellite Broadcast Link
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
