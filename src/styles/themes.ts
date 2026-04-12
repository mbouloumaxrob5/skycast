import { WeatherCondition, WeatherTheme } from '@/types/weather';

export const weatherThemes: Record<WeatherCondition, WeatherTheme> = {
  'clear': {
    name: 'Ensoleillé',
    gradient: 'from-blue-400 via-cyan-300 to-blue-500',
    accent: '#F59E0B',
    text: '#1E293B',
    icon: 'sun',
  },
  'clouds': {
    name: 'Nuageux',
    gradient: 'from-slate-400 via-gray-300 to-slate-500',
    accent: '#64748B',
    text: '#1E293B',
    icon: 'cloud',
  },
  'rain': {
    name: 'Pluvieux',
    gradient: 'from-blue-700 via-indigo-600 to-slate-800',
    accent: '#3B82F6',
    text: '#F8FAFC',
    icon: 'cloud-rain',
  },
  'drizzle': {
    name: 'Bruine',
    gradient: 'from-blue-600 via-cyan-600 to-slate-700',
    accent: '#06B6D4',
    text: '#F8FAFC',
    icon: 'cloud-drizzle',
  },
  'thunderstorm': {
    name: 'Orageux',
    gradient: 'from-indigo-900 via-purple-800 to-slate-900',
    accent: '#8B5CF6',
    text: '#F8FAFC',
    icon: 'cloud-lightning',
  },
  'snow': {
    name: 'Neige',
    gradient: 'from-blue-100 via-white to-blue-200',
    accent: '#0EA5E9',
    text: '#1E293B',
    icon: 'snowflake',
  },
  'mist': {
    name: 'Brumeux',
    gradient: 'from-gray-400 via-slate-300 to-gray-500',
    accent: '#64748B',
    text: '#1E293B',
    icon: 'cloud-fog',
  },
  'night-clear': {
    name: 'Nuit claire',
    gradient: 'from-indigo-950 via-purple-900 to-slate-950',
    accent: '#FBBF24',
    text: '#F8FAFC',
    icon: 'moon',
  },
  'night-clouds': {
    name: 'Nuit nuageuse',
    gradient: 'from-slate-900 via-indigo-950 to-slate-950',
    accent: '#94A3B8',
    text: '#F8FAFC',
    icon: 'cloud-moon',
  },
};

export function getWeatherTheme(conditionId: number, iconCode: string): WeatherTheme {
  const isNight = iconCode.includes('n');
  
  if (conditionId >= 200 && conditionId < 300) {
    return weatherThemes['thunderstorm'];
  } else if (conditionId >= 300 && conditionId < 400) {
    return weatherThemes['drizzle'];
  } else if (conditionId >= 500 && conditionId < 600) {
    return weatherThemes['rain'];
  } else if (conditionId >= 600 && conditionId < 700) {
    return weatherThemes['snow'];
  } else if (conditionId >= 700 && conditionId < 800) {
    return weatherThemes['mist'];
  } else if (conditionId === 800) {
    return isNight ? weatherThemes['night-clear'] : weatherThemes['clear'];
  } else if (conditionId > 800) {
    return isNight ? weatherThemes['night-clouds'] : weatherThemes['clouds'];
  }
  
  return weatherThemes['clear'];
}

export const glassStyles = {
  base: 'backdrop-blur-xl bg-white/10 border border-white/20',
  card: 'rounded-2xl shadow-2xl shadow-black/10',
  hover: 'hover:bg-white/15 hover:border-white/30 transition-all duration-300',
  active: 'active:scale-95',
};
