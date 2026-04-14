'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, CloudRain, Wind, AlertTriangle, Info, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { analytics } from '@/lib/analytics/analyticsService';

interface RadarMapProps {
  lat: number;
  lon: number;
  onClose?: () => void;
}

// Note: OpenWeatherMap Maps 2.0 nécessite une clé API pour les tuiles de précipitations
// Nous utilisons RainViewer comme solution de fallback avec couverture mondiale limitée
// Pour une couverture complète, il faudrait intégrer plusieurs fournisseurs de données radar

// Zones avec couverture radar complète (approximatif)
const RADAR_COVERAGE_ZONES = [
  // Amérique du Nord
  { minLat: 24, maxLat: 72, minLon: -180, maxLon: -50, name: 'Amérique du Nord' },
  // Europe
  { minLat: 35, maxLat: 71, minLon: -15, maxLon: 45, name: 'Europe' },
  // Asie de l'Est (Japon, Corée, Chine est)
  { minLat: 20, maxLat: 50, minLon: 100, maxLon: 145, name: 'Asie de l\'Est' },
  // Australie
  { minLat: -45, maxLat: -10, minLon: 110, maxLon: 155, name: 'Australie' },
  // Brésil
  { minLat: -35, maxLat: 5, minLon: -75, maxLon: -35, name: 'Brésil' },
];

// Types pour la configuration de la carte

