'use client';

import { useState, useCallback, useRef } from 'react';
import { Coordinates } from '@/types/weather';
import { analytics } from '@/lib/analytics/analyticsService';

interface GeolocationState {
  coords: Coordinates | null;
  isLoading: boolean;
  error: string | null;
  isSupported: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    coords: null,
    isLoading: false,
    error: null,
    isSupported: typeof navigator !== 'undefined' && 'geolocation' in navigator,
  });
  
  const isRequestingRef = useRef(false);
  
  const getLocation = useCallback(async (): Promise<void> => {
    if (!state.isSupported) {
      const message = 'La géolocalisation n\'est pas supportée';
      setState(prev => ({ ...prev, error: message }));
      analytics.error.geolocation(message);
      return;
    }
    
    if (isRequestingRef.current) return;
    isRequestingRef.current = true;
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    analytics.track('geolocation_request');
    const startTime = performance.now();
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const duration = performance.now() - startTime;
        setState({
          coords: {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          },
          isLoading: false,
          error: null,
          isSupported: true,
        });
        analytics.performance.end('geolocation', 'geolocation');
        analytics.track('geolocation_success', {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          accuracy: position.coords.accuracy,
          duration,
        });
        isRequestingRef.current = false;
      },
      (error) => {
        const duration = performance.now() - startTime;
        let errorMessage = 'Erreur de géolocalisation';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permission de géolocalisation refusée';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Position non disponible';
            break;
          case error.TIMEOUT:
            errorMessage = 'Délai de géolocalisation dépassé';
            break;
        }
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
        analytics.error.geolocation(errorMessage);
        analytics.track('geolocation_error', {
          error: errorMessage,
          code: error.code,
          duration,
        });
        isRequestingRef.current = false;
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 600000 }
    );
  }, [state.isSupported]);
  
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);
  
  return {
    ...state,
    getLocation,
    clearError,
  };
}
