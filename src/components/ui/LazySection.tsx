'use client';

import { Suspense, lazy, ComponentType, useMemo } from 'react';
import { HeroCardSkeleton, ForecastListSkeleton } from './Skeleton';

interface LazySectionProps {
  component: () => Promise<{ default: ComponentType<unknown> }>;
  fallback?: 'card' | 'forecast' | 'default';
  props?: Record<string, unknown>;
}

export function LazySection({ component, fallback = 'default', props = {} }: LazySectionProps) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const LazyComponent = useMemo(() => lazy(component), []);

  const fallbackComponent = {
    card: <HeroCardSkeleton />,
    forecast: <ForecastListSkeleton />,
    default: (
      <div className="animate-pulse bg-white/5 rounded-xl h-64 w-full" />
    ),
  }[fallback];

  return (
    <Suspense fallback={fallbackComponent}>
      <LazyComponent {...props} />
    </Suspense>
  );
}
