'use client';

import { motion } from 'framer-motion';
import { WeatherIcon } from './LucideWeatherIcon';
import { ForecastData } from '@/types/weather';
import { useTranslations } from 'next-intl';
import { Droplets, Wind } from 'lucide-react';

interface ForecastListProps {
  forecast: ForecastData;
}

export function ForecastList({ forecast }: ForecastListProps) {
  const t = useTranslations('weather');
  
  // Calculer les températures min/max globales pour les barres
  const allTemps = forecast.days.flatMap(d => [d.tempMin, d.tempMax]);
  const minTemp = Math.min(...allTemps);
  const maxTemp = Math.max(...allTemps);
  const tempRange = maxTemp - minTemp || 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white dark:text-white light:text-slate-900">
          {t('daily')}
        </h2>
        <span className="text-xs text-white/40 dark:text-white/40 light:text-slate-400">
          {forecast.city}
        </span>
      </div>
      
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x">
        {forecast.days.map((day, index) => {
          const popPercent = Math.round(day.pop * 100);
          const barWidth = ((day.tempMax - day.tempMin) / tempRange) * 100;
          const barOffset = ((day.tempMin - minTemp) / tempRange) * 100;
          
          return (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                delay: index * 0.08,
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1]
              }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="shrink-0 w-32 snap-start"
            >
              <div className="relative overflow-hidden rounded-2xl bg-white/5 dark:bg-white/5 light:bg-white/60 backdrop-blur-md border border-white/10 dark:border-white/10 light:border-slate-200/60 p-4 transition-all duration-300 hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-white/80 hover:shadow-xl">
                {/* Jour */}
                <p className="text-xs font-medium text-white/50 dark:text-white/50 light:text-slate-500 uppercase tracking-wider text-center">
                  {day.dayName}
                </p>
                
                {/* Icône */}
                <div className="flex justify-center my-3">
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <WeatherIcon icon={day.icon} size="md" />
                  </motion.div>
                </div>
                
                {/* Description tronquée */}
                <p className="text-[10px] text-white/40 dark:text-white/40 light:text-slate-400 text-center capitalize mb-3 truncate">
                  {day.description}
                </p>
                
                {/* Barre de température visuelle */}
                <div className="relative h-1.5 bg-white/10 dark:bg-white/10 light:bg-slate-200 rounded-full mb-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ 
                      left: `${barOffset}%`,
                      width: `${Math.max(barWidth, 15)}%`
                    }}
                    transition={{ delay: index * 0.08 + 0.3, duration: 0.6 }}
                    className="absolute h-full rounded-full bg-linear-to-r from-blue-400 via-cyan-400 to-amber-400"
                  />
                </div>
                
                {/* Températures */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white/60 dark:text-white/60 light:text-slate-500">
                    {Math.round(day.tempMin)}°
                  </span>
                  <span className="text-lg font-bold text-white dark:text-white light:text-slate-900">
                    {Math.round(day.tempMax)}°
                  </span>
                </div>
                
                {/* Probabilité de précipitation */}
                {popPercent > 0 && (
                  <div className="mt-2 flex items-center justify-center gap-1 text-blue-400 dark:text-blue-300 light:text-blue-600">
                    <Droplets className="w-3 h-3" />
                    <span className="text-xs font-medium">{popPercent}%</span>
                  </div>
                )}
                
                {/* Vent si significatif */}
                {day.windSpeed > 20 && (
                  <div className="mt-1 flex items-center justify-center gap-1 text-white/30 dark:text-white/30 light:text-slate-400">
                    <Wind className="w-3 h-3" />
                    <span className="text-[10px]">{Math.round(day.windSpeed)} km/h</span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
