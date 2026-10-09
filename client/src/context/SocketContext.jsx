import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [activeAlert, setActiveAlert] = useState(null);
    const [alertHistory, setAlertHistory] = useState([]);
    const [audioEnabled, setAudioEnabled] = useState(true);

    useEffect(() => {
        // Connect directly to backend port 5000 in dev or VITE_API_URL in production
        const targetUrl = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : window.location.origin);

        const socketInstance = io(targetUrl, {
            transports: ['polling', 'websocket'],
            reconnectionAttempts: 10,
            reconnectionDelay: 2000,
            autoConnect: true,
        });

        socketInstance.on('connect', () => {
            console.log('[Socket.io Client] Real-time news server connected');
            setIsConnected(true);
        });

        socketInstance.on('disconnect', () => {
            console.log('[Socket.io Client] Disconnected from real-time news server');
            setIsConnected(false);
        });

        socketInstance.on('connect_error', (err) => {
            // Silently handle retry
            setIsConnected(false);
        });

        socketInstance.on('breaking_news', (article) => {
            console.log('[Socket.io Client] Received Breaking Alert:', article);
            setActiveAlert(article);
            setAlertHistory((prev) => [article, ...prev]);

            if (audioEnabled) {
                try {
                    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(880, audioCtx.currentTime);
                    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.start();
                    osc.stop(audioCtx.currentTime + 0.3);
                } catch (e) {
                    // Audio fallback
                }
            }
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, [audioEnabled]);

    const dismissAlert = () => setActiveAlert(null);
    const toggleAudio = () => setAudioEnabled((prev) => !prev);

    return (
        <SocketContext.Provider
            value={{
                socket,
                isConnected,
                activeAlert,
                alertHistory,
                dismissAlert,
                audioEnabled,
                toggleAudio,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
