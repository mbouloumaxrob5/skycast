'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FavoriteCity } from '@/types/weather';
import { Star, X, MapPin } from 'lucide-react';
import { WeatherIcon } from './LucideWeatherIcon';
import { useTranslations } from 'next-intl';

interface FavoritesListProps {
  favorites: FavoriteCity[];
  onSelect: (city: FavoriteCity) => void;
  onRemove: (cityId: string) => void;
}

export function FavoritesList({ favorites, onSelect, onRemove }: FavoritesListProps) {
  const t = useTranslations('favorites');
  if (favorites.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-3"
    >
      <div className="flex items-center gap-3">
        <motion.div 
          className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center border border-amber-400/20 shadow-lg shadow-amber-500/10"
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Star size={18} className="text-amber-400" />
          </motion.div>
        </motion.div>
        <h2 className="text-lg font-bold text-slate-800 dark:bg-linear-to-r dark:from-white dark:to-white/80 dark:bg-clip-text dark:text-transparent">
          {t('title')}
        </h2>
        <motion.span 
          className="text-xs font-semibold text-amber-400/80 bg-amber-500/10 border border-amber-400/20 px-2.5 py-1 rounded-full backdrop-blur-sm"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, delay: 0.2 }}
        >
          {favorites.length}
        </motion.span>
      </div>
      
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
        <AnimatePresence mode="popLayout">
          {favorites.map((city, index) => (
            <motion.div
              key={city.id}
              layout
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: -20 }}
              transition={{ 
                delay: index * 0.05,
                duration: 0.3,
                layout: { duration: 0.3 }
              }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="shrink-0 w-36 snap-start"
            >
              <div 
                onClick={() => onSelect(city)}
                className="relative overflow-hidden rounded-2xl bg-white/5 dark:bg-white/5 light:bg-white/60 backdrop-blur-md border border-white/10 dark:border-white/10 light:border-slate-200/60 p-4 cursor-pointer transition-all duration-300 hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-white/80 hover:shadow-xl hover:border-yellow-400/30 group"
              >
                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(city.id);
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-white/5 dark:bg-white/5 light:bg-slate-200/50 text-white/40 dark:text-white/40 light:text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-red-500/50 hover:text-white transition-all duration-200"
                >
                  <X size={12} />
                </button>
                
                <div className="flex flex-col items-center gap-2">
                  {/* Location icon */}
                  <div className="flex items-center gap-1 text-white/30 dark:text-white/30 light:text-slate-400">
                    <MapPin size={10} />
                    <span className="text-[10px] uppercase tracking-wider">{city.country}</span>
                  </div>
                  
                  {/* City name */}
                  <p className="text-sm font-semibold text-white dark:text-white light:text-slate-900 truncate w-full text-center">
                  {city.name}
                  </p>
                  
                  {/* Weather info */}
                  {city.current ? (
                    <div className="flex flex-col items-center gap-1 mt-1">
                      <motion.div
                        animate={{ y: [0, -2, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <WeatherIcon icon={city.current.icon} size="sm" />
                      </motion.div>
                      <p className="text-2xl font-bold text-white dark:text-white light:text-slate-900">
                        {Math.round(city.current.temperature)}°
                      </p>
                      <p className="text-[10px] text-white/40 dark:text-white/40 light:text-slate-400 capitalize truncate max-w-24">
                        {city.current.description}
                      </p>
                    </div>
                  ) : (
                    <div className="h-16 flex items-center justify-center">
                      <motion.div
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-1.5 h-1.5 rounded-full bg-white/30"
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
