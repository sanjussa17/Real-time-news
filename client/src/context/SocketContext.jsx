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
        const targetUrl = import.meta.env.VITE_API_URL || window.location.origin;

        const socketInstance = io(targetUrl, {
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 5,
        });

        socketInstance.on('connect', () => {
            console.log('[Socket.io Client] Connected to real-time news server');
            setIsConnected(true);
        });

        socketInstance.on('disconnect', () => {
            console.log('[Socket.io Client] Disconnected from server');
            setIsConnected(false);
        });

        socketInstance.on('breaking_news', (article) => {
            console.log('[Socket.io Client] Received Breaking News Alert:', article);
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
                    // Audio context fallback
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
