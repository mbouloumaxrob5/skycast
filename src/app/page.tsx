'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
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
import { BarChart3, Radar, ChevronRight, Heart } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [showRadar, setShowRadar] = useState(false);
  const isGeolocatingRef = useRef(false);
  
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

  // Géolocalisation au chargement ou quand on clique sur le bouton
  useEffect(() => {
    if (!coords) return;
    
    // Cas 1: Initial load (pas de ville sélectionnée)
    const isInitialLoad = !selectedCoords && !selectedCity;
    // Cas 2: Utilisateur a cliqué sur "Ma position"
    const isExplicitGeolocation = isGeolocatingRef.current;
    
    if (isInitialLoad || isExplicitGeolocation) {
      requestAnimationFrame(() => {
        setSelectedCoords(coords);
        setSelectedCity(null); // Reset la ville sélectionnée pour afficher la position actuelle
      });
      isGeolocatingRef.current = false; // Reset le flag
    }
  }, [coords, selectedCoords, selectedCity, setSelectedCity]);

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
    isGeolocatingRef.current = true; // Marquer qu'on vient de cliquer sur le bouton
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
                
                {/* Bouton Radar amélioré */}
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowRadar(true)}
                  className="relative w-full py-4 rounded-2xl bg-linear-to-r from-blue-500/30 via-cyan-500/30 to-blue-500/30 dark:from-blue-500/20 dark:via-cyan-500/20 dark:to-blue-500/20 border border-blue-400/30 dark:text-white text-slate-800 overflow-hidden group shadow-lg shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/20 transition-all"
                >
                  {/* Animated background */}
                  <motion.div 
                    className="absolute inset-0 bg-linear-to-r from-blue-500/0 via-cyan-500/20 to-blue-500/0"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="relative flex items-center justify-center gap-3">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    >
                      <Radar className="w-5 h-5" />
                    </motion.div>
                    <span className="font-semibold">Voir le radar des précipitations</span>
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </motion.div>
                  </div>
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
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAddToFavorites}
                  className="relative w-full py-4 rounded-2xl bg-linear-to-br from-amber-500/30 to-orange-500/30 dark:from-amber-500/20 dark:to-orange-500/20 border border-amber-400/30 dark:text-white text-slate-800 overflow-hidden group shadow-lg shadow-amber-500/10 hover:shadow-xl hover:shadow-amber-500/20 transition-all"
                >
                  {/* Heart pulse effect */}
                  <motion.div
                    className="absolute inset-0 bg-amber-500/10"
                    animate={{ scale: [1, 1.2, 1], opacity: [0, 0.3, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <div className="relative flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Heart className="w-5 h-5 text-amber-400" />
                    </motion.div>
                    <span className="font-semibold">Ajouter {displayCurrent.city} aux favoris</span>
                  </div>
                </motion.button>
              </motion.div>
            )}

            {!selectedCoords && !showLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="text-center py-20 px-4"
              >
                <motion.div 
                  className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-linear-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center border border-blue-400/20 shadow-xl shadow-blue-500/10"
                  animate={{ 
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span className="text-4xl">☁️</span>
                </motion.div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">
                  Bienvenue sur SkyCast
                </h3>
                <p className="text-slate-600 dark:text-white/60 text-lg max-w-md mx-auto leading-relaxed">
                  Recherchez une ville ou utilisez la géolocalisation pour obtenir des prévisions météo précises
                </p>
                <div className="flex items-center justify-center gap-2 mt-6 text-slate-500 dark:text-white/40 text-sm">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Données en temps réel</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="w-full py-4 flex items-center justify-center gap-4 text-sm text-slate-500 dark:text-white/50">
          <span>SkyCast 2025 - Données fournies par OpenWeatherMap</span>
          <Link 
            href="/analytics" 
            className="flex items-center gap-1 text-slate-600 dark:text-white/70 hover:text-slate-800 dark:hover:text-white transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </Link>
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
