'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  AnalyticsEvent, 
  AnalyticsEventType, 
  AnalyticsState, 
  PerformanceMetrics,
  ErrorMetrics,
  UsageMetrics,
  TimeRange,
  AggregatedMetrics 
} from '@/types/analytics';

const MAX_EVENTS = 1000;
const MAX_METRICS_SAMPLES = 100;

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

const initialPerformance: PerformanceMetrics = {
  apiResponseTime: [],
  weatherLoadTime: [],
  forecastLoadTime: [],
  geolocationTime: [],
};

const initialErrors: ErrorMetrics = {
  weatherErrors: 0,
  geolocationErrors: 0,
  apiErrors: 0,
  networkErrors: 0,
};

// Usage metrics with Set serialization helper
interface SerializableUsageMetrics {
  totalSearches: number;
  uniqueCities: string[];
  totalFavorites: number;
  radarOpens: number;
  alertsViewed: number;
  offlineEvents: number;
}

const initialSerializableUsage: SerializableUsageMetrics = {
  totalSearches: 0,
  uniqueCities: [],
  totalFavorites: 0,
  radarOpens: 0,
  alertsViewed: 0,
  offlineEvents: 0,
};

interface AnalyticsStore extends AnalyticsState {
  // Event tracking
  trackEvent: (type: AnalyticsEventType, data?: Record<string, unknown>, duration?: number, error?: string) => void;
  
  // Performance tracking
  trackApiResponseTime: (duration: number) => void;
  trackWeatherLoadTime: (duration: number) => void;
  trackForecastLoadTime: (duration: number) => void;
  trackGeolocationTime: (duration: number) => void;
  
  // Error tracking
  trackError: (type: 'weather' | 'geolocation' | 'api' | 'network', message: string) => void;
  
  // Usage tracking
  trackSearch: (cityName: string) => void;
  trackFavorite: (action: 'add' | 'remove') => void;
  trackRadar: () => void;
  trackAlert: () => void;
  trackOffline: () => void;
  
  // Queries
  getEvents: (range?: TimeRange) => AnalyticsEvent[];
  getEventsByType: (type: AnalyticsEventType, range?: TimeRange) => AnalyticsEvent[];
  getAggregatedMetrics: (range?: TimeRange) => AggregatedMetrics;
  getUniqueCitiesCount: () => number;
  
  // Management
  clearOldEvents: (days: number) => void;
  exportData: () => string;
  reset: () => void;
}

