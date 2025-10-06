import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface SettingsState {
  // User preferences
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // App preferences
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  dateFormat: string;
  
  // Notification settings
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  
  // Privacy settings
  profileVisibility: 'public' | 'private' | 'friends';
  dataSharing: boolean;
  analyticsTracking: boolean;
  
  // Display settings
  fontSize: 'small' | 'medium' | 'large';
  compactMode: boolean;
  showAnimations: boolean;
  
  // Advanced settings
  autoSave: boolean;
  debugMode: boolean;
  betaFeatures: boolean;
}

const initialState: SettingsState = {
  // User preferences
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '(555) 123-4567',
  
  // App preferences
  theme: 'light',
  language: 'en',
  timezone: 'America/New_York',
  dateFormat: 'MM/DD/YYYY',
  
  // Notification settings
  emailNotifications: true,
  pushNotifications: true,
  smsNotifications: false,
  marketingEmails: false,
  
  // Privacy settings
  profileVisibility: 'private',
  dataSharing: false,
  analyticsTracking: true,
  
  // Display settings
  fontSize: 'medium',
  compactMode: false,
  showAnimations: true,
  
  // Advanced settings
  autoSave: true,
  debugMode: false,
  betaFeatures: false,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateSetting: <K extends keyof SettingsState>(
      state: SettingsState,
      action: PayloadAction<{ key: K; value: SettingsState[K] }>
    ) => {
      const { key, value } = action.payload;
      state[key] = value;
    },
    updateMultipleSettings: (
      state: SettingsState,
      action: PayloadAction<Partial<SettingsState>>
    ) => {
      Object.assign(state, action.payload);
    },
    resetSettings: () => initialState,
    loadSettings: (state, action: PayloadAction<Partial<SettingsState>>) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { 
  updateSetting, 
  updateMultipleSettings, 
  resetSettings, 
  loadSettings 
} = settingsSlice.actions;

export default settingsSlice.reducer;
