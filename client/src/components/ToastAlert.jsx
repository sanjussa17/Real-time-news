import React from 'react';
import { Bell, X, ExternalLink, ShieldAlert, Sparkles } from 'lucide-react';
import { useSocket } from '../context/SocketContext';

export default function ToastAlert({ onOpenArticle }) {
    const { activeAlert, dismissAlert } = useSocket();

    if (!activeAlert) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-bounce-in">
            <div className="relative glass-panel bg-slate-900/95 border-2 border-rose-500/80 rounded-2xl p-4 shadow-2xl shadow-rose-950/60 backdrop-blur-2xl overflow-hidden">
                {/* Glowing aura background */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-rose-500/20 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2.5">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 text-white shadow-lg shadow-rose-500/40 animate-pulse">
                            <ShieldAlert className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <span className="text-xs font-black tracking-wider uppercase text-rose-400">
                                    REAL-TIME BREAKING ALERT
                                </span>
                                <span className="text-[10px] bg-rose-500/20 text-rose-300 font-bold px-2 py-0.5 rounded-full border border-rose-500/30">
                                    {activeAlert.category}
                                </span>
                            </div>
                            <p className="text-[11px] text-slate-400">Received via WebSocket Connection</p>
                        </div>
                    </div>
                    <button
                        onClick={dismissAlert}
                        className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="mt-3">
                    <h4 className="font-bold text-sm text-slate-100 line-clamp-2 leading-snug">
                        {activeAlert.title}
                    </h4>
                    <p className="text-xs text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">
                        {activeAlert.description}
                    </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Source: {activeAlert.source}</span>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={dismissAlert}
                            className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 font-medium transition"
                        >
                            Dismiss
                        </button>
                        <a
                            href={activeAlert.url}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => {
                                if (onOpenArticle) onOpenArticle(activeAlert);
                                dismissAlert();
                            }}
                            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold flex items-center space-x-1.5 shadow-md shadow-rose-600/30 transition"
                        >
                            <span>Read News</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
