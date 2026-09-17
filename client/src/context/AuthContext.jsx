import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Auto-login guest or stored user on mount
    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem('pulsenews_token');
            if (storedToken) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            }

            try {
                // Log in as Guest by default if no stored session exists
                const { data } = await axios.post('/api/auth/guest');
                setUser(data);
                localStorage.setItem('pulsenews_token', data.token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            } catch (err) {
                console.error('Failed to init guest session:', err);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const loginUser = async (email, password) => {
        const { data } = await axios.post('/api/auth/login', { email, password });
        setUser(data);
        localStorage.setItem('pulsenews_token', data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        return data;
    };

    const registerUser = async (name, email, password) => {
        const { data } = await axios.post('/api/auth/register', { name, email, password });
        setUser(data);
        localStorage.setItem('pulsenews_token', data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        return data;
    };

    const updatePreferences = async (newPrefs) => {
        const { data } = await axios.put('/api/preferences', newPrefs);
        setUser((prev) => ({
            ...prev,
            subscribedCategories: data.subscribedCategories,
            preferredSources: data.preferredSources,
            alertFrequency: data.alertFrequency,
            channels: data.channels,
        }));
        return data;
    };

    return (
        <AuthContext.Provider value={{ user, loading, loginUser, registerUser, updatePreferences }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
