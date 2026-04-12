'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, Map as MapIcon, CloudRain, Wind } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface RadarMapProps {
  lat: number;
  lon: number;
  onClose?: () => void;
}

// RainViewer API endpoints
const RAINVIEWER_API = 'https://api.rainviewer.com/public/weather-maps.json';

interface RainViewerData {
  generated: number;
  host: string;
  radar: {
    past: Array<{ time: number; path: string }>;
    nowcast: Array<{ time: number; path: string }>;
  };
  satellite: {
    infrared: Array<{ time: number; path: string }>;
  };
}

export function RadarMap({ lat, lon, onClose }: RadarMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [radarData, setRadarData] = useState<RainViewerData | null>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mapType, setMapType] = useState<'radar' | 'satellite'>('radar');
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch RainViewer data
  useEffect(() => {
    const fetchRadarData = async () => {
      try {
        const response = await fetch(RAINVIEWER_API);
        if (!response.ok) throw new Error('Erreur de chargement des données radar');
        const data: RainViewerData = await response.json();
        setRadarData(data);
        setIsLoading(false);
      } catch {
        setError('Impossible de charger les données radar');
        setIsLoading(false);
      }
    };

    fetchRadarData();
  }, []);

  // Get frames based on map type
  const getFrames = useCallback(() => {
    if (!radarData) return [];
    if (mapType === 'radar') {
      return [...radarData.radar.past, ...radarData.radar.nowcast];
    }
    return radarData.satellite.infrared;
  }, [radarData, mapType]);

  // Animation
  useEffect(() => {
    const frames = getFrames();
    if (isPlaying && frames.length > 0) {
      animationRef.current = setInterval(() => {
        setCurrentFrame((prev) => (prev + 1) % frames.length);
      }, 500);
    }

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [isPlaying, getFrames]);

  // Generate tile URL
  const getTileUrl = useCallback(() => {
    const frames = getFrames();
    if (frames.length === 0 || !radarData) return null;
    
    const frame = frames[currentFrame];
    const timestamp = frame.time;
    const path = frame.path;
    
    // RainViewer tiles URL pattern
    return `https://${radarData.host}${path}/{z}/{x}/{y}/1/1_1.png`;
  }, [radarData, currentFrame, getFrames]);

  const frames = getFrames();
  const currentTimestamp = frames[currentFrame]?.time;

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
            src={`https://www.rainviewer.com/map.html?loc=${lat},${lon},8&oFa=0&oC=1&oU=0&oCS=1&oF=0&oAP=1&c=3&o=83&oN=1`}
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
            <div className="w-24 h-2 rounded-full bg-gradient-to-r from-blue-400 via-green-400 via-yellow-400 to-red-500" />
            <span className="text-[10px] text-white/60">Forte</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 border-t border-white/10 dark:border-white/10 light:border-gray-200">
        <div className="flex items-center justify-between">
          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={frames.length === 0}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all',
              isPlaying
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'Pause' : 'Lecture'}
          </button>

          {/* Timestamp */}
          <div className="text-sm text-white/60 dark:text-white/60 light:text-gray-500">
            {currentTimestamp ? (
              <span>
                {new Date(currentTimestamp * 1000).toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            ) : (
              <span>--:--</span>
            )}
          </div>

          {/* Frame counter */}
          <div className="text-sm text-white/60 dark:text-white/60 light:text-gray-500">
            {frames.length > 0 ? `${currentFrame + 1} / ${frames.length}` : '-- / --'}
          </div>
        </div>

        {/* Timeline */}
        {frames.length > 0 && (
          <div className="mt-3">
            <input
              type="range"
              min={0}
              max={frames.length - 1}
              value={currentFrame}
              onChange={(e) => setCurrentFrame(Number(e.target.value))}
              className="w-full h-1 bg-white/20 dark:bg-white/20 light:bg-gray-300 rounded-lg appearance-none cursor-pointer"
              style={{
                backgroundImage: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${((currentFrame + 1) / frames.length) * 100}%, transparent ${((currentFrame + 1) / frames.length) * 100}%)`,
              }}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
