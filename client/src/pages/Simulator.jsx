import React, { useState } from 'react';
import { Zap, Radio, Send, CheckCircle, Flame, Mail, Wifi, ShieldAlert, Loader2, Lock } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['India', 'World', 'Technology', 'Politics', 'Sports', 'Business', 'Entertainment', 'Health', 'Science'];
const SOURCES = ['Times News Desk', 'Global News Wire', 'Tech Frontier', 'Market Pulse Wire', 'Prime Sports Wire', 'Health Digest', 'Science Frontier'];

export default function Simulator({ onAlertDispatched }) {
    const { token, user } = useAuth();
    const [category, setCategory] = useState('Technology');
    const [source, setSource] = useState('Times News Desk');
    const [headline, setHeadline] = useState('');
    const [description, setDescription] = useState('');
    const [dispatching, setDispatching] = useState(false);
    const [result, setResult] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    const handleTrigger = async (e) => {
        e.preventDefault();
        setDispatching(true);
        setResult(null);
        setErrorMsg('');

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const authToken = token || user?.token || localStorage.getItem('pulsenews_token');
            const headers = authToken && authToken !== 'undefined' ? { Authorization: `Bearer ${authToken}` } : {};

            const { data } = await axios.post(
                `${API_URL}/api/news/trigger-breaking`,
                {
                    category,
                    source,
                    customTitle: headline || undefined,
                    customDescription: description || undefined,
                },
                { headers }
            );

            setResult(data);
            if (onAlertDispatched) onAlertDispatched(data.article);
        } catch (err) {
            console.error('Failed to trigger breaking news:', err);
            setErrorMsg(
                err.response?.data?.message || 'Access restricted. Please log in to trigger breaking news alerts.'
            );
        } finally {
            setDispatching(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold uppercase tracking-wider">
                    <Radio className="w-3.5 h-3.5 animate-pulse text-rose-500" />
                    <span>Protected Alert Broadcast Studio</span>
                </div>
                <h1 className="text-3xl font-extrabold theme-text-primary">Broadcast Breaking News Alert</h1>
                <p className="text-xs theme-text-secondary max-w-xl mx-auto">
                    Simulate a real-time breaking news event (protected route requiring authentication). Emits a Socket.io WebSocket event to active clients and dispatches Email/Push notifications to subscribed users!
                </p>
            </div>

            <form onSubmit={handleTrigger} className="glass-panel theme-card-bg p-6 md:p-8 rounded-3xl border border-slate-300 dark:border-slate-800 space-y-5 shadow-2xl">
                {errorMsg && (
                    <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-bold flex items-center space-x-2">
                        <Lock className="w-4 h-4 shrink-0" />
                        <span>{errorMsg}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold theme-text-secondary mb-1.5">
                            News Category
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl theme-input-bg border border-slate-300 dark:border-slate-800 text-xs theme-text-primary focus:outline-none focus:border-rose-500"
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold theme-text-secondary mb-1.5">
                            Reporting Wire Source
                        </label>
                        <select
                            value={source}
                            onChange={(e) => setSource(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl theme-input-bg border border-slate-300 dark:border-slate-800 text-xs theme-text-primary focus:outline-none focus:border-rose-500"
                        >
                            {SOURCES.map((src) => (
                                <option key={src} value={src}>{src}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold theme-text-secondary mb-1.5">
                        Headline Title (Optional Custom Title)
                    </label>
                    <input
                        type="text"
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                        placeholder="Leave blank for automatic category breaking headline..."
                        className="w-full px-4 py-2.5 rounded-xl theme-input-bg border border-slate-300 dark:border-slate-800 text-xs theme-text-primary focus:outline-none focus:border-rose-500"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold theme-text-secondary mb-1.5">
                        Alert Summary Description (Optional)
                    </label>
                    <textarea
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter brief breaking summary..."
                        className="w-full px-4 py-2.5 rounded-xl theme-input-bg border border-slate-300 dark:border-slate-800 text-xs theme-text-primary focus:outline-none focus:border-rose-500 resize-none"
                    />
                </div>

                <button
                    type="submit"
                    disabled={dispatching}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-sm shadow-xl shadow-rose-600/30 flex items-center justify-center space-x-2 transition disabled:opacity-50"
                >
                    {dispatching ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Broadcasting Alert to Network...</span>
                        </>
                    ) : (
                        <>
                            <Flame className="w-5 h-5" />
                            <span>Broadcast Live Breaking News Alert</span>
                        </>
                    )}
                </button>
            </form>

            {/* Broadcast Dispatch Details */}
            {result && (
                <div className="glass-panel theme-card-bg p-6 rounded-3xl border border-emerald-500/30 shadow-xl space-y-4 animate-fade-in">
                    <div className="flex items-center space-x-3 text-emerald-500 font-bold">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-base">Breaking Alert Broadcast Successful!</span>
                    </div>

                    <div className="p-4 rounded-2xl theme-header-bg border border-slate-300 dark:border-slate-800 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="font-bold theme-text-primary">{result.article?.title}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-600/20 text-rose-500 border border-rose-500/30">
                                {result.article?.category}
                            </span>
                        </div>
                        <p className="theme-text-secondary text-[11px] leading-relaxed">{result.article?.description}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-xl theme-header-bg border border-slate-300 dark:border-slate-800 flex items-center space-x-2.5">
                            <Wifi className="w-4 h-4 text-emerald-500" />
                            <div>
                                <div className="font-bold theme-text-primary">WebSocket Dispatched</div>
                                <div className="text-[10px] theme-text-secondary">Emitted to active subscribers</div>
                            </div>
                        </div>

                        <div className="p-3 rounded-xl theme-header-bg border border-slate-300 dark:border-slate-800 flex items-center space-x-2.5">
                            <Mail className="w-4 h-4 text-amber-500" />
                            <div>
                                <div className="font-bold theme-text-primary">Email Notifications</div>
                                <div className="text-[10px] theme-text-secondary">{result.notificationsSent || 0} user alerts processed</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
