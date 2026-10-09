import { createSlice } from '@reduxjs/toolkit';

const initialTheme = localStorage.getItem('pulsenews_theme') || 'dark';

const themeSlice = createSlice({
    name: 'theme',
    initialState: {
        mode: initialTheme,
    },
    reducers: {
        toggleThemeMode: (state) => {
            state.mode = state.mode === 'dark' ? 'light' : 'dark';
            localStorage.setItem('pulsenews_theme', state.mode);
        },
        setThemeMode: (state, action) => {
            state.mode = action.payload;
            localStorage.setItem('pulsenews_theme', action.payload);
        },
    },
});

export const { toggleThemeMode, setThemeMode } = themeSlice.actions;
export default themeSlice.reducer;
