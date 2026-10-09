import React, { useEffect, useState } from 'react';
import { History, Mail, ExternalLink, RefreshCw, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import axios from 'axios';

export default function AlertHistory() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/api/notifications');
            setLogs(data);
        } catch (e) {
            console.error('Error fetching notification logs:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold theme-text-primary flex items-center space-x-2">
                        <History className="w-6 h-6 text-rose-500" />
                        <span>Alert History & Notification Logs</span>
                    </h1>
                    <p className="text-xs theme-text-secondary">Audit trail of all email and real-time alerts sent to your account</p>
                </div>

                <button
                    onClick={fetchLogs}
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs font-semibold theme-text-primary hover:bg-slate-300 dark:hover:bg-slate-800 transition"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-rose-500' : ''}`} />
                    <span>Refresh Logs</span>
                </button>
            </div>

            {loading ? (
                <div className="py-20 text-center text-xs theme-text-secondary">Loading history logs...</div>
            ) : logs.length === 0 ? (
                <div className="glass-panel theme-card-bg py-16 text-center rounded-3xl border border-slate-300 dark:border-slate-800 space-y-2">
                    <Mail className="w-8 h-8 theme-text-secondary mx-auto" />
                    <p className="text-sm font-bold theme-text-primary">No alert logs recorded yet.</p>
                    <p className="text-xs theme-text-secondary">Trigger a test email or breaking news alert to generate notification logs.</p>
                </div>
            ) : (
                <div className="glass-panel theme-card-bg rounded-3xl border border-slate-300 dark:border-slate-800 overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-200 dark:bg-slate-900/90 theme-text-secondary font-semibold border-b border-slate-300 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                                <tr>
                                    <th className="py-3.5 px-5">Headline / Article</th>
                                    <th className="py-3.5 px-4">Category</th>
                                    <th className="py-3.5 px-4">Channel</th>
                                    <th className="py-3.5 px-4">Frequency</th>
                                    <th className="py-3.5 px-4">Status</th>
                                    <th className="py-3.5 px-4">Timestamp</th>
                                    <th className="py-3.5 px-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-300 dark:divide-slate-800/60 theme-text-secondary">
                                {logs.map((log) => (
                                    <tr key={log._id} className="hover:bg-slate-200/50 dark:hover:bg-slate-900/50 transition">
                                        <td className="py-4 px-5 max-w-xs font-medium theme-text-primary truncate">
                                            {log.articleTitle}
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-rose-600 dark:text-rose-300 border border-slate-300 dark:border-slate-700 text-[10px] font-bold">
                                                {log.category}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="flex items-center space-x-1">
                                                <Mail className="w-3.5 h-3.5 text-rose-500" />
                                                <span>{log.channel}</span>
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 font-semibold theme-text-secondary">{log.frequency || 'Immediate'}</td>
                                        <td className="py-4 px-4">
                                            <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${log.status === 'Sent' || log.status === 'Delivered'
                                                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                                                : 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                                                }`}>
                                                <CheckCircle className="w-3 h-3" />
                                                <span>{log.status}</span>
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 theme-text-secondary text-[11px]">
                                            {new Date(log.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            {log.previewUrl ? (
                                                <a
                                                    href={log.previewUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center space-x-1 text-emerald-500 hover:text-emerald-400 font-bold hover:underline"
                                                >
                                                    <span>Email Preview</span>
                                                    <ExternalLink className="w-3 h-3" />
                                                </a>
                                            ) : (
                                                <span className="theme-text-secondary text-[10px]">N/A</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
