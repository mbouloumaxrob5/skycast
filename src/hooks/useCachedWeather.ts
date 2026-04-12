'use client';

import { useCallback } from 'react';
import { CurrentWeather, ForecastData, City } from '@/types/weather';

interface CachedWeather {
  current: CurrentWeather;
  forecast: ForecastData;
  city: City;
  cachedAt: number;
}

const CACHE_KEY = 'skycast-weather-cache';
const CACHE_MAX_AGE = 24 * 60 * 60 * 1000; // 24 heures

export function useCachedWeather() {
  const saveToCache = useCallback((data: CachedWeather) => {
    try {
      const cacheData = {
        ...data,
        cachedAt: Date.now(),
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch {
      // Ignorer les erreurs de localStorage (ex: quota exceeded)
    }
  }, []);

  const getFromCache = useCallback((): CachedWeather | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const parsed = JSON.parse(cached) as CachedWeather;
      const age = Date.now() - (parsed.cachedAt || 0);

      // Vérifier si le cache n'est pas trop vieux
      if (age > CACHE_MAX_AGE) {
        localStorage.removeItem(CACHE_KEY);
        return null;
      }

      return parsed;
    } catch {
      return null;
    }
  }, []);

  const clearCache = useCallback(() => {
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch {
      // Ignorer
    }
  }, []);

  const isCacheValid = useCallback((): boolean => {
    const cached = getFromCache();
    if (!cached) return false;

    const age = Date.now() - cached.cachedAt;
    return age < CACHE_MAX_AGE;
  }, [getFromCache]);

  return {
    saveToCache,
    getFromCache,
    clearCache,
    isCacheValid,
  };
}
