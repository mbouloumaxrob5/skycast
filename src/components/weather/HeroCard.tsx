'use client';

import { motion } from 'framer-motion';
import { WeatherIcon } from './LucideWeatherIcon';
import { CurrentWeather } from '@/types/weather';
import { formatDate } from '@/lib/utils/formatters';
import { useTranslations } from 'next-intl';
import { Droplets, Wind, Eye, Gauge } from 'lucide-react';

interface HeroCardProps {
  weather: CurrentWeather;
}

// Détermine le gradient selon la météo et la température
function getWeatherGradient(icon: string, temp: number): string {
  // Soleil / Clair
  if (icon.includes('01') || icon.includes('02')) {
    if (temp > 25) return 'from-orange-400/30 via-amber-300/20 to-yellow-200/10';
    if (temp > 15) return 'from-sky-400/30 via-blue-300/20 to-cyan-200/10';
    return 'from-blue-400/30 via-sky-300/20 to-white/10';
  }
  // Nuages
  if (icon.includes('03') || icon.includes('04')) {
    return 'from-slate-400/30 via-gray-300/20 to-slate-200/10';
  }
  // Pluie
  if (icon.includes('09') || icon.includes('10')) {
    return 'from-blue-600/30 via-slate-500/20 to-gray-400/10';
  }
  // Orage
  if (icon.includes('11')) {
    return 'from-indigo-600/40 via-purple-500/30 to-slate-600/20';
  }
  // Neige
  if (icon.includes('13')) {
    return 'from-white/40 via-sky-100/30 to-blue-100/20';
  }
  // Brouillard
  if (icon.includes('50')) {
    return 'from-gray-400/30 via-slate-300/20 to-gray-200/10';
  }
  return 'from-blue-500/20 via-cyan-400/10 to-transparent';
}

export function HeroCard({ weather }: HeroCardProps) {
  const t = useTranslations('weather');
  const displayDate = Math.floor(weather.timestamp / 1000);
  const gradient = getWeatherGradient(weather.icon, weather.temperature);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-white/10 to-white/5 dark:from-white/10 dark:to-white/5 light:from-white/80 light:to-white/60 backdrop-blur-xl border border-white/20 dark:border-white/20 light:border-white/40 shadow-2xl">
        {/* Gradient dynamique selon météo */}
        <div className={`absolute inset-0 bg-linear-to-br ${gradient} opacity-60`} />
        
        {/* Effet de glow */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />
        
        <div className="relative p-6 md:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex flex-col gap-1"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-white dark:text-white light:text-slate-900 tracking-tight">
                {weather.city}
              </h1>
              <p className="text-white/60 dark:text-white/60 light:text-slate-500 text-sm font-medium">
                {weather.country} • {formatDate(displayDate)}
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 dark:bg-white/10 light:bg-white/60 backdrop-blur-md border border-white/20"
            >
              <WeatherIcon icon={weather.icon} size="md" />
              <span className="text-white/90 dark:text-white/90 light:text-slate-700 capitalize font-medium">
                {weather.description}
              </span>
            </motion.div>
          </div>
          
          {/* Température principale */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-8 flex items-end gap-6"
          >
            <div className="relative">
              <span className="text-7xl md:text-9xl font-bold text-white dark:text-white light:text-slate-900 tracking-tighter">
                {Math.round(weather.temperature)}°
              </span>
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-2 -right-8 md:-right-12"
              >
                <WeatherIcon icon={weather.icon} size="lg" />
              </motion.div>
            </div>
            <div className="flex flex-col gap-1 mb-3 md:mb-4">
              <span className="text-white/60 dark:text-white/60 light:text-slate-500 text-sm">
                {t('feelsLike')} {Math.round(weather.feelsLike)}°
              </span>
              <span className="text-white/40 dark:text-white/40 light:text-slate-400 text-xs">
                {weather.tempMin !== undefined && weather.tempMax !== undefined 
                  ? `H: ${Math.round(weather.tempMax)}°  L: ${Math.round(weather.tempMin)}°`
                  : ''}
              </span>
            </div>
          </motion.div>
          
          {/* Détails météo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3"
          >
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 dark:bg-white/5 light:bg-white/40 backdrop-blur-sm border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-blue-400/20 flex items-center justify-center">
                <Droplets className="w-5 h-5 text-blue-300" />
              </div>
              <div>
                <p className="text-xs text-white/50 dark:text-white/50 light:text-slate-500">{t('humidity')}</p>
                <p className="text-sm font-semibold text-white dark:text-white light:text-slate-800">{weather.humidity}%</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 dark:bg-white/5 light:bg-white/40 backdrop-blur-sm border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-cyan-400/20 flex items-center justify-center">
                <Wind className="w-5 h-5 text-cyan-300" />
              </div>
              <div>
                <p className="text-xs text-white/50 dark:text-white/50 light:text-slate-500">{t('wind')}</p>
                <p className="text-sm font-semibold text-white dark:text-white light:text-slate-800">{weather.windSpeed} km/h</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 dark:bg-white/5 light:bg-white/40 backdrop-blur-sm border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 flex items-center justify-center">
                <Eye className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <p className="text-xs text-white/50 dark:text-white/50 light:text-slate-500">{t('visibility')}</p>
                <p className="text-sm font-semibold text-white dark:text-white light:text-slate-800">{(weather.visibility / 1000).toFixed(1)} km</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 dark:bg-white/5 light:bg-white/40 backdrop-blur-sm border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-purple-400/20 flex items-center justify-center">
                <Gauge className="w-5 h-5 text-purple-300" />
              </div>
              <div>
                <p className="text-xs text-white/50 dark:text-white/50 light:text-slate-500">{t('pressure')}</p>
                <p className="text-sm font-semibold text-white dark:text-white light:text-slate-800">{weather.pressure} hPa</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
