import React, { useState } from 'react';
import { Sliders, CheckCircle2, Clock, Mail, Bell, Monitor, Save, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['Technology', 'Politics', 'Sports', 'Business', 'Entertainment', 'Health', 'Science'];
const FREQUENCIES = [
    { id: 'Immediate', label: 'Immediate Alert', desc: 'Real-time breaking news pushed instantly' },
    { id: 'Hourly', label: 'Hourly Digest', desc: 'Summary digest of top stories sent every hour' },
    { id: 'Daily', label: 'Daily Briefing', desc: 'Morning news overview sent once a day at 9:00 AM' },
];

export default function Preferences() {
    const { user, updatePreferences } = useAuth();

    const [selectedCategories, setSelectedCategories] = useState(user?.subscribedCategories || CATEGORIES);
    const [frequency, setFrequency] = useState(user?.alertFrequency || 'Immediate');
    const [channels, setChannels] = useState(user?.channels || { email: true, push: true, inApp: true });
    const [saving, setSaving] = useState(false);
    const [savedMessage, setSavedMessage] = useState(false);

    const toggleCategory = (cat) => {
        setSelectedCategories((prev) =>
            prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
        );
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updatePreferences({
                subscribedCategories: selectedCategories,
                alertFrequency: frequency,
                channels,
            });
            setSavedMessage(true);
            setTimeout(() => setSavedMessage(false), 3000);
        } catch (err) {
            console.error('Failed to save preferences:', err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
                    <Sliders className="w-6 h-6 text-rose-500" />
                    <span>Alert Preferences & Customization</span>
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                    Tailor your news alert categories, delivery frequency, and notification channels.
                </p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                {/* Section 1: Subscribed Categories */}
                <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
                    <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
                        <Sparkles className="w-5 h-5 text-rose-400" />
                        <div>
                            <h3 className="text-base font-bold text-slate-100">News Categories</h3>
                            <p className="text-xs text-slate-400">Select which topics trigger real-time breaking alerts</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                        {CATEGORIES.map((cat) => {
                            const isSelected = selectedCategories.includes(cat);
                            return (
                                <div
                                    key={cat}
                                    onClick={() => toggleCategory(cat)}
                                    className={`cursor-pointer p-4 rounded-2xl border flex items-center justify-between transition ${isSelected
                                            ? 'bg-rose-500/10 border-rose-500/40 text-white'
                                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                                        }`}
                                >
                                    <span className="font-semibold text-xs">{cat}</span>
                                    <div className={`w-5 h-5 rounded-lg flex items-center justify-center border transition ${isSelected ? 'bg-rose-600 border-rose-500 text-white' : 'border-slate-700'
                                        }`}>
                                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Section 2: Frequency Selection */}
                <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
                    <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
                        <Clock className="w-5 h-5 text-amber-400" />
                        <div>
                            <h3 className="text-base font-bold text-slate-100">Alert Frequency</h3>
                            <p className="text-xs text-slate-400">Control how often alerts are dispatched to your inbox</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                        {FREQUENCIES.map((item) => {
                            const isSelected = frequency === item.id;
                            return (
                                <div
                                    key={item.id}
                                    onClick={() => setFrequency(item.id)}
                                    className={`cursor-pointer p-4 rounded-2xl border transition space-y-2 ${isSelected
                                            ? 'bg-amber-500/10 border-amber-500/50 text-white shadow-lg shadow-amber-500/10'
                                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-sm text-slate-100">{item.label}</span>
                                        <span className={`h-2.5 w-2.5 rounded-full ${isSelected ? 'bg-amber-400 animate-pulse' : 'bg-slate-700'}`} />
                                    </div>
                                    <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Section 3: Notification Delivery Channels */}
                <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
                    <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
                        <Bell className="w-5 h-5 text-cyan-400" />
                        <div>
                            <h3 className="text-base font-bold text-slate-100">Notification Tools & Channels</h3>
                            <p className="text-xs text-slate-400">Toggle delivery mediums for news notifications</p>
                        </div>
                    </div>

                    <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                            <div className="flex items-center space-x-3">
                                <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-xs text-white">Email Service Notifications</h4>
                                    <p className="text-[11px] text-slate-400">Send breaking alerts to {user?.email || 'your email'}</p>
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                checked={channels.email}
                                onChange={(e) => setChannels({ ...channels, email: e.target.checked })}
                                className="w-5 h-5 accent-rose-500 rounded cursor-pointer"
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                            <div className="flex items-center space-x-3">
                                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                    <Bell className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-xs text-white">Browser Push Notifications</h4>
                                    <p className="text-[11px] text-slate-400">Display desktop push notifications on breaking news</p>
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                checked={channels.push}
                                onChange={(e) => setChannels({ ...channels, push: e.target.checked })}
                                className="w-5 h-5 accent-rose-500 rounded cursor-pointer"
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                            <div className="flex items-center space-x-3">
                                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                                    <Monitor className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-xs text-white">In-App Live Toast Alerts</h4>
                                    <p className="text-[11px] text-slate-400">Pop up real-time audio/visual toasts in dashboard</p>
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                checked={channels.inApp}
                                onChange={(e) => setChannels({ ...channels, inApp: e.target.checked })}
                                className="w-5 h-5 accent-rose-500 rounded cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                {/* Submit Save Button */}
                <div className="flex items-center justify-between pt-2">
                    {savedMessage && (
                        <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold animate-fade-in">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Preferences saved successfully!</span>
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={saving}
                        className="ml-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center space-x-2 transition"
                    >
                        <Save className="w-4 h-4" />
                        <span>{saving ? 'Saving Changes...' : 'Save Preferences'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
