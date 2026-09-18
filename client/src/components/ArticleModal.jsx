import React, { useState, useEffect } from 'react';
import { X, Volume2, VolumeX, Share2, Bookmark, Flame, MessageSquare, ThumbsUp, Send, Check, Clock, User, Globe, ExternalLink } from 'lucide-react';

export default function ArticleModal({ article, isOpen, onClose, onOpenTestEmail }) {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [copied, setCopied] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [likes, setLikes] = useState(42);
    const [hasLiked, setHasLiked] = useState(false);
    const [comments, setComments] = useState([
        { id: 1, user: 'Ananya Roy', text: 'Crucial update! The infrastructure planning looks promising.', time: '10 mins ago' },
        { id: 2, user: 'Dev Sharma', text: 'Great coverage. Looking forward to further developments.', time: '25 mins ago' },
    ]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        // Reset speech synthesis when modal closes
        return () => {
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    if (!isOpen || !article) return null;

    const handleTextToSpeech = () => {
        if (!('speechSynthesis' in window)) {
            alert('Text-to-Speech is not supported in this browser.');
            return;
        }

        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        } else {
            const textToRead = `${article.title}. ${article.description || ''}. ${article.content || ''}`;
            const utterance = new SpeechSynthesisUtterance(textToRead);
            utterance.rate = 0.95;
            utterance.pitch = 1;
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);

            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utterance);
            setIsSpeaking(true);
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(article.url || window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleLike = () => {
        if (!hasLiked) {
            setLikes(likes + 1);
            setHasLiked(true);
        } else {
            setLikes(likes - 1);
            setHasLiked(false);
        }
    };

    const handleAddComment = (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        setComments([
            ...comments,
            { id: Date.now(), user: 'You (Reader)', text: newComment.trim(), time: 'Just now' },
        ]);
        setNewComment('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-3xl glass-card theme-card-bg border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">

                {/* Header Control Bar */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/60 theme-header-bg sticky top-0 z-10">
                    <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-rose-600/20 text-rose-500 border border-rose-500/30">
                            {article.category || 'News'}
                        </span>
                        {article.isBreaking && (
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-rose-600 text-white flex items-center space-x-1 animate-pulse">
                                <Flame className="w-3 h-3" />
                                <span>BREAKING</span>
                            </span>
                        )}
                    </div>

                    <button
                        onClick={() => {
                            if (window.speechSynthesis) window.speechSynthesis.cancel();
                            setIsSpeaking(false);
                            onClose();
                        }}
                        className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-rose-500 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Article Scrollable Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Featured Image */}
                    <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-700/60">
                        <img
                            src={article.imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80'}
                            alt={article.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80';
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-slate-200 font-medium">
                            <span className="bg-slate-950/90 px-3 py-1 rounded-lg border border-slate-800 text-rose-300 font-bold">
                                {article.source}
                            </span>
                            <div className="flex items-center space-x-3 text-slate-300">
                                <span className="flex items-center"><User className="w-3.5 h-3.5 mr-1" /> {article.author || 'Editorial Bureau'}</span>
                                <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> 3 min read</span>
                            </div>
                        </div>
                    </div>

                    {/* Title & Speech Controls */}
                    <div className="space-y-4">
                        <h1 className="text-2xl sm:text-3xl font-extrabold theme-text-primary leading-tight">
                            {article.title}
                        </h1>

                        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl theme-header-bg border border-slate-300 dark:border-slate-800">
                            {/* Text to Speech Button */}
                            <button
                                onClick={handleTextToSpeech}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${isSpeaking
                                    ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-600/30'
                                    : 'bg-rose-600 hover:bg-rose-500 text-white shadow-md'
                                    }`}
                            >
                                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-white" />}
                                <span>{isSpeaking ? 'Pause Audio Reader' : 'Listen to Article (Audio)'}</span>
                            </button>

                            {/* Actions */}
                            <div className="flex items-center space-x-2 text-xs">
                                <button
                                    onClick={handleLike}
                                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border transition ${hasLiked
                                        ? 'bg-rose-600/20 text-rose-500 border-rose-500/40 font-bold'
                                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                                        }`}
                                >
                                    <ThumbsUp className="w-3.5 h-3.5" />
                                    <span>{likes} Likes</span>
                                </button>

                                <button
                                    onClick={() => setBookmarked(!bookmarked)}
                                    className={`p-2 rounded-xl border transition ${bookmarked
                                        ? 'bg-amber-500/20 text-amber-500 border-amber-500/40'
                                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                                        }`}
                                    title="Bookmark Article"
                                >
                                    <Bookmark className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={handleShare}
                                    className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 transition"
                                    title="Share Link"
                                >
                                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Article Content Text */}
                    <div className="space-y-4 text-sm leading-relaxed">
                        <p className="text-base font-semibold theme-text-primary border-l-4 border-rose-500 pl-4 py-1">
                            {article.description}
                        </p>
                        <div className="whitespace-pre-line theme-text-secondary">
                            {article.content || (
                                <>
                                    <p>Detailed reports confirm that key developments are actively underway. Broadcast desks and correspondents are monitoring verified updates directly from officials and analysts on the ground.</p>
                                    <br />
                                    <p>Stay tuned to PulseNews live coverage for updates as further details are released by key bureaus.</p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* External Link */}
                    <div className="pt-4 border-t border-slate-300 dark:border-slate-800 flex items-center justify-between">
                        <a
                            href={article.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center space-x-1.5 text-xs font-bold text-rose-500 hover:text-rose-400 transition"
                        >
                            <span>Read Original Wire Source</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        <button
                            onClick={() => onOpenTestEmail && onOpenTestEmail(article)}
                            className="text-xs font-medium theme-text-secondary hover:underline"
                        >
                            Send Email Notification Test
                        </button>
                    </div>

                    {/* Comments & Discussion Section */}
                    <div className="pt-6 border-t border-slate-300 dark:border-slate-800 space-y-4">
                        <h3 className="text-sm font-bold theme-text-primary flex items-center space-x-2">
                            <MessageSquare className="w-4 h-4 text-rose-500" />
                            <span>Reader Discussion ({comments.length})</span>
                        </h3>

                        <form onSubmit={handleAddComment} className="flex space-x-2">
                            <input
                                type="text"
                                placeholder="Add your perspective on this article..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="flex-1 px-4 py-2 rounded-xl theme-input-bg border border-slate-300 dark:border-slate-800 text-xs theme-text-primary focus:outline-none focus:border-rose-500"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition flex items-center space-x-1"
                            >
                                <span>Post</span>
                                <Send className="w-3.5 h-3.5" />
                            </button>
                        </form>

                        <div className="space-y-3">
                            {comments.map((c) => (
                                <div key={c.id} className="p-3.5 rounded-xl theme-header-bg border border-slate-300 dark:border-slate-800 text-xs space-y-1">
                                    <div className="flex items-center justify-between theme-text-secondary text-[11px]">
                                        <span className="font-bold theme-text-primary">{c.user}</span>
                                        <span>{c.time}</span>
                                    </div>
                                    <p className="theme-text-secondary">{c.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
