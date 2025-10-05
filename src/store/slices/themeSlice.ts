// src/features/theme/themeSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentTheme: 'light',
    themes: {
        light: {
            backgroundColor: '#ffffff',
            textColor: '#0f172a',   // slate-900
            primaryColor: '#2563eb', // matches tailwind primary
            secondaryColor: '#0ea5e9',
            accentColor: '#f59e0b',
        },
        dark: {
            backgroundColor: '#0b1220',
            textColor: '#e5e7eb',   // gray-200
            primaryColor: '#0ea5e9', // swap roles in dark if desired
            secondaryColor: '#2563eb',
            accentColor: '#f59e0b',
        },
    },
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.currentTheme = state.currentTheme === 'light' ? 'dark' : 'light';
        },
        setTheme: (state, action) => {
            state.currentTheme = action.payload;
        },
    },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;