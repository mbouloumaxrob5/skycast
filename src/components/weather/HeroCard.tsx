'use client';

import { motion } from 'framer-motion';
import { WeatherIcon } from './LucideWeatherIcon';
import { Card } from '@/components/ui/Card';
import { heroVariants } from '@/lib/animations/variants';
import { CurrentWeather } from '@/types/weather';
import { formatDate } from '@/lib/utils/formatters';

interface HeroCardProps {
  weather: CurrentWeather;
}

export function HeroCard({ weather }: HeroCardProps) {
  const displayDate = Math.floor(weather.timestamp / 1000);

  return (
    <motion.div variants={heroVariants} initial="initial" animate="animate">
      <Card hoverable={false} className="relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl md:text-3xl font-semibold text-white dark:text-white light:text-gray-900">
              {weather.city}, {weather.country}
            </h1>
            <p className="text-white/70 dark:text-white/70 light:text-gray-500 text-sm">
              {formatDate(displayDate)}
            </p>
            <p className="text-lg text-white/90 dark:text-white/90 light:text-gray-700 capitalize mt-2">
              {weather.description}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <WeatherIcon icon={weather.icon} size="lg" />
            <div className="flex flex-col">
              <span className="text-5xl md:text-7xl font-bold text-white dark:text-white light:text-gray-900">
                {weather.temperature}°
              </span>
              <span className="text-white/70 dark:text-white/70 light:text-gray-500 text-sm">
                Ressenti {weather.feelsLike}°
              </span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
