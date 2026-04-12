'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { containerVariants, cardVariants } from '@/lib/animations/variants';
import { FavoriteCity } from '@/types/weather';
import { Star, X } from 'lucide-react';
import { WeatherIcon } from './LucideWeatherIcon';

interface FavoritesListProps {
  favorites: FavoriteCity[];
  onSelect: (city: FavoriteCity) => void;
  onRemove: (cityId: string) => void;
}

export function FavoritesList({ favorites, onSelect, onRemove }: FavoritesListProps) {
  if (favorites.length === 0) return null;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <div className="flex items-center gap-2 text-white/80 dark:text-white/80 light:text-gray-700">
        <Star size={18} className="text-yellow-400" />
        <h2 className="text-lg font-semibold text-white dark:text-white light:text-gray-900">Villes favorites</h2>
      </div>
      
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {favorites.map((city) => (
          <motion.div
            key={city.id}
            variants={cardVariants}
            className="shrink-0 w-36"
          >
            <Card className="relative p-3" hoverable onClick={() => onSelect(city)}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(city.id);
                }}
                className="absolute top-2 right-2 p-1 rounded-full bg-white/10 dark:bg-white/10 light:bg-gray-200/50 hover:bg-red-500/50 text-white/70 dark:text-white/70 light:text-gray-600 hover:text-white transition-colors"
              >
                <X size={12} />
              </button>
              
              <div className="flex flex-col items-center gap-1">
                <p className="text-sm font-medium text-white dark:text-white light:text-gray-900 truncate w-full text-center">
                  {city.name}
                </p>
                <p className="text-xs text-white/50 dark:text-white/50 light:text-gray-500">{city.country}</p>
                
                {city.current ? (
                  <>
                    <WeatherIcon icon={city.current.icon} size="sm" />
                    <p className="text-lg font-bold text-white dark:text-white light:text-gray-900">{city.current.temperature}°</p>
                  </>
                ) : (
                  <p className="text-xs text-white/40 dark:text-white/40 light:text-gray-400 italic">Charger...</p>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
