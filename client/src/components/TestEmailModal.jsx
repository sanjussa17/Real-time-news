import React, { useState, useEffect } from 'react';
import { X, Mail, Send, ExternalLink, CheckCircle, AlertCircle, Loader2, Info } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['India', 'World', 'Technology', 'Politics', 'Sports', 'Business', 'Entertainment', 'Health', 'Science'];

export default function TestEmailModal({ isOpen, onClose, defaultArticle }) {
    const { user, token } = useAuth();
    const [email, setEmail] = useState(user?.email || 'sakthivels05062@gmail.com');
    const [category, setCategory] = useState(defaultArticle?.category || 'Technology');
    const [sending, setSending] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen && user?.email) {
            setEmail(user.email);
        }
    }, [isOpen, user]);

    if (!isOpen) return null;

    const handleSendTestEmail = async (e) => {
        e.preventDefault();
        setSending(true);
        setError(null);
        setResult(null);

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const authToken = token || user?.token || localStorage.getItem('pulsenews_token');
            const headers = authToken && authToken !== 'undefined' ? { Authorization: `Bearer ${authToken}` } : {};

            const { data } = await axios.post(
                `${API_URL}/api/notifications/test-email`,
                {
                    targetEmail: email,
                    category,
                },
                {
                    headers,
                    timeout: 60000, // 60s timeout to allow Render free tier cold start
                }
            );

            setResult(data);
        } catch (err) {
            if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
                setError('Backend server request timed out. If your backend is hosted on Render free tier, it may be waking up from sleep. Please try again in 30 seconds.');
            } else {
                setError(err.response?.data?.message || err.message || 'Failed to send test email. Please check backend CORS and API URL.');
            }
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
            <div className="glass-panel max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                {/* Glow Header Accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500" />

                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <div className="flex items-center space-x-2.5">
                        <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            <Mail className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-base text-slate-100">Test Email Notification</h3>
                            <p className="text-xs text-slate-400">Dispatch Live Email via Gmail SMTP</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSendTestEmail} className="mt-5 space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                            Recipient Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-rose-500 transition"
                            placeholder="user@example.com"
                        />
                        <div className="mt-1.5 flex items-start space-x-1.5 text-[11px] text-emerald-400/90 leading-tight">
                            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <span>
                                <strong>Live Gmail SMTP Active:</strong> Sending to (<code>{email}</code>). Please check your <strong>Inbox</strong> and <strong>Spam/Junk</strong> folder!
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                            Select News Category
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-rose-500 transition"
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={sending}
                        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center justify-center space-x-2 transition disabled:opacity-50"
                    >
                        {sending ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Dispatching Email via Gmail SMTP...</span>
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4" />
                                <span>Send Test Alert Email</span>
                            </>
                        )}
                    </button>
                </form>

                {/* Success Result */}
                {result && (
                    <div className="mt-5 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs space-y-2">
                        <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                            <CheckCircle className="w-4 h-4" />
                            <span>Email Successfully Sent!</span>
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                            {result.message || `Test breaking news alert email sent to ${email}`}
                        </p>
                        <div className="text-[10px] text-slate-400">
                            Check your inbox and Spam folder for sender <code>PulseNews Alerts</code>.
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mt-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
