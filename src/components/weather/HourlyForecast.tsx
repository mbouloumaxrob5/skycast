'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WeatherIcon } from './LucideWeatherIcon';
import { ForecastItem } from '@/types/weather';
import { cn } from '@/lib/utils/cn';
import { Droplets } from 'lucide-react';

// Fonction de formatage inline pour éviter les problèmes d'import
const shortTime = (date: Date): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

interface HourlyForecastProps {
  forecast: ForecastItem[];
}

interface TooltipData {
  time: Date;
  temp: number;
  description: string;
  pop: number;
  index: number;
}

export function HourlyForecast({ forecast }: HourlyForecastProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);

  const hourlyData = useMemo(() => {
    // Prendre les 8 prochaines prévisions (24h avec intervalles de 3h)
    return forecast.slice(0, 8).map(item => ({
      time: new Date(item.dt * 1000),
      temp: item.main.temp,
      icon: item.weather[0]?.icon || '01d',
      description: item.weather[0]?.description || '',
      pop: item.pop || 0,
      humidity: item.main.humidity || 0,
      wind: item.wind?.speed || 0,
    }));
  }, [forecast]);

  const minTemp = Math.min(...hourlyData.map(d => d.temp));
  const maxTemp = Math.max(...hourlyData.map(d => d.temp));
  const tempRange = maxTemp - minTemp || 1;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  } as const;

  const barVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: (height: number) => ({
      height: `${height}%`,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 15,
        duration: 0.6,
      },
    }),
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 15,
      },
    },
  } as const;

  const handleBarHover = (index: number, data: typeof hourlyData[0]) => {
    setHoveredIndex(index);
    setTooltipData({
      time: data.time,
      temp: data.temp,
      description: data.description,
      pop: data.pop,
      index,
    });
  };

  const handleBarLeave = () => {
    setHoveredIndex(null);
    setTooltipData(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl backdrop-blur-xl bg-white/10 dark:bg-white/10 light:bg-white/80 border border-white/20 dark:border-white/20 light:border-gray-200 p-6"
    >
      <h3 className="text-lg font-semibold text-white dark:text-white light:text-gray-900 mb-4 flex items-center gap-2">
        <span>🕐</span> Prévisions 24h
      </h3>

      {/* Graphique en barres avec tooltips */}
      <div className="relative mb-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex items-end justify-between gap-2 h-32 px-2"
        >
          {hourlyData.map((data, index) => {
            const heightPercent = ((data.temp - minTemp) / tempRange) * 70 + 30;
            const isHovered = hoveredIndex === index;

            return (
              <motion.div
                key={index}
                variants={cardVariants}
                className="flex-1 flex flex-col items-center gap-2 group cursor-pointer h-full relative"
                onMouseEnter={() => handleBarHover(index, data)}
                onMouseLeave={handleBarLeave}
              >
                {/* Température au-dessus avec animation */}
                <motion.span
                  animate={{
                    scale: isHovered ? 1.2 : 1,
                    color: isHovered ? '#60a5fa' : undefined,
                  }}
                  className="text-xs text-white/80 dark:text-white/80 light:text-gray-700 font-medium transition-colors"
                >
                  {Math.round(data.temp)}°
                </motion.span>

                {/* Barre de température avec animation spring */}
                <div className="flex-1 w-full flex items-end justify-center relative">
                  <motion.div
                    custom={heightPercent}
                    variants={barVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{
                      scale: 1.05,
                      transition: { duration: 0.2 },
                    }}
                    className={cn(
                      'w-full max-w-8 rounded-t-lg transition-all duration-300',
                      isHovered
                        ? 'bg-linear-to-t from-blue-400 to-cyan-300 shadow-lg shadow-blue-500/30'
                        : 'bg-linear-to-t from-blue-500/50 to-cyan-400/70'
                    )}
                  />
                </div>

                {/* Indicateur de temps sous la barre */}
                <span className="text-[10px] text-white/40 dark:text-white/40 light:text-gray-400">
                  {shortTime(data.time)}
                </span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Tooltip flottant */}
        <AnimatePresence>
          {tooltipData && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.95 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className={cn(
                'absolute z-20 px-3 py-2 rounded-xl backdrop-blur-xl',
                'bg-slate-900/95 dark:bg-slate-900/95 light:bg-white/95',
                'border border-white/20 dark:border-white/20 light:border-gray-200',
                'shadow-2xl pointer-events-none',
                'min-w-35'
              )}
              style={{
                left: `${(tooltipData.index / (hourlyData.length - 1)) * 100}%`,
                transform: 'translateX(-50%)',
                bottom: '100%',
                marginBottom: '8px',
              }}
            >
              <div className="space-y-1">
                <p className="text-xs text-white/60 dark:text-white/60 light:text-gray-500 font-medium">
                  {shortTime(tooltipData.time)}
                </p>
                <p className="text-lg font-bold text-white dark:text-white light:text-gray-900">
                  {Math.round(tooltipData.temp)}°
                </p>
                <p className="text-xs text-white/80 dark:text-white/80 light:text-gray-600 capitalize">
                  {tooltipData.description}
                </p>
                {tooltipData.pop > 0.1 && (
                  <div className="flex items-center gap-1 text-xs text-blue-400 dark:text-blue-300 light:text-blue-600">
                    <Droplets size={12} />
                    <span>{Math.round(tooltipData.pop * 100)}%</span>
                  </div>
                )}
              </div>
              {/* Flèche du tooltip */}
              <div
                className={cn(
                  'absolute left-1/2 -translate-x-1/2 -bottom-1',
                  'w-2 h-2 rotate-45',
                  'bg-slate-900/95 dark:bg-slate-900/95 light:bg-white/95',
                  'border-r border-b border-white/20 dark:border-white/20 light:border-gray-200'
                )}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Liste horizontale détaillée */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20 dark:scrollbar-thumb-white/20 light:scrollbar-thumb-gray-300 scrollbar-track-transparent"
      >
        {hourlyData.map((data, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover={{
              scale: 1.05,
              y: -2,
              transition: { duration: 0.2 },
            }}
            className={cn(
              'shrink-0 flex flex-col items-center gap-2 p-3 rounded-xl min-w-17.5',
              'bg-white/5 dark:bg-white/5 light:bg-gray-100/80',
              'hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-gray-200/80',
              'transition-colors cursor-pointer',
              hoveredIndex === index && 'ring-2 ring-blue-400/50'
            )}
            onMouseEnter={() => handleBarHover(index, data)}
            onMouseLeave={handleBarLeave}
          >
            <span className="text-xs text-white/60 dark:text-white/60 light:text-gray-500 font-medium">
              {shortTime(data.time)}
            </span>

            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
            >
              <WeatherIcon icon={data.icon} size="sm" />
            </motion.div>

            <span className="text-sm font-semibold text-white dark:text-white light:text-gray-900">
              {Math.round(data.temp)}°
            </span>

            {/* Probabilité de pluie */}
            {data.pop > 0.2 && (
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-xs text-blue-400 dark:text-blue-300 light:text-blue-600 flex items-center gap-0.5"
              >
                <Droplets size={10} />
                {Math.round(data.pop * 100)}%
              </motion.span>
            )}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
