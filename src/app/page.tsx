'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { DynamicBackground } from '@/components/layout/DynamicBackground';
import { HeroCard } from '@/components/weather/HeroCard';
import { DetailGrid } from '@/components/weather/DetailGrid';
import { ForecastList } from '@/components/weather/ForecastList';
import { HourlyForecast } from '@/components/weather/HourlyForecast';
import { FavoritesList } from '@/components/weather/FavoritesList';
import { RadarMap } from '@/components/weather/RadarMap';
import { WeatherPageSkeleton } from '@/components/ui/Skeleton';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useWeather } from '@/hooks/useWeather';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useWeatherStore } from '@/store/weatherStore';
import { useThemeStore } from '@/store/themeStore';
import { useOffline } from '@/hooks/useOffline';
import { useCachedWeather } from '@/hooks/useCachedWeather';
import { useWeatherAlerts } from '@/hooks/useWeatherAlerts';
import { OfflineIndicator } from '@/components/ui/OfflineIndicator';
import { WeatherAlerts } from '@/components/ui/WeatherAlerts';
import { AlertBadge } from '@/components/layout/AlertBadge';
import { City, FavoriteCity, CurrentWeather, ForecastData } from '@/types/weather';

export default function Home() {
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [showRadar, setShowRadar] = useState(false);
  
  // Initialiser le thème au chargement
  const { isDark } = useThemeStore();
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.classList.toggle('light', !isDark);
  }, [isDark]);
  
  const { 
    selectedCity, 
    favorites, 
    setSelectedCity, 
    addToFavorites, 
    removeFromFavorites,
    setLastSearched 
  } = useWeatherStore();
  
  const { 
    coords, 
    isLoading: isGeolocating, 
    error: geolocationError, 
    getLocation, 
    clearError 
  } = useGeolocation();
  
  const { 
    current, 
    forecast, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useWeather(
    selectedCoords?.lat ?? null, 
    selectedCoords?.lon ?? null
  );

  // Mode offline
  const { isOffline } = useOffline();
  const { saveToCache, getFromCache } = useCachedWeather();
  const [cachedData, setCachedData] = useState<{ current: CurrentWeather; forecast: ForecastData } | null>(null);
  const [hasCachedData, setHasCachedData] = useState(false);

  // Géolocalisation au chargement
  useEffect(() => {
    const shouldSetCoords = coords && !selectedCoords && !selectedCity;
    if (shouldSetCoords) {
      // Utiliser requestAnimationFrame pour éviter les renders en cascade
      requestAnimationFrame(() => {
        setSelectedCoords(coords);
      });
    }
  }, [coords, selectedCoords, selectedCity]);

  // Sauvegarder les données en cache quand on reçoit de nouvelles données
  useEffect(() => {
    if (current && forecast && selectedCity) {
      saveToCache({
        current,
        forecast,
        city: selectedCity,
        cachedAt: Date.now(),
      });
    }
  }, [current, forecast, selectedCity, saveToCache]);

  // Charger les données en cache quand on passe en mode offline
  useEffect(() => {
    if (isOffline) {
      const cached = getFromCache();
      if (cached) {
        requestAnimationFrame(() => {
          setCachedData({ current: cached.current, forecast: cached.forecast });
          setHasCachedData(true);
        });
      }
    }
  }, [isOffline, getFromCache]);

  // Déterminer quelles données afficher (fraîches ou cache)
  const displayCurrent = isOffline && cachedData?.current ? cachedData.current : current;
  const displayForecast = isOffline && cachedData?.forecast ? cachedData.forecast : forecast;
  const isActuallyLoading = isLoading && !isOffline;
  const showOfflineData = isOffline && hasCachedData;

  const handleCitySelect = useCallback((city: City) => {
    setSelectedCity(city);
    setSelectedCoords({ lat: city.lat, lon: city.lon });
    setLastSearched(city);
  }, [setSelectedCity, setLastSearched]);

  const handleGeolocate = useCallback(() => {
    clearError();
    getLocation();
  }, [clearError, getLocation]);

  const handleFavoriteSelect = useCallback((city: FavoriteCity) => {
    setSelectedCity(city);
    setSelectedCoords({ lat: city.lat, lon: city.lon });
  }, [setSelectedCity]);

  const handleAddToFavorites = useCallback(() => {
    if (displayCurrent) {
      addToFavorites({
        name: displayCurrent.city,
        country: displayCurrent.country,
        lat: selectedCoords?.lat ?? 0,
        lon: selectedCoords?.lon ?? 0,
      });
    }
  }, [displayCurrent, selectedCoords, addToFavorites]);

  const showLoading = isActuallyLoading || isGeolocating;
  const showError = isError && !isOffline; // Pas d'erreur en mode offline
  const errorMessage = error?.message || geolocationError || 'Une erreur est survenue';

  // Alertes météo
  const alerts = useWeatherAlerts(displayCurrent ?? null);
  const [showAlertBadge, setShowAlertBadge] = useState(true);

  return (
    <DynamicBackground weather={displayCurrent ?? null}>
      <div className="min-h-screen flex flex-col">
        <OfflineIndicator 
          isOffline={isOffline} 
          onRefresh={refetch}
          hasCachedData={showOfflineData}
        />
        <WeatherAlerts alerts={alerts} />
        <Header
          onCitySelect={handleCitySelect}
          onGeolocate={handleGeolocate}
          isGeolocating={isGeolocating}
          selectedCity={selectedCity}
          alertBadge={showAlertBadge && alerts.length > 0 ? (
            <AlertBadge 
              count={alerts.length} 
              onClick={() => setShowAlertBadge(false)}
            />
          ) : null}
        />

        <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 space-y-6">
          <AnimatePresence mode="wait">
            {showLoading && !displayCurrent && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center py-20"
              >
                <WeatherPageSkeleton />
              </motion.div>
            )}

            {showError && !displayCurrent && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <ErrorMessage 
                  message={errorMessage} 
                  onRetry={refetch}
                />
              </motion.div>
            )}

            {displayCurrent && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <HeroCard weather={displayCurrent} />
                
                {/* Bouton Radar */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowRadar(true)}
                  className="w-full py-3 rounded-xl bg-linear-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-white hover:from-blue-500/30 hover:to-cyan-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Voir le radar des précipitations
                </motion.button>
                
                <DetailGrid weather={displayCurrent} />
                
                {displayForecast?.hourly && (
                  <HourlyForecast forecast={displayForecast.hourly} />
                )}
                
                {displayForecast && <ForecastList forecast={displayForecast} />}
                
                <FavoritesList
                  favorites={favorites}
                  onSelect={handleFavoriteSelect}
                  onRemove={removeFromFavorites}
                />

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToFavorites}
                  className="w-full py-3 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
                >
                  Ajouter {displayCurrent.city} aux favoris
                </motion.button>
              </motion.div>
            )}

            {!selectedCoords && !showLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <p className="text-white/70 text-lg">
                  Recherchez une ville ou utilisez la géolocalisation pour voir la météo
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="w-full py-4 text-center text-sm text-white/50">
          SkyCast 2025 - Données fournies par OpenWeatherMap
        </footer>
      </div>

      {/* Radar Map Modal - En dehors du flux principal */}
      <AnimatePresence>
        {showRadar && displayCurrent && (
          <RadarMap
            lat={displayCurrent.lat}
            lon={displayCurrent.lon}
            onClose={() => setShowRadar(false)}
          />
        )}
      </AnimatePresence>
    </DynamicBackground>
  );
}
