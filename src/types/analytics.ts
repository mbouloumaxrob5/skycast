export type AnalyticsEventType = 
  | 'page_view'
  | 'city_search'
  | 'city_select'
  | 'geolocation_request'
  | 'geolocation_success'
  | 'geolocation_error'
  | 'weather_fetch'
  | 'weather_error'
  | 'forecast_fetch'
  | 'radar_open'
  | 'radar_close'
  | 'favorite_add'
  | 'favorite_remove'
  | 'offline_mode'
  | 'online_mode'
  | 'alert_view'
  | 'settings_change'
  | 'theme_toggle';

export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  timestamp: number;
  data?: Record<string, unknown>;
  duration?: number;
  error?: string;
}

export interface PerformanceMetrics {
  apiResponseTime: number[];
  weatherLoadTime: number[];
  forecastLoadTime: number[];
  geolocationTime: number[];
}

export interface ErrorMetrics {
  weatherErrors: number;
  geolocationErrors: number;
  apiErrors: number;
  networkErrors: number;
  lastError?: {
    type: string;
    message: string;
    timestamp: number;
  };
}

export interface UsageMetrics {
  totalSearches: number;
  uniqueCities: Set<string>;
  totalFavorites: number;
  radarOpens: number;
  alertsViewed: number;
  offlineEvents: number;
}

export interface AnalyticsState {
  events: AnalyticsEvent[];
  performance: PerformanceMetrics;
  errors: ErrorMetrics;
  usage: UsageMetrics;
  sessionStart: number;
  lastActivity: number;
}

export interface TimeRange {
  start: number;
  end: number;
}

export interface AggregatedMetrics {
  totalEvents: number;
  eventsByType: Record<AnalyticsEventType, number>;
  averageApiResponseTime: number;
  errorRate: number;
  uniqueCitiesCount: number;
  sessionDuration: number;
}
