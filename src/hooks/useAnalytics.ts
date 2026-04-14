'use client';

import { useCallback, useRef, useEffect, useMemo } from 'react';
import { useAnalyticsStore } from '@/store/analyticsStore';
import { analytics } from '@/lib/analytics/analyticsService';
import { AnalyticsEventType, TimeRange, AggregatedMetrics } from '@/types/analytics';

// Hook for tracking component lifecycle
export function usePageView(pageName: string) {
  useEffect(() => {
    analytics.track('page_view', { page: pageName });
  }, [pageName]);
}

// Hook for tracking async operations with automatic timing
export function useTrackOperation() {
  return useCallback(async <T,>(
    operation: () => Promise<T>,
    eventType: AnalyticsEventType,
    data?: Record<string, unknown>,
    options?: {
      trackSuccess?: boolean;
      trackError?: boolean;
    }
  ): Promise<T> => {
    const startTime = performance.now();
    
    try {
      const result = await operation();
      const duration = performance.now() - startTime;
      
      if (options?.trackSuccess !== false) {
        const store = useAnalyticsStore.getState();
        store.trackEvent(eventType, { ...data, success: true }, duration);
      }
      
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      
      if (options?.trackError !== false) {
        const store = useAnalyticsStore.getState();
        store.trackEvent(
          eventType, 
          { ...data, success: false, error: (error as Error).message }, 
          duration,
          (error as Error).message
        );
      }
      
      throw error;
    }
  }, []);
}

// Hook for tracking user interactions
export function useTrackInteraction() {
  return useCallback((
    type: AnalyticsEventType,
    data?: Record<string, unknown>
  ) => {
    analytics.track(type, data);
  }, []);
}

// Hook for tracking form/field interactions
export function useTrackField(fieldName: string) {
  const track = useTrackInteraction();
  
  return useCallback((value: string, eventType: 'focus' | 'change' | 'blur' = 'change') => {
    const typeMap: Record<string, AnalyticsEventType> = {
      focus: 'city_search',
      change: 'city_search',
      blur: 'city_search',
    };
    
    track(typeMap[eventType], { 
      field: fieldName, 
      value: value.substring(0, 50),
      event: eventType 
    });
  }, [track, fieldName]);
}

// Hook for tracking loading states
export function useTrackLoading(resourceName: string) {
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    startTimeRef.current = performance.now();
    
    return () => {
      if (startTimeRef.current) {
        const duration = performance.now() - startTimeRef.current;
        const store = useAnalyticsStore.getState();
        
        // Track based on resource type
        if (resourceName.includes('weather')) {
          store.trackWeatherLoadTime(duration);
        } else if (resourceName.includes('forecast')) {
          store.trackForecastLoadTime(duration);
        } else if (resourceName.includes('geolocation')) {
          store.trackGeolocationTime(duration);
        }
        
        startTimeRef.current = null;
      }
    };
  }, [resourceName]);

  return {
    markComplete: () => {
      if (startTimeRef.current) {
        const duration = performance.now() - startTimeRef.current;
        const store = useAnalyticsStore.getState();
        
        if (resourceName.includes('weather')) {
          store.trackWeatherLoadTime(duration);
        } else if (resourceName.includes('forecast')) {
          store.trackForecastLoadTime(duration);
        } else if (resourceName.includes('geolocation')) {
          store.trackGeolocationTime(duration);
        }
        
        startTimeRef.current = null;
      }
    },
  };
}

// Hook for accessing analytics metrics
export function useAnalyticsMetrics(range?: TimeRange): AggregatedMetrics {
  const store = useAnalyticsStore();
  
  // Utiliser useMemo pour éviter de recalculer à chaque rendu
  return useMemo(() => {
    return store.getAggregatedMetrics(range);
  }, [store, range]);
}

// Hook for tracking offline/online status
export function useTrackConnectivity() {
  // Safe SSR: navigator n'existe pas côté serveur
  const lastStateRef = useRef<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => {
      if (!lastStateRef.current) {
        analytics.usage.online();
        lastStateRef.current = true;
      }
    };

    const handleOffline = () => {
      if (lastStateRef.current) {
        analytics.usage.offline();
        lastStateRef.current = false;
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []); // dépendances vides car on utilise analytics directement, pas besoin de store
}

// Re-export analytics service for convenience
export { analytics };
export { useAnalyticsStore };
