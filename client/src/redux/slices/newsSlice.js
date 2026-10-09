import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchNewsArticles = createAsyncThunk(
    'news/fetchNewsArticles',
    async ({ category, source, search, isBreaking } = {}, { rejectWithValue }) => {
        try {
            const params = {};
            if (category && category !== 'All') params.category = category;
            if (source && source !== 'All') params.source = source;
            if (search) params.search = search;
            if (isBreaking) params.isBreaking = true;

            const { data } = await axios.get('/api/news', { params });
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch news articles');
        }
    }
);

export const syncRssFeeds = createAsyncThunk(
    'news/syncRssFeeds',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const { data } = await axios.post('/api/news/rss-sync');
            dispatch(fetchNewsArticles());
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to sync RSS feeds');
        }
    }
);

const newsSlice = createSlice({
    name: 'news',
    initialState: {
        articles: [],
        heroArticle: null,
        category: 'All',
        source: 'All',
        searchQuery: '',
        edition: 'India',
        loading: false,
        rssSyncing: false,
        error: null,
    },
    reducers: {
        setCategory: (state, action) => {
            state.category = action.payload;
        },
        setSource: (state, action) => {
            state.source = action.payload;
        },
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        },
        setEdition: (state, action) => {
            state.edition = action.payload;
        },
        addLiveArticle: (state, action) => {
            state.articles.unshift(action.payload);
            state.heroArticle = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNewsArticles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNewsArticles.fulfilled, (state, action) => {
                state.loading = false;
                state.articles = action.payload;
                if (action.payload.length > 0) {
                    state.heroArticle = action.payload[0];
                }
            })
            .addCase(fetchNewsArticles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(syncRssFeeds.pending, (state) => {
                state.rssSyncing = true;
            })
            .addCase(syncRssFeeds.fulfilled, (state) => {
                state.rssSyncing = false;
            })
            .addCase(syncRssFeeds.rejected, (state) => {
                state.rssSyncing = false;
            });
    },
});

export const { setCategory, setSource, setSearchQuery, setEdition, addLiveArticle } = newsSlice.actions;
export default newsSlice.reducer;
