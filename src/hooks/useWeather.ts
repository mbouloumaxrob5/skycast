'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { weatherService, WeatherAPIError } from '@/lib/api/weatherService';
import { CurrentWeather, ForecastData } from '@/types/weather';
import { analytics } from '@/lib/analytics/analyticsService';

const WEATHER_STALE_TIME = 5 * 60 * 1000;

export function useWeather(lat: number | null, lon: number | null) {
  const queryClient = useQueryClient();
  
  const currentQuery = useQuery<CurrentWeather, WeatherAPIError>({
    queryKey: ['weather', 'current', lat, lon],
    queryFn: async () => {
      if (lat === null || lon === null) {
        throw new Error('Coordonnées non disponibles');
      }
      
      const startTime = performance.now();
      try {
        const result = await weatherService.getCurrent(lat, lon);
        const duration = performance.now() - startTime;
        analytics.performance.end('weather-fetch', 'weather');
        analytics.track('weather_fetch', { 
          lat, 
          lon, 
          city: result.city,
          success: true,
          duration 
        });
        return result;
      } catch (error) {
        const duration = performance.now() - startTime;
        analytics.error.weather((error as Error).message);
        analytics.track('weather_error', { 
          lat, 
          lon, 
          error: (error as Error).message,
          duration 
        });
        throw error;
      }
    },
    enabled: lat !== null && lon !== null,
    staleTime: WEATHER_STALE_TIME,
    retry: (failureCount, error) => {
      if (error instanceof WeatherAPIError && error.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
  });
  
  const forecastQuery = useQuery<ForecastData, WeatherAPIError>({
    queryKey: ['weather', 'forecast', lat, lon],
    queryFn: async () => {
      if (lat === null || lon === null) {
        throw new Error('Coordonnées non disponibles');
      }
      
      const startTime = performance.now();
      try {
        const result = await weatherService.getForecast(lat, lon);
        const duration = performance.now() - startTime;
        analytics.performance.end('forecast-fetch', 'forecast');
        analytics.track('forecast_fetch', { 
          lat, 
          lon, 
          city: result.city,
          success: true,
          duration 
        });
        return result;
      } catch (error) {
        const duration = performance.now() - startTime;
        analytics.track('weather_error', { 
          lat, 
          lon, 
          type: 'forecast',
          error: (error as Error).message,
          duration 
        });
        throw error;
      }
    },
    enabled: lat !== null && lon !== null,
    staleTime: WEATHER_STALE_TIME,
  });
  
  const refetch = () => {
    queryClient.invalidateQueries({ queryKey: ['weather', 'current', lat, lon] });
    queryClient.invalidateQueries({ queryKey: ['weather', 'forecast', lat, lon] });
  };
  
  return {
    current: currentQuery.data,
    forecast: forecastQuery.data,
    isLoading: currentQuery.isLoading || forecastQuery.isLoading,
    isError: currentQuery.isError || forecastQuery.isError,
    error: currentQuery.error || forecastQuery.error,
    refetch,
  };
}
