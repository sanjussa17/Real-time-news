import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const savedToken = localStorage.getItem('pulsenews_token');
const savedUser = localStorage.getItem('pulsenews_user') ? JSON.parse(localStorage.getItem('pulsenews_user')) : null;

if (savedToken) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
}

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const { data } = await axios.post('/api/auth/login', { email, password });
            localStorage.setItem('pulsenews_token', data.token);
            localStorage.setItem('pulsenews_user', JSON.stringify(data));
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Login failed');
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async ({ name, email, password }, { rejectWithValue }) => {
        try {
            const { data } = await axios.post('/api/auth/register', { name, email, password });
            localStorage.setItem('pulsenews_token', data.token);
            localStorage.setItem('pulsenews_user', JSON.stringify(data));
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Registration failed');
        }
    }
);

export const guestLogin = createAsyncThunk(
    'auth/guestLogin',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.post('/api/auth/guest');
            localStorage.setItem('pulsenews_token', data.token);
            localStorage.setItem('pulsenews_user', JSON.stringify(data));
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Guest login failed');
        }
    }
);

export const updatePreferences = createAsyncThunk(
    'auth/updatePreferences',
    async (prefData, { rejectWithValue }) => {
        try {
            const { data } = await axios.put('/api/preferences', prefData);
            const currentUser = JSON.parse(localStorage.getItem('pulsenews_user') || '{}');
            const updatedUser = { ...currentUser, ...data };
            localStorage.setItem('pulsenews_user', JSON.stringify(updatedUser));
            return updatedUser;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update preferences');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: savedUser || {
            _id: 'guest_default',
            name: 'Reader',
            email: 'demo@pulsenews.live',
            subscribedCategories: ['Technology', 'Politics', 'Sports', 'Business', 'India', 'World'],
            preferredSources: ['Times News Desk', 'Global News Wire'],
            alertFrequency: 'Immediate',
            channels: { email: true, push: true, inApp: true },
        },
        token: savedToken || null,
        isAuthenticated: !!savedToken,
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            localStorage.removeItem('pulsenews_token');
            localStorage.removeItem('pulsenews_user');
            delete axios.defaults.headers.common['Authorization'];
            state.user = {
                _id: 'guest_default',
                name: 'Reader',
                email: 'demo@pulsenews.live',
                subscribedCategories: ['Technology', 'Politics', 'Sports', 'Business', 'India', 'World'],
                preferredSources: ['Times News Desk', 'Global News Wire'],
                alertFrequency: 'Immediate',
                channels: { email: true, push: true, inApp: true },
            };
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.token = action.payload.token;
                state.isAuthenticated = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Register
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.token = action.payload.token;
                state.isAuthenticated = true;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Guest Login
            .addCase(guestLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.token = action.payload.token;
                state.isAuthenticated = true;
            })
            // Update Preferences
            .addCase(updatePreferences.fulfilled, (state, action) => {
                state.user = action.payload;
            });
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
