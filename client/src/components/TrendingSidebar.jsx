import React from 'react';
import { Flame, ShieldCheck, Hash, ChevronRight, Award, MailCheck } from 'lucide-react';
import LivePollWidget from './LivePollWidget';

const TRENDING_TOPICS = [
    { tag: '#Sensex80k', category: 'Markets', posts: '45.2K' },
    { tag: '#ISROSpaceMission', category: 'India', posts: '89.1K' },
    { tag: '#QuantumBreakthrough', category: 'Tech', posts: '34.8K' },
    { tag: '#Budget2026', category: 'Politics', posts: '112.4K' },
    { tag: '#WorldCupFinal', category: 'Sports', posts: '210.5K' },
    { tag: '#AIProtocol2026', category: 'World', posts: '67.9K' },
];

const TOP_OPINIONS = [
    { title: 'The Next Decadal Growth: Why India High-Speed Rail Corridors are Catalytic', author: 'Dr. R. K. Iyer', time: '2 hrs ago' },
    { title: 'Beyond Silicon: How Topological Qubits Will Redefine Medicine', author: 'Prof. Sarah Lin', time: '4 hrs ago' },
];

export default function TrendingSidebar({ onSelectCategory }) {
    return (
        <aside className="space-y-6">

            {/* Live Opinion Poll */}
            <LivePollWidget />

            {/* Trending Topics Widget */}
            <div className="glass-card theme-card-bg rounded-3xl p-5 border border-slate-300 dark:border-slate-800 space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-300 dark:border-slate-800/80 pb-3">
                    <div className="p-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500">
                        <Flame className="w-4 h-4 fill-current animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-xs font-extrabold uppercase tracking-wider theme-text-primary">
                            TRENDING HASHTAGS
                        </h3>
                        <p className="text-[10px] theme-text-secondary">Most Discussed Topics</p>
                    </div>
                </div>

                <div className="space-y-2">
                    {TRENDING_TOPICS.map((item, idx) => (
                        <div
                            key={idx}
                            onClick={() => onSelectCategory && onSelectCategory(item.category)}
                            className="flex items-center justify-between p-2.5 rounded-2xl theme-header-bg hover:border-rose-500/40 border border-slate-300 dark:border-slate-800/60 transition cursor-pointer group"
                        >
                            <div className="flex items-center space-x-2.5">
                                <span className="font-extrabold font-mono text-xs text-rose-500">#{idx + 1}</span>
                                <div>
                                    <h4 className="text-xs font-bold theme-text-primary group-hover:text-rose-500 transition-colors">
                                        {item.tag}
                                    </h4>
                                    <span className="text-[10px] theme-text-secondary">{item.posts} stories</span>
                                </div>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 theme-text-secondary group-hover:text-rose-500 transition-transform group-hover:translate-x-0.5" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Fact Check Verified Desk */}
            <div className="rounded-3xl p-5 border border-emerald-500/40 bg-emerald-500/10 space-y-3">
                <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="w-5 h-5 shrink-0" />
                    <div>
                        <h4 className="text-xs font-extrabold uppercase tracking-wider">
                            PULSE FACT CHECK VERIFIED
                        </h4>
                        <p className="text-[10px] text-emerald-700 dark:text-emerald-300/80">Independent Editorial Verification Desk</p>
                    </div>
                </div>
                <p className="text-xs theme-text-secondary leading-relaxed">
                    All stories tagged with <span className="text-emerald-600 dark:text-emerald-400 font-bold">Verified</span> are audited against official government, institutional, and direct wire source records.
                </p>
            </div>

            {/* Opinion & Analysis Corner */}
            <div className="glass-card theme-card-bg rounded-3xl p-5 border border-slate-300 dark:border-slate-800 space-y-3">
                <div className="flex items-center space-x-2 border-b border-slate-300 dark:border-slate-800/80 pb-3">
                    <Award className="w-4 h-4 text-purple-500" />
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-300">
                        OPINION & ANALYSIS
                    </h3>
                </div>

                <div className="space-y-3">
                    {TOP_OPINIONS.map((op, i) => (
                        <div key={i} className="p-3 rounded-2xl theme-header-bg border border-slate-300 dark:border-slate-800/80 space-y-1">
                            <h4 className="text-xs font-bold theme-text-primary hover:text-rose-500 transition cursor-pointer leading-snug">
                                {op.title}
                            </h4>
                            <div className="flex items-center justify-between text-[10px] theme-text-secondary">
                                <span>{op.author}</span>
                                <span>{op.time}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </aside>
    );
}