export const useAnalyticsStore = create<AnalyticsStore>()(
  persist(
    (set, get) => ({
      events: [],
      performance: initialPerformance,
      errors: initialErrors,
      usage: {
        ...initialSerializableUsage,
        uniqueCities: new Set(initialSerializableUsage.uniqueCities),
      } as unknown as UsageMetrics,
      sessionStart: Date.now(),
      lastActivity: Date.now(),

      trackEvent: (type, data, duration, error) => {
        const event: AnalyticsEvent = {
          id: generateId(),
          type,
          timestamp: Date.now(),
          data,
          duration,
          error,
        };

        set((state) => {
          const newEvents = [event, ...state.events].slice(0, MAX_EVENTS);
          return { 
            events: newEvents, 
            lastActivity: Date.now() 
          };
        });
      },

      trackApiResponseTime: (duration) => {
        set((state) => ({
          performance: {
            ...state.performance,
            apiResponseTime: [duration, ...state.performance.apiResponseTime].slice(0, MAX_METRICS_SAMPLES),
          },
          lastActivity: Date.now(),
        }));
      },

      trackWeatherLoadTime: (duration) => {
        set((state) => ({
          performance: {
            ...state.performance,
            weatherLoadTime: [duration, ...state.performance.weatherLoadTime].slice(0, MAX_METRICS_SAMPLES),
          },
          lastActivity: Date.now(),
        }));
      },

      trackForecastLoadTime: (duration) => {
        set((state) => ({
          performance: {
            ...state.performance,
            forecastLoadTime: [duration, ...state.performance.forecastLoadTime].slice(0, MAX_METRICS_SAMPLES),
          },
          lastActivity: Date.now(),
        }));
      },

      trackGeolocationTime: (duration) => {
        set((state) => ({
          performance: {
            ...state.performance,
            geolocationTime: [duration, ...state.performance.geolocationTime].slice(0, MAX_METRICS_SAMPLES),
          },
          lastActivity: Date.now(),
        }));
      },

      trackError: (type, message) => {
        set((state) => {
          const errorKey = `${type}Errors` as keyof ErrorMetrics;
          const currentCount = (state.errors[errorKey] as number) || 0;
          return {
            errors: {
              ...state.errors,
              [errorKey]: currentCount + 1,
              lastError: {
                type,
                message,
                timestamp: Date.now(),
              },
            },
            lastActivity: Date.now(),
          };
        });
        
        // Also track as event
        get().trackEvent('weather_error', { errorType: type, message });
      },

      trackSearch: (cityName) => {
        set((state) => {
          const newUniqueCities = new Set(state.usage.uniqueCities);
          newUniqueCities.add(cityName);
          return {
            usage: {
              ...state.usage,
              totalSearches: state.usage.totalSearches + 1,
              uniqueCities: newUniqueCities,
            },
            lastActivity: Date.now(),
          };
        });
        get().trackEvent('city_search', { cityName });
      },

      trackFavorite: (action) => {
        set((state) => ({
          usage: {
            ...state.usage,
            totalFavorites: action === 'add' 
              ? state.usage.totalFavorites + 1 
              : Math.max(0, state.usage.totalFavorites - 1),
          },
          lastActivity: Date.now(),
        }));
        get().trackEvent(action === 'add' ? 'favorite_add' : 'favorite_remove');
      },

      trackRadar: () => {
        set((state) => ({
          usage: {
            ...state.usage,
            radarOpens: state.usage.radarOpens + 1,
          },
          lastActivity: Date.now(),
        }));
        get().trackEvent('radar_open');
      },

      trackAlert: () => {
        set((state) => ({
          usage: {
            ...state.usage,
            alertsViewed: state.usage.alertsViewed + 1,
          },
          lastActivity: Date.now(),
        }));
        get().trackEvent('alert_view');
      },

      trackOffline: () => {
        set((state) => ({
          usage: {
            ...state.usage,
            offlineEvents: state.usage.offlineEvents + 1,
          },
          lastActivity: Date.now(),
        }));
        get().trackEvent('offline_mode');
      },

      getEvents: (range) => {
        const { events } = get();
        if (!range) return events;
        return events.filter(
          (e) => e.timestamp >= range.start && e.timestamp <= range.end
        );
      },

      getEventsByType: (type, range) => {
        const events = get().getEvents(range);
        return events.filter((e) => e.type === type);
      },

      getAggregatedMetrics: (range) => {
        const state = get();
        const events = state.getEvents(range);
        const now = Date.now();
        
        const eventsByType = events.reduce((acc, event) => {
          acc[event.type] = (acc[event.type] || 0) + 1;
          return acc;
        }, {} as Record<AnalyticsEventType, number>);

        const avgResponseTime = state.performance.apiResponseTime.length > 0
          ? state.performance.apiResponseTime.reduce((a, b) => a + b, 0) / state.performance.apiResponseTime.length
          : 0;

        const totalErrors = state.errors.weatherErrors + state.errors.geolocationErrors + 
                           state.errors.apiErrors + state.errors.networkErrors;
        const totalEvents = events.length || 1;

        return {
          totalEvents: events.length,
          eventsByType,
          averageApiResponseTime: Math.round(avgResponseTime),
          errorRate: Math.round((totalErrors / totalEvents) * 1000) / 10,
          uniqueCitiesCount: state.usage.uniqueCities.size,
          sessionDuration: now - state.sessionStart,
        };
      },

      getUniqueCitiesCount: () => {
        return get().usage.uniqueCities.size;
      },

      clearOldEvents: (days) => {
        const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
        set((state) => ({
          events: state.events.filter((e) => e.timestamp > cutoff),
        }));
      },

      exportData: () => {
        const state = get();
        const exportable = {
          events: state.events,
          performance: state.performance,
          errors: state.errors,
          usage: {
            ...state.usage,
            uniqueCities: Array.from(state.usage.uniqueCities),
          },
          sessionStart: state.sessionStart,
          lastActivity: state.lastActivity,
          exportedAt: Date.now(),
        };
        return JSON.stringify(exportable, null, 2);
      },

      reset: () => {
        set({
          events: [],
          performance: initialPerformance,
          errors: initialErrors,
          usage: {
            ...initialSerializableUsage,
            uniqueCities: new Set(),
          } as unknown as UsageMetrics,
          sessionStart: Date.now(),
          lastActivity: Date.now(),
        });
      },
    }),
    {
      name: 'skycast-analytics',
      partialize: (state) => ({
        events: state.events,
        performance: state.performance,
        errors: state.errors,
        usage: {
          totalSearches: state.usage.totalSearches,
          uniqueCities: Array.from(state.usage.uniqueCities),
          totalFavorites: state.usage.totalFavorites,
          radarOpens: state.usage.radarOpens,
          alertsViewed: state.usage.alertsViewed,
          offlineEvents: state.usage.offlineEvents,
        },
        sessionStart: state.sessionStart,
        lastActivity: state.lastActivity,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Restore Set from array
          state.usage.uniqueCities = new Set(state.usage.uniqueCities as unknown as string[]);
        }
      },
    }
  )
);
