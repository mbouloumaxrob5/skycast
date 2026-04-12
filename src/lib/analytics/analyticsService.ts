import { useAnalyticsStore } from '@/store/analyticsStore';
import { AnalyticsEventType } from '@/types/analytics';

// Timing helpers for performance tracking
class PerformanceTimer {
  private timers = new Map<string, number>();

  start(label: string): void {
    this.timers.set(label, performance.now());
  }

  end(label: string): number | null {
    const start = this.timers.get(label);
    if (!start) return null;
    this.timers.delete(label);
    return performance.now() - start;
  }

  clear(label: string): void {
    this.timers.delete(label);
  }
}

const globalTimer = new PerformanceTimer();

// Public API for analytics
export const analytics = {
  // Core event tracking
  track: (type: AnalyticsEventType, data?: Record<string, unknown>) => {
    const store = useAnalyticsStore.getState();
    store.trackEvent(type, data);
  },

  // Performance tracking
  performance: {
    start: (label: string) => globalTimer.start(label),
    
    end: (label: string, type: 'api' | 'weather' | 'forecast' | 'geolocation') => {
      const duration = globalTimer.end(label);
      if (duration === null) return;
      
      const store = useAnalyticsStore.getState();
      switch (type) {
        case 'api':
          store.trackApiResponseTime(duration);
          break;
        case 'weather':
          store.trackWeatherLoadTime(duration);
          break;
        case 'forecast':
          store.trackForecastLoadTime(duration);
          break;
        case 'geolocation':
          store.trackGeolocationTime(duration);
          break;
      }
      return duration;
    },

    clear: (label: string) => globalTimer.clear(label),

    // Wrap an async function with timing
    async trackAsync<T>(
      fn: () => Promise<T>, 
      label: string, 
      type: 'api' | 'weather' | 'forecast' | 'geolocation',
      options?: { 
        onSuccess?: (duration: number, result: T) => void;
        onError?: (duration: number, error: Error) => void;
      }
    ): Promise<T> {
      globalTimer.start(label);
      const startTime = performance.now();
      
      try {
        const result = await fn();
        const duration = performance.now() - startTime;
        
        const store = useAnalyticsStore.getState();
        switch (type) {
          case 'api':
            store.trackApiResponseTime(duration);
            break;
          case 'weather':
            store.trackWeatherLoadTime(duration);
            break;
          case 'forecast':
            store.trackForecastLoadTime(duration);
            break;
          case 'geolocation':
            store.trackGeolocationTime(duration);
            break;
        }
        
        options?.onSuccess?.(duration, result);
        return result;
      } catch (error) {
        const duration = performance.now() - startTime;
        options?.onError?.(duration, error as Error);
        throw error;
      } finally {
        globalTimer.clear(label);
      }
    },
  },

  // Error tracking
  error: {
    weather: (message: string) => {
      const store = useAnalyticsStore.getState();
      store.trackError('weather', message);
    },
    geolocation: (message: string) => {
      const store = useAnalyticsStore.getState();
      store.trackError('geolocation', message);
    },
    api: (message: string) => {
      const store = useAnalyticsStore.getState();
      store.trackError('api', message);
    },
    network: (message: string) => {
      const store = useAnalyticsStore.getState();
      store.trackError('network', message);
    },
  },

  // Usage tracking
  usage: {
    search: (cityName: string) => {
      const store = useAnalyticsStore.getState();
      store.trackSearch(cityName);
    },
    favorite: {
      add: () => {
        const store = useAnalyticsStore.getState();
        store.trackFavorite('add');
      },
      remove: () => {
        const store = useAnalyticsStore.getState();
        store.trackFavorite('remove');
      },
    },
    radar: {
      open: () => {
        const store = useAnalyticsStore.getState();
        store.trackRadar();
      },
      close: () => {
        const store = useAnalyticsStore.getState();
        store.trackEvent('radar_close');
      },
    },
    alert: {
      view: () => {
        const store = useAnalyticsStore.getState();
        store.trackAlert();
      },
    },
    offline: () => {
      const store = useAnalyticsStore.getState();
      store.trackOffline();
    },
    online: () => {
      const store = useAnalyticsStore.getState();
      store.trackEvent('online_mode');
    },
  },

  // Session tracking
  session: {
    getDuration: () => {
      const store = useAnalyticsStore.getState();
      return Date.now() - store.sessionStart;
    },
    getLastActivity: () => {
      const store = useAnalyticsStore.getState();
      return store.lastActivity;
    },
  },

  // Data export
  export: () => {
    const store = useAnalyticsStore.getState();
    return store.exportData();
  },

  // Reset
  reset: () => {
    const store = useAnalyticsStore.getState();
    store.reset();
  },

  // Get metrics
  getMetrics: () => {
    const store = useAnalyticsStore.getState();
    return store.getAggregatedMetrics();
  },
};

// Hook for component-level tracking
export function useAnalytics() {
  return analytics;
}
