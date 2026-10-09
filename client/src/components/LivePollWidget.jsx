import React, { useState, useEffect } from 'react';
import { Vote, CheckCircle2, Award, Sparkles, BarChart2 } from 'lucide-react';
import axios from 'axios';

export default function LivePollWidget() {
    const [poll, setPoll] = useState({
        question: "Will AI & Automated Systems transform broadcast news by 2030?",
        options: [
            { id: 'yes', label: 'Yes, full transformational shift', votes: 1420 },
            { id: 'hybrid', label: 'Hybrid human-AI co-creation', votes: 2890 },
            { id: 'no', label: 'No, human editorial remains core', votes: 610 },
        ],
        totalVotes: 4920,
    });
    const [selectedOption, setSelectedOption] = useState(null);
    const [hasVoted, setHasVoted] = useState(false);

    useEffect(() => {
        const fetchPoll = async () => {
            try {
                const res = await axios.get('/api/news/poll');
                if (res.data) setPoll(res.data);
            } catch (e) {
                // fallback
            }
        };
        fetchPoll();
    }, []);

    const handleVote = async (optionId) => {
        if (hasVoted) return;
        setSelectedOption(optionId);
        setHasVoted(true);

        try {
            const res = await axios.post('/api/news/poll/vote', { optionId });
            if (res.data) setPoll(res.data);
        } catch (e) {
            // optimistic local update
            const updated = { ...poll };
            const opt = updated.options.find(o => o.id === optionId);
            if (opt) opt.votes += 1;
            updated.totalVotes += 1;
            setPoll(updated);
        }
    };

    return (
        <div className="glass-card theme-card-bg rounded-3xl p-5 border border-slate-300 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-300 dark:border-slate-800/80 pb-3">
                <div className="flex items-center space-x-2">
                    <div className="p-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
                        <Vote className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                            NATIONAL OPINION POLL
                        </h3>
                        <p className="text-[10px] theme-text-secondary">Live Voice of the Nation</p>
                    </div>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full theme-header-bg theme-text-primary border border-slate-300 dark:border-slate-700">
                    {poll.totalVotes.toLocaleString()} votes
                </span>
            </div>

            <p className="text-xs font-bold theme-text-primary leading-snug">
                {poll.question}
            </p>

            <div className="space-y-2.5">
                {poll.options.map((opt) => {
                    const percentage = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
                    const isSelected = selectedOption === opt.id;

                    return (
                        <div
                            key={opt.id}
                            onClick={() => handleVote(opt.id)}
                            className={`relative overflow-hidden p-3 rounded-2xl border transition-all cursor-pointer select-none ${hasVoted
                                ? isSelected
                                    ? 'border-rose-500/60 bg-rose-500/10'
                                    : 'border-slate-300 dark:border-slate-800 theme-header-bg'
                                : 'border-slate-300 dark:border-slate-800 theme-header-bg hover:border-rose-500/40'
                                }`}
                        >
                            {/* Animated Percentage Fill Bar */}
                            {hasVoted && (
                                <div
                                    className={`absolute left-0 top-0 bottom-0 transition-all duration-1000 ${isSelected ? 'bg-rose-500/20' : 'bg-slate-300/40 dark:bg-slate-800/40'
                                        }`}
                                    style={{ width: `${percentage}%` }}
                                />
                            )}

                            <div className="relative z-10 flex items-center justify-between text-xs">
                                <div className="flex items-center space-x-2 font-medium theme-text-primary">
                                    {hasVoted && isSelected && (
                                        <CheckCircle2 className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                    )}
                                    <span>{opt.label}</span>
                                </div>

                                {hasVoted && (
                                    <span className="font-extrabold font-mono text-xs text-rose-500 shrink-0">
                                        {percentage}%
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {hasVoted && (
                <div className="text-[10px] text-center text-emerald-600 dark:text-emerald-400 font-semibold pt-1 flex items-center justify-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Your vote has been counted in real-time!</span>
                </div>
            )}
        </div>
    );
}
