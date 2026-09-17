import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

import Navbar from './components/Navbar';
import BreakingTicker from './components/BreakingTicker';
import ToastAlert from './components/ToastAlert';
import TestEmailModal from './components/TestEmailModal';

import Dashboard from './pages/Dashboard';
import NewsFeed from './pages/NewsFeed';
import Preferences from './pages/Preferences';
import AlertHistory from './pages/AlertHistory';
import Simulator from './pages/Simulator';

function MainApp() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isTestEmailOpen, setIsTestEmailOpen] = useState(false);
    const [selectedArticleForEmail, setSelectedArticleForEmail] = useState(null);

    const handleOpenTestEmail = (article = null) => {
        setSelectedArticleForEmail(article);
        setIsTestEmailOpen(true);
    };

    const handleCloseTestEmail = () => {
        setIsTestEmailOpen(false);
        setSelectedArticleForEmail(null);
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-rose-500 selection:text-white">
            {/* Top Navbar */}
            <Navbar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onOpenTestEmail={() => handleOpenTestEmail()}
            />

            {/* Live Breaking News Ticker */}
            <BreakingTicker onSelectArticle={(article) => handleOpenTestEmail(article)} />

            {/* Main Content Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'dashboard' && (
                    <Dashboard
                        setActiveTab={setActiveTab}
                        onOpenTestEmail={handleOpenTestEmail}
                    />
                )}
                {activeTab === 'feed' && (
                    <NewsFeed onOpenTestEmail={handleOpenTestEmail} />
                )}
                {activeTab === 'preferences' && <Preferences />}
                {activeTab === 'history' && <AlertHistory />}
                {activeTab === 'simulator' && (
                    <Simulator onAlertDispatched={() => { }} />
                )}
            </main>

            {/* Real-time Socket Toast Alert */}
            <ToastAlert onOpenArticle={(article) => handleOpenTestEmail(article)} />

            {/* Email Test Modal */}
            <TestEmailModal
                isOpen={isTestEmailOpen}
                onClose={handleCloseTestEmail}
                defaultArticle={selectedArticleForEmail}
            />

            {/* Footer */}
            <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
                <p>© 2026 PulseNews Real-Time Alert System. Built with MERN Stack & Socket.io</p>
            </footer>
        </div>
    );
}

export default function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <SocketProvider>
                    <MainApp />
                </SocketProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}
