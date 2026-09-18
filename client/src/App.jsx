import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

import Navbar from './components/Navbar';
import BreakingTicker from './components/BreakingTicker';
import ToastAlert from './components/ToastAlert';
import TestEmailModal from './components/TestEmailModal';
import LiveTVModal from './components/LiveTVModal';
import ArticleModal from './components/ArticleModal';
import AuthModal from './components/AuthModal';
import UserProfileModal from './components/UserProfileModal';

import Dashboard from './pages/Dashboard';
import NewsFeed from './pages/NewsFeed';
import Preferences from './pages/Preferences';
import AlertHistory from './pages/AlertHistory';
import Simulator from './pages/Simulator';

function MainApp() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isTestEmailOpen, setIsTestEmailOpen] = useState(false);
    const [selectedArticleForEmail, setSelectedArticleForEmail] = useState(null);

    const [isLiveTVOpen, setIsLiveTVOpen] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [selectedArticleForModal, setSelectedArticleForModal] = useState(null);
    const [edition, setEdition] = useState('India');
    const [searchQuery, setSearchQuery] = useState('');

    const handleOpenTestEmail = (article = null) => {
        setSelectedArticleForEmail(article);
        setIsTestEmailOpen(true);
    };

    const handleCloseTestEmail = () => {
        setIsTestEmailOpen(false);
        setSelectedArticleForEmail(null);
    };

    const handleOpenArticle = (article) => {
        setSelectedArticleForModal(article);
    };

    const handleCloseArticle = () => {
        setSelectedArticleForModal(null);
    };

    const handleSearchChange = (query) => {
        setSearchQuery(query);
        if (query && activeTab !== 'feed') {
            setActiveTab('feed');
        }
    };

    return (
        <div className="min-h-screen flex flex-col theme-page-bg theme-text-primary font-sans selection:bg-rose-500 selection:text-white transition-colors duration-300">
            {/* Top Navbar with Market Ticker & Auth Buttons */}
            <Navbar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onOpenLiveTV={() => setIsLiveTVOpen(true)}
                onOpenTestEmail={() => handleOpenTestEmail()}
                onRssSync={() => { }}
                edition={edition}
                setEdition={setEdition}
                searchQuery={searchQuery}
                setSearchQuery={handleSearchChange}
                onOpenAuth={() => setIsAuthOpen(true)}
                onOpenProfile={() => setIsProfileOpen(true)}
            />

            {/* Live Breaking News Ticker */}
            <BreakingTicker onSelectArticle={(article) => handleOpenArticle(article)} />

            {/* Main Content Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'dashboard' && (
                    <Dashboard
                        setActiveTab={setActiveTab}
                        onOpenLiveTV={() => setIsLiveTVOpen(true)}
                        onOpenArticle={handleOpenArticle}
                        onOpenTestEmail={handleOpenTestEmail}
                    />
                )}
                {activeTab === 'feed' && (
                    <NewsFeed
                        onOpenArticle={handleOpenArticle}
                        onOpenTestEmail={handleOpenTestEmail}
                        globalSearchQuery={searchQuery}
                    />
                )}
                {activeTab === 'preferences' && <Preferences />}
                {activeTab === 'history' && <AlertHistory />}
                {activeTab === 'simulator' && (
                    <Simulator onAlertDispatched={() => { }} />
                )}
            </main>

            {/* Real-time Socket Toast Alert */}
            <ToastAlert onOpenArticle={(article) => handleOpenArticle(article)} />

            {/* Auth & Auth Modal (Login / Register / Guest Demo) */}
            <AuthModal
                isOpen={isAuthOpen}
                onClose={() => setIsAuthOpen(false)}
            />

            {/* User Profile & Subscription Modal */}
            <UserProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                onOpenPreferences={() => setActiveTab('preferences')}
            />

            {/* Live TV Video Stream Modal */}
            <LiveTVModal
                isOpen={isLiveTVOpen}
                onClose={() => setIsLiveTVOpen(false)}
            />

            {/* Article Detail Reader Modal (with Text-to-Speech) */}
            <ArticleModal
                isOpen={!!selectedArticleForModal}
                article={selectedArticleForModal}
                onClose={handleCloseArticle}
                onOpenTestEmail={handleOpenTestEmail}
            />

            {/* Email Test Modal */}
            <TestEmailModal
                isOpen={isTestEmailOpen}
                onClose={handleCloseTestEmail}
                defaultArticle={selectedArticleForEmail}
            />

            {/* Footer */}
            <footer className="border-t theme-header-bg py-6 text-center text-xs theme-text-secondary">
                <p>© 2026 PulseNews Real-Time Network. Powered by MERN Stack, Redux Toolkit & WebSockets</p>
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
