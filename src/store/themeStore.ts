'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { analytics } from '@/lib/analytics/analyticsService';

type ThemeMode = 'dark' | 'light' | 'system';

interface ThemeState {
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

function getInitialDarkMode(mode: ThemeMode): boolean {
  if (mode === 'system') {
    return typeof window !== 'undefined' 
      ? window.matchMedia('(prefers-color-scheme: dark)').matches 
      : true;
  }
  return mode === 'dark';
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'dark',
      isDark: true,
      
      setMode: (mode) => {
        const isDark = getInitialDarkMode(mode);
        set({ mode, isDark });
        document.documentElement.classList.toggle('dark', isDark);
        document.documentElement.classList.toggle('light', !isDark);
        analytics.track('settings_change', { 
          setting: 'theme', 
          value: mode 
        });
      },
      
      toggleTheme: () => {
        const newIsDark = !get().isDark;
        const newMode = newIsDark ? 'dark' : 'light';
        set({ mode: newMode, isDark: newIsDark });
        document.documentElement.classList.toggle('dark', newIsDark);
        document.documentElement.classList.toggle('light', !newIsDark);
        analytics.track('theme_toggle', { 
          mode: newMode 
        });
      },
    }),
    {
      name: 'skycast-theme',
      onRehydrateStorage: () => (state) => {
        if (state) {
          const isDark = getInitialDarkMode(state.mode);
          state.isDark = isDark;
          document.documentElement.classList.toggle('dark', isDark);
          document.documentElement.classList.toggle('light', !isDark);
        }
      },
    }
  )
);
