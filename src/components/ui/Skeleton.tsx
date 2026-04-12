'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface SkeletonProps {
  className?: string;
  variant?: 'card' | 'text' | 'circle' | 'bar';
  width?: string | number;
  height?: string | number;
  count?: number;
}

export function Skeleton({
  className,
  variant = 'text',
  width,
  height,
  count = 1,
}: SkeletonProps) {
  const baseClasses = cn(
    'rounded-lg',
    'bg-white/10 dark:bg-white/10 light:bg-gray-200',
    'overflow-hidden',
    className
  );

  const shimmerVariants = {
    initial: { x: '-100%' },
    animate: {
      x: '100%',
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: 'linear' as const,
      },
    },
  };

  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return (
          <div
            className={cn(baseClasses, 'rounded-2xl')}
            style={{ width, height }}
          >
            <motion.div
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              className="h-full w-1/2 bg-linear-to-r from-transparent via-white/10 to-transparent"
            />
          </div>
        );

      case 'circle':
        return (
          <div
            className={cn(baseClasses, 'rounded-full')}
            style={{ width: width ?? 40, height: height ?? 40 }}
          >
            <motion.div
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              className="h-full w-full bg-linear-to-r from-transparent via-white/20 to-transparent rounded-full"
            />
          </div>
        );

      case 'bar':
        return (
          <div
            className={cn(baseClasses, 'rounded-full')}
            style={{ width: width ?? '100%', height: height ?? 8 }}
          >
            <motion.div
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              className="h-full w-1/3 bg-linear-to-r from-transparent via-white/20 to-transparent"
            />
          </div>
        );

      default:
        return (
          <div
            className={baseClasses}
            style={{ width: width ?? '100%', height: height ?? 16 }}
          >
            <motion.div
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              className="h-full w-1/2 bg-linear-to-r from-transparent via-white/20 to-transparent"
            />
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>{renderSkeleton()}</div>
      ))}
    </div>
  );
}

// Composant spécifique pour le skeleton du HeroCard
export function HeroCardSkeleton() {
  return (
    <div className="rounded-2xl backdrop-blur-xl bg-white/10 dark:bg-white/10 light:bg-white/80 border border-white/20 dark:border-white/20 light:border-gray-200 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex flex-col gap-3 flex-1">
          <Skeleton variant="text" width="60%" height={28} />
          <Skeleton variant="text" width="40%" height={16} />
          <Skeleton variant="text" width="50%" height={20} />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton variant="circle" width={64} height={64} />
          <div className="flex flex-col gap-2">
            <Skeleton variant="text" width={80} height={48} />
            <Skeleton variant="text" width={60} height={16} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant spécifique pour le skeleton du DetailGrid
export function DetailGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl backdrop-blur-xl bg-white/10 dark:bg-white/10 light:bg-white/80 border border-white/20 dark:border-white/20 light:border-gray-200 p-5 flex flex-col items-center gap-3"
        >
          <Skeleton variant="circle" width={24} height={24} />
          <Skeleton variant="text" width={50} height={28} />
          <Skeleton variant="text" width={70} height={12} />
        </div>
      ))}
    </div>
  );
}

// Composant spécifique pour le skeleton du ForecastList
export function ForecastListSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton variant="text" width={140} height={24} />
      <div className="flex gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="shrink-0 w-28 rounded-2xl backdrop-blur-xl bg-white/10 dark:bg-white/10 light:bg-white/80 border border-white/20 dark:border-white/20 light:border-gray-200 p-4 flex flex-col items-center gap-2"
          >
            <Skeleton variant="text" width={50} height={16} />
            <Skeleton variant="circle" width={32} height={32} />
            <Skeleton variant="text" width={40} height={24} />
            <Skeleton variant="text" width={30} height={14} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Composant pour le skeleton complet de la page météo
export function WeatherPageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <HeroCardSkeleton />
      <DetailGridSkeleton />
      <ForecastListSkeleton />
    </div>
  );
}
