'use client';

import { motion } from 'framer-motion';
import { WeatherIcon } from './LucideWeatherIcon';
import { Card } from '@/components/ui/Card';
import { containerVariants, cardVariants } from '@/lib/animations/variants';
import { ForecastData } from '@/types/weather';

interface ForecastListProps {
  forecast: ForecastData;
}

export function ForecastList({ forecast }: ForecastListProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <h2 className="text-xl font-semibold text-white dark:text-white light:text-gray-900 mb-4">
        Prévisions 5 jours
      </h2>
      
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {forecast.days.map((day) => (
          <motion.div
            key={day.date}
            variants={cardVariants}
            className="shrink-0 w-28"
          >
            <Card className="flex flex-col items-center gap-2 py-4">
              <p className="text-sm font-medium text-white/80 dark:text-white/80 light:text-gray-700">{day.dayName}</p>
              
              <WeatherIcon icon={day.icon} size="md" />
              
              <div className="flex flex-col items-center">
                <p className="text-lg font-bold text-white dark:text-white light:text-gray-900">
                  {day.tempMax}°
                </p>
                <p className="text-sm text-white/60 dark:text-white/60 light:text-gray-500">
                  {day.tempMin}°
                </p>
              </div>
              
              {day.pop > 0 && (
                <p className="text-xs text-blue-400 dark:text-blue-300 light:text-blue-600">
                  {Math.round(day.pop * 100)}%
                </p>
              )}
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