export function RadarMap({ lat, lon, onClose }: RadarMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasRadarCoverage, setHasRadarCoverage] = useState<boolean>(true);
  const [coverageZone, setCoverageZone] = useState<string>('');
  const [mapType, setMapType] = useState<'radar' | 'satellite'>('radar');
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const openTimeRef = useRef<number>(Date.now());

  // Vérifier la couverture radar pour la position
  useEffect(() => {
    const checkRadarCoverage = () => {
      const zone = RADAR_COVERAGE_ZONES.find(
        z => lat >= z.minLat && lat <= z.maxLat && lon >= z.minLon && lon <= z.maxLon
      );
      
      if (zone) {
        setHasRadarCoverage(true);
        setCoverageZone(zone.name);
      } else {
        setHasRadarCoverage(false);
        setCoverageZone('');
      }
    };

    checkRadarCoverage();
  }, [lat, lon]);


  // Track radar open
  useEffect(() => {
    analytics.usage.radar.open();
    openTimeRef.current = Date.now();
    
    return () => {
      const duration = Date.now() - openTimeRef.current;
      analytics.track('radar_close', { 
        duration,
        lat, 
        lon,
        mapType,
        framesViewed: 0 
      });
    };
  }, [lat, lon, mapType]);

  // Simuler le chargement et vérifier la disponibilité
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // URL de la carte complète via iframe avec fallback
  const getMapIframeUrl = useCallback(() => {
    if (mapType === 'radar' && !hasRadarCoverage) {
      // Fallback sur la carte satellite si pas de couverture radar
      return `https://www.rainviewer.com/map.html?loc=${lat},${lon},8&oFa=0&oC=1&oU=0&oCS=1&oF=0&oAP=1&c=3&oN=1`;
    }
    // Utiliser RainViewer comme fallback principal car OWM nécessite une vraie clé API
    return `https://www.rainviewer.com/map.html?loc=${lat},${lon},8&oFa=0&oC=1&oU=0&oCS=1&oF=0&oAP=1&c=3&oN=1`;
  }, [lat, lon, mapType, hasRadarCoverage]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        'fixed inset-4 md:inset-10 z-50 rounded-3xl overflow-hidden',
        'backdrop-blur-xl bg-slate-900/95 dark:bg-slate-900/95 light:bg-white/95',
        'border border-white/20 dark:border-white/20 light:border-gray-200',
        'shadow-2xl flex flex-col'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 dark:border-white/10 light:border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <CloudRain className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="font-bold text-white dark:text-white light:text-gray-900">
              Radar Météo
            </h2>
            <p className="text-sm text-white/60 dark:text-white/60 light:text-gray-500">
              Précipitations en temps réel
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Map type toggle */}
          <div className="flex bg-white/10 dark:bg-white/10 light:bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setMapType('radar')}
              className={cn(
                'px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                mapType === 'radar'
                  ? 'bg-blue-500 text-white'
                  : 'text-white/70 dark:text-white/70 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-gray-900'
              )}
            >
              <CloudRain className="w-4 h-4 inline mr-1" />
              Radar
            </button>
            <button
              onClick={() => setMapType('satellite')}
              className={cn(
                'px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                mapType === 'satellite'
                  ? 'bg-blue-500 text-white'
                  : 'text-white/70 dark:text-white/70 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-gray-900'
              )}
            >
              <Wind className="w-4 h-4 inline mr-1" />
              Satellite
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-white/70 dark:text-white/70 light:text-gray-600" />
          </button>
        </div>
      </div>

      {/* Warning banner for limited radar coverage */}
      {mapType === 'radar' && !hasRadarCoverage && (
        <div className="bg-amber-500/20 border-b border-amber-500/30 px-4 py-2 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-amber-200 dark:text-amber-200 light:text-amber-700 font-medium">
              Données radar limitées pour cette région
            </p>
            <p className="text-[10px] text-amber-300/80 dark:text-amber-300/80 light:text-amber-600/80">
              Le radar affichera les données satellites disponibles. Pour une couverture complète, utilisez le mode Satellite.
            </p>
          </div>
          <button
            onClick={() => setMapType('satellite')}
            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-md transition-colors whitespace-nowrap"
          >
            Voir Satellite
          </button>
        </div>
      )}

      {/* Coverage info banner for zones with coverage */}
      {mapType === 'radar' && hasRadarCoverage && coverageZone && (
        <div className="bg-emerald-500/20 border-b border-emerald-500/30 px-4 py-2 flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-400 shrink-0" />
          <p className="text-xs text-emerald-200 dark:text-emerald-200 light:text-emerald-700">
            Couverture radar active : <span className="font-medium">{coverageZone}</span>
          </p>
        </div>
      )}

      {/* Map Container */}
      <div className="flex-1 relative bg-slate-950">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white/60 dark:text-white/60 light:text-gray-500">Chargement du radar...</p>
            </div>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-6 rounded-2xl bg-red-500/10 border border-red-500/20">
              <CloudRain className="w-12 h-12 text-red-400 mx-auto mb-3" />
              <p className="text-red-400">{error}</p>
            </div>
          </div>
        ) : (
          <iframe
            ref={mapRef as React.RefObject<HTMLIFrameElement>}
            src={getMapIframeUrl()}
            className="w-full h-full border-0"
            title="Radar météo"
            allow="geolocation"
          />
        )}

        {/* Legend overlay */}
        <div className="absolute bottom-4 left-4 p-3 rounded-xl bg-black/50 backdrop-blur-sm">
          <p className="text-xs text-white/80 mb-2">Intensité des précipitations</p>
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-white/60">Légère</span>
            <div className="w-24 h-2 rounded-full bg-linear-to-r from-blue-400 via-yellow-400 to-red-500" />
            <span className="text-[10px] text-white/60">Forte</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 border-t border-white/10 dark:border-white/10 light:border-gray-200">
        <div className="flex items-center justify-between">
          {/* Mode indicator */}
          <div className="flex items-center gap-2 text-sm text-white/60 dark:text-white/60 light:text-gray-500">
            <MapPin className="w-4 h-4" />
            <span>
              {hasRadarCoverage ? `Radar - ${coverageZone}` : (mapType === 'satellite' ? 'Satellite' : 'Radar limité')}
            </span>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 text-xs text-white/50 dark:text-white/50 light:text-gray-600">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span>Légère</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              <span>Moyenne</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>Forte</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
