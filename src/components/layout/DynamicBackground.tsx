'use client';

import { useMemo } from 'react';
import { CurrentWeather, WeatherTheme } from '@/types/weather';
import { getWeatherTheme } from '@/styles/themes';
import { useThemeStore } from '@/store/themeStore';

interface DynamicBackgroundProps {
  weather: CurrentWeather | null;
  children: React.ReactNode;
}

export function DynamicBackground({ weather, children }: DynamicBackgroundProps) {
  const { isDark } = useThemeStore();
  
  const theme = useMemo<WeatherTheme>(() => {
    if (!weather) {
      // Fallback différent selon le thème
      return isDark 
        ? {
            name: 'Default',
            gradient: 'from-slate-800 via-slate-900 to-black',
            accent: '#3B82F6',
            text: '#F8FAFC',
            icon: 'cloud',
          }
        : {
            name: 'Default',
            gradient: 'from-slate-100 via-slate-200 to-slate-300',
            accent: '#3B82F6',
            text: '#1E293B',
            icon: 'cloud',
          };
    }
    return getWeatherTheme(weather.conditionId, weather.icon);
  }, [weather, isDark]);

  return (
    <div 
      className={`min-h-screen bg-linear-to-br ${theme.gradient} transition-all duration-1000`}
      style={{ 
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Overlay adaptatif selon le thème */}
      <div className={`fixed inset-0 pointer-events-none transition-opacity duration-500 ${
        isDark ? 'bg-black/20' : 'bg-white/10'
      }`} />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
