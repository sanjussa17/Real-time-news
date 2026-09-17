import React, { useState } from 'react';
import { Zap, Radio, Send, CheckCircle, Flame, Mail, Wifi, ShieldAlert, Loader2 } from 'lucide-react';
import axios from 'axios';

const CATEGORIES = ['Technology', 'Politics', 'Sports', 'Business', 'Entertainment', 'Health', 'Science'];
const SOURCES = ['TechCrunch', 'BBC News', 'Reuters', 'CNN', 'Bloomberg', 'The Wall Street Journal', 'Associated Press'];

export default function Simulator({ onAlertDispatched }) {
    const [category, setCategory] = useState('Technology');
    const [source, setSource] = useState('TechCrunch');
    const [headline, setHeadline] = useState('');
    const [description, setDescription] = useState('');
    const [dispatching, setDispatching] = useState(false);
    const [result, setResult] = useState(null);

    const handleTrigger = async (e) => {
        e.preventDefault();
        setDispatching(true);
        setResult(null);

        try {
            const { data } = await axios.post('/api/news/trigger-breaking', {
                category,
                source,
                customTitle: headline || undefined,
                customDescription: description || undefined,
            });

            setResult(data);
            if (onAlertDispatched) onAlertDispatched(data.article);
        } catch (err) {
            console.error('Failed to trigger breaking news:', err);
        } finally {
            setDispatching(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider">
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                    <span>Real-Time Event Simulator</span>
                </div>
                <h1 className="text-3xl font-extrabold text-white">Broadcast Breaking News Alert</h1>
                <p className="text-xs text-slate-400 max-w-xl mx-auto">
                    Simulate a real-time breaking news event. This will emit a Socket.io WebSocket event to active clients and dispatch Nodemailer email notifications to subscribed users!
                </p>
            </div>

            <form onSubmit={handleTrigger} className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-800 space-y-5 shadow-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                            News Category
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-semibold focus:outline-none focus:border-rose-500 transition"
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                            News Wire Source
                        </label>
                        <select
                            value={source}
                            onChange={(e) => setSource(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-semibold focus:outline-none focus:border-rose-500 transition"
                        >
                            {SOURCES.map((src) => (
                                <option key={src} value={src}>{src}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Breaking Headline Title (Optional - auto-generated if blank)
                    </label>
                    <input
                        type="text"
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                        placeholder="e.g. Breakthrough Quantum Computing Microprocessor Unveiled"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-rose-500 transition"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Alert Details & Description (Optional)
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        placeholder="Provide breaking story context or details..."
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-rose-500 transition"
                    />
                </div>

                <button
                    type="submit"
                    disabled={dispatching}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-extrabold text-sm shadow-xl shadow-rose-600/30 flex items-center justify-center space-x-2 transition disabled:opacity-50"
                >
                    {dispatching ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Broadcasting Alert via WebSocket & Email...</span>
                        </>
                    ) : (
                        <>
                            <Flame className="w-5 h-5" />
                            <span>BROADCAST BREAKING NEWS ALERT NOW</span>
                        </>
                    )}
                </button>
            </form>

            {/* Broadcast Result Details */}
            {result && (
                <div className="glass-panel p-6 rounded-3xl border border-emerald-500/40 bg-emerald-950/20 text-xs space-y-3 animate-fade-in shadow-2xl">
                    <div className="flex items-center space-x-2 text-emerald-400 font-extrabold text-sm">
                        <CheckCircle className="w-5 h-5" />
                        <span>Alert Successfully Broadcasted Across All Channels!</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center space-x-3">
                            <Wifi className="w-5 h-5 text-cyan-400 shrink-0" />
                            <div>
                                <div className="font-bold text-slate-200">WebSocket Broadcast</div>
                                <div className="text-[11px] text-slate-400">Pushed to all active client sockets</div>
                            </div>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center space-x-3">
                            <Mail className="w-5 h-5 text-rose-400 shrink-0" />
                            <div>
                                <div className="font-bold text-slate-200">Nodemailer Dispatch</div>
                                <div className="text-[11px] text-slate-400">{result.notificationsSent} email notification(s) sent</div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2 border-t border-emerald-500/20">
                        <span className="text-slate-400 font-medium">Broadcasted Headline:</span>
                        <p className="font-bold text-white text-sm mt-0.5">{result.article?.title}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
