import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { supabase } from '../supabaseClient';

const API_BASE = import.meta.env.VITE_API_URL || '';
axios.defaults.baseURL = API_BASE;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('pulsenews_token') || '');
    const [supabaseSession, setSupabaseSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            try {
                // 1. Check active Supabase Auth session
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    setSupabaseSession(session);
                    const accessToken = session.access_token;
                    setToken(accessToken);
                    localStorage.setItem('pulsenews_token', accessToken);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                }

                // 2. Initialize stored token or guest session with backend
                const storedToken = localStorage.getItem('pulsenews_token');
                if (storedToken) {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
                    setToken(storedToken);
                }

                const { data } = await axios.post('/api/auth/guest');
                setUser(data);
                if (data.token && !storedToken && !session) {
                    setToken(data.token);
                    localStorage.setItem('pulsenews_token', data.token);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
                }
            } catch (err) {
                console.error('Auth initialization notice:', err.message);
            } finally {
                setLoading(false);
            }
        };

        initAuth();

        // Listen to Supabase Auth state changes (sign in, sign out, token refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session) {
                setSupabaseSession(session);
                const accessToken = session.access_token;
                setToken(accessToken);
                localStorage.setItem('pulsenews_token', accessToken);
                axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            } else if (event === 'SIGNED_OUT') {
                setSupabaseSession(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const loginUser = async (email, password) => {
        // 1. Authenticate with Supabase Auth
        const { data: sbData, error: sbError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (sbError && !sbError.message.includes('Invalid login credentials')) {
            console.warn('[SupabaseAuth] Notice:', sbError.message);
        }

        // 2. Sync with Backend DB
        const { data } = await axios.post('/api/auth/login', { email, password });
        const activeToken = sbData?.session?.access_token || data.token;

        setUser(data);
        if (activeToken) {
            setToken(activeToken);
            localStorage.setItem('pulsenews_token', activeToken);
            axios.defaults.headers.common['Authorization'] = `Bearer ${activeToken}`;
        }
        return data;
    };

    const registerUser = async (name, email, password) => {
        // 1. Register with Supabase Auth
        const { data: sbData, error: sbError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name },
            },
        });

        if (sbError) {
            console.warn('[SupabaseAuth] Registration notice:', sbError.message);
        }

        // 2. Register in Backend DB
        const { data } = await axios.post('/api/auth/register', { name, email, password });
        const activeToken = sbData?.session?.access_token || data.token;

        setUser(data);
        if (activeToken) {
            setToken(activeToken);
            localStorage.setItem('pulsenews_token', activeToken);
            axios.defaults.headers.common['Authorization'] = `Bearer ${activeToken}`;
        }
        return data;
    };

    const logoutUser = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('pulsenews_token');
        delete axios.defaults.headers.common['Authorization'];
        setToken('');
        setSupabaseSession(null);

        // Reset to guest session
        try {
            const { data } = await axios.post('/api/auth/guest');
            setUser(data);
            setToken(data.token);
            localStorage.setItem('pulsenews_token', data.token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        } catch (err) {
            setUser(null);
        }
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
        <AuthContext.Provider value={{ user, token, supabaseSession, loading, loginUser, registerUser, logoutUser, updatePreferences }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
