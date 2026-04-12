'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { containerVariants, cardVariants } from '@/lib/animations/variants';
import { CurrentWeather, DetailItem } from '@/types/weather';
import { 
  Droplets, 
  Wind, 
  Gauge, 
  Sun, 
  Sunrise, 
  Sunset, 
  Eye,
  Thermometer
} from 'lucide-react';

interface DetailGridProps {
  weather: CurrentWeather;
}

export function DetailGrid({ weather }: DetailGridProps) {
  const details: DetailItem[] = [
    { icon: 'droplets', label: 'Humidité', value: weather.humidity, unit: '%' },
    { icon: 'wind', label: 'Vent', value: Math.round(weather.windSpeed * 3.6), unit: 'km/h' },
    { icon: 'gauge', label: 'Pression', value: weather.pressure, unit: 'hPa' },
    { icon: 'sun', label: 'UV Index', value: weather.uvi || 0, unit: '' },
    { icon: 'sunrise', label: 'Lever', value: weather.sunrise, unit: '' },
    { icon: 'sunset', label: 'Coucher', value: weather.sunset, unit: '' },
  ];

  const iconMap: Record<string, React.ElementType> = {
    droplets: Droplets,
    wind: Wind,
    gauge: Gauge,
    sun: Sun,
    sunrise: Sunrise,
    sunset: Sunset,
    eye: Eye,
    thermometer: Thermometer,
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 md:grid-cols-3 gap-4"
    >
      {details.map((detail) => {
        const IconComponent = iconMap[detail.icon];
        return (
          <motion.div key={detail.label} variants={cardVariants}>
            <Card className="flex flex-col items-center gap-3 py-5">
              <IconComponent size={24} className="text-white/70 dark:text-white/70 light:text-gray-600" />
              <div className="text-center">
                <p className="text-2xl font-bold text-white dark:text-white light:text-gray-900">
                  {detail.value}{detail.unit}
                </p>
                <p className="text-xs text-white/60 dark:text-white/60 light:text-gray-500 uppercase tracking-wider">
                  {detail.label}
                </p>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
