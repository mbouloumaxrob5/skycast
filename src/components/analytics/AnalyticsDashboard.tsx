'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Search, 
  Heart, 
  MapPin, 
  AlertTriangle,
  Download,
  Trash2,
  Activity,
  Globe,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useAnalyticsStore } from '@/store/analyticsStore';
import { AnalyticsEventType } from '@/types/analytics';
import { cn } from '@/lib/utils/cn';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

function StatCard({ title, value, icon, trend, trendValue }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
    >
      {/* Background gradient glow */}
      <div className="absolute -inset-px bg-linear-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
      
      {/* Top shine effect */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative flex items-start justify-between mb-3">
        <motion.div 
          className="p-2.5 rounded-xl bg-linear-to-br from-white/10 to-white/5 border border-white/10 group-hover:border-white/20 transition-all shadow-inner"
          whileHover={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 0.5 }}
        >
          {icon}
        </motion.div>
        {trend && trendValue && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
              'flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm border',
              trend === 'up' && 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
              trend === 'down' && 'text-rose-400 bg-rose-500/10 border-rose-500/30',
              trend === 'neutral' && 'text-white/60 bg-white/5 border-white/20'
            )}
          >
            {trend === 'up' && <TrendingUp className="w-3 h-3" />}
            {trend === 'down' && <TrendingDown className="w-3 h-3" />}
            {trendValue}
          </motion.div>
        )}
      </div>
      <div className="relative mt-4">
        <motion.p 
          className="text-3xl font-bold bg-linear-to-r from-white via-white to-white/80 bg-clip-text text-transparent tracking-tight"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {value}
        </motion.p>
        <p className="text-sm text-white/50 mt-1 font-medium">
          {title}
        </p>
      </div>
      
      {/* Bottom accent gradient line */}
      <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-linear-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-full" />
      
      {/* Corner decoration */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-linear-to-bl from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-tr-2xl" />
    </motion.div>
  );
}

interface EventBarProps {
  type: AnalyticsEventType;
  count: number;
  total: number;
  color: string;
}

function EventBar({ type, count, total, color }: EventBarProps) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  
  const labels: Record<AnalyticsEventType, string> = {
    page_view: 'Pages vues',
    city_search: 'Recherches',
    city_select: 'Villes sélectionnées',
    geolocation_request: 'Géolocalisation',
    geolocation_success: 'Géoloc. réussies',
    geolocation_error: 'Erreurs géoloc.',
    weather_fetch: 'Données météo',
    weather_error: 'Erreurs météo',
    forecast_fetch: 'Prévisions',
    radar_open: 'Radar ouvert',
    radar_close: 'Radar fermé',
    favorite_add: 'Favoris ajoutés',
    favorite_remove: 'Favoris retirés',
    offline_mode: 'Mode offline',
    online_mode: 'Mode online',
    alert_view: 'Alertes vues',
    settings_change: 'Paramètres',
    theme_toggle: 'Changements thème',
  };

  return (
    <motion.div 
      className="group flex items-center gap-3 py-2.5 px-3 -mx-3 rounded-xl hover:bg-white/5 transition-colors"
      whileHover={{ x: 4 }}
    >
      <span className="w-32 text-sm text-white/70 truncate">
        {labels[type] || type}
      </span>
      <div className="flex-1 h-2.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
          className={cn('h-full rounded-full relative', color)}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </motion.div>
      </div>
      <span className="w-10 text-sm font-medium text-white/70 text-right tabular-nums">
        {count}
      </span>
    </motion.div>
  );
}

const EVENT_COLORS: Record<AnalyticsEventType, string> = {
  page_view: 'bg-blue-500',
  city_search: 'bg-cyan-500',
  city_select: 'bg-teal-500',
  geolocation_request: 'bg-indigo-500',
  geolocation_success: 'bg-emerald-500',
  geolocation_error: 'bg-rose-500',
  weather_fetch: 'bg-sky-500',
  weather_error: 'bg-red-500',
  forecast_fetch: 'bg-violet-500',
  radar_open: 'bg-amber-500',
  radar_close: 'bg-orange-500',
  favorite_add: 'bg-pink-500',
  favorite_remove: 'bg-fuchsia-500',
  offline_mode: 'bg-slate-500',
  online_mode: 'bg-green-500',
  alert_view: 'bg-yellow-500',
  settings_change: 'bg-purple-500',
  theme_toggle: 'bg-lime-500',
};

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'all'>('today');
  
  // Subscribe only to specific store values to avoid unnecessary re-renders
  const events = useAnalyticsStore((state) => state.events);
  const performance = useAnalyticsStore((state) => state.performance);
  const errors = useAnalyticsStore((state) => state.errors);
  
  // Calculate metrics from raw store data
  const metrics = useMemo(() => {
    const now = Date.now();
    let startTime = 0;
    
    switch (timeRange) {
      case 'today':
        startTime = now - 24 * 60 * 60 * 1000;
        break;
      case 'week':
        startTime = now - 7 * 24 * 60 * 60 * 1000;
        break;
      default:
        startTime = 0;
    }
    
    // Filter events by time range
    const filteredEvents = startTime > 0 
      ? events.filter((e) => e.timestamp >= startTime)
      : events;
    
    // Count events by type
    const eventsByType: Record<string, number> = {};
    filteredEvents.forEach((e) => {
      eventsByType[e.type] = (eventsByType[e.type] || 0) + 1;
    });
    
    // Calculate average response time from performance arrays
    const apiTimes = performance.apiResponseTime || [];
    const avgResponseTime = apiTimes.length > 0
      ? apiTimes.reduce((sum: number, m: number) => sum + m, 0) / apiTimes.length
      : 0;
    
    // Calculate total errors from error metrics
    const totalErrorCount = (errors.weatherErrors || 0) + 
                          (errors.geolocationErrors || 0) + 
                          (errors.apiErrors || 0) + 
                          (errors.networkErrors || 0);
    const errorRate = filteredEvents.length > 0 
      ? (totalErrorCount / filteredEvents.length) * 100 
      : 0;
    
    // Get unique cities from search events (stored in data.cityName)
    const uniqueCities = new Set(
      filteredEvents
        .filter((e) => e.type === 'city_search' && e.data?.cityName)
        .map((e) => e.data?.cityName as string)
    );
    
    return {
      totalEvents: filteredEvents.length,
      eventsByType,
      sessionDuration: 0, // Non disponible dans UsageMetrics actuel
      averageApiResponseTime: avgResponseTime,
      totalErrors: totalErrorCount,
      errorRate,
      uniqueCitiesCount: uniqueCities.size,
    };
  }, [events, performance, errors, timeRange]);

  const handleExport = () => {
    const data = useAnalyticsStore.getState().exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skycast-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser toutes les données d\'analytics ?')) {
      useAnalyticsStore.getState().reset();
    }
  };

  const sortedEvents = useMemo(() => {
    return Object.entries(metrics.eventsByType)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);
  }, [metrics.eventsByType]);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white dark:text-white light:text-gray-900">
            Analytics & Monitoring
          </h1>
          <p className="text-sm text-white/60 dark:text-white/60 light:text-gray-500">
            Suivi des performances et de l&apos;utilisation
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Time Range Selector */}
          <div className="flex bg-white/10 dark:bg-white/10 light:bg-gray-100 rounded-lg p-1">
            {(['today', 'week', 'all'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  'px-3 py-1.5 rounded-md text-sm font-medium transition-all capitalize',
                  timeRange === range
                    ? 'bg-blue-500 text-white'
                    : 'text-white/70 dark:text-white/70 light:text-gray-600 hover:text-white'
                )}
              >
                {range === 'today' && 'Aujourd\'hui'}
                {range === 'week' && '7 jours'}
                {range === 'all' && 'Tout'}
              </button>
            ))}
          </div>
          
          <button
            onClick={handleExport}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            title="Exporter les données"
          >
            <Download className="w-5 h-5 text-white/70" />
          </button>
          
          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 transition-colors"
            title="Réinitialiser"
          >
            <Trash2 className="w-5 h-5 text-rose-400" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Événements totaux"
          value={metrics.totalEvents}
          icon={<Activity className="w-5 h-5 text-blue-400" />}
          trend="neutral"
          trendValue={timeRange === 'today' ? '24h' : timeRange === 'week' ? '7j' : 'Total'}
        />
        <StatCard
          title="Taux d&apos;erreur"
          value={`${metrics.errorRate}%`}
          icon={<AlertTriangle className="w-5 h-5 text-rose-400" />}
          trend={metrics.errorRate < 5 ? 'down' : 'up'}
          trendValue={metrics.errorRate < 5 ? 'Bon' : 'Élevé'}
        />
        <StatCard
          title="Temps de réponse API"
          value={metrics.averageApiResponseTime > 0 ? `${metrics.averageApiResponseTime.toFixed(0)}ms` : 'N/A'}
          icon={<Clock className="w-5 h-5 text-emerald-400" />}
          trend="neutral"
        />
        <StatCard
          title="Durée session"
          value={(() => {
            const duration = metrics.sessionDuration;
            const hours = Math.floor(duration / (1000 * 60 * 60));
            const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
            return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
          })()}
          icon={<Globe className="w-5 h-5 text-violet-400" />}
          trend="neutral"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Recherches"
          value={useAnalyticsStore.getState().usage.totalSearches}
          icon={<Search className="w-5 h-5 text-cyan-400" />}
        />
        <StatCard
          title="Villes uniques"
          value={metrics.uniqueCitiesCount}
          icon={<MapPin className="w-5 h-5 text-teal-400" />}
        />
        <StatCard
          title="Favoris"
          value={useAnalyticsStore.getState().usage.totalFavorites}
          icon={<Heart className="w-5 h-5 text-pink-400" />}
        />
        <StatCard
          title="Radar ouvert"
          value={useAnalyticsStore.getState().usage.radarOpens}
          icon={<BarChart3 className="w-5 h-5 text-amber-400" />}
        />
      </div>

      {/* Events Distribution */}
      <div className="grid md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'p-4 rounded-2xl backdrop-blur-md border',
            'bg-white/10 dark:bg-white/10 light:bg-white/60',
            'border-white/20 dark:border-white/20 light:border-gray-200'
          )}
        >
          <h3 className="text-lg font-semibold text-white dark:text-white light:text-gray-900 mb-4">
            Distribution des événements
          </h3>
          <div className="space-y-1">
            {sortedEvents.length === 0 ? (
              <p className="text-sm text-white/50 text-center py-8">
                Aucun événement enregistré
              </p>
            ) : (
              sortedEvents.map(([type, count]) => (
                <EventBar
                  key={type}
                  type={type as AnalyticsEventType}
                  count={count}
                  total={metrics.totalEvents}
                  color={EVENT_COLORS[type as AnalyticsEventType] || 'bg-gray-500'}
                />
              ))
            )}
          </div>
        </motion.div>

        {/* Error Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={cn(
            'p-4 rounded-2xl backdrop-blur-md border',
            'bg-white/10 dark:bg-white/10 light:bg-white/60',
            'border-white/20 dark:border-white/20 light:border-gray-200'
          )}
        >
          <h3 className="text-lg font-semibold text-white dark:text-white light:text-gray-900 mb-4">
            Résumé des erreurs
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-rose-500/10">
              <span className="text-sm text-white/70">Erreurs météo</span>
              <span className="text-lg font-bold text-rose-400">{useAnalyticsStore.getState().errors.weatherErrors}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-orange-500/10">
              <span className="text-sm text-white/70">Erreurs géoloc</span>
              <span className="text-lg font-bold text-orange-400">{useAnalyticsStore.getState().errors.geolocationErrors}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10">
              <span className="text-sm text-white/70">Erreurs API</span>
              <span className="text-lg font-bold text-amber-400">{useAnalyticsStore.getState().errors.apiErrors}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-yellow-500/10">
              <span className="text-sm text-white/70">Erreurs réseau</span>
              <span className="text-lg font-bold text-yellow-400">{useAnalyticsStore.getState().errors.networkErrors}</span>
            </div>
          </div>
          
          {(() => {
            const lastError = useAnalyticsStore.getState().errors.lastError;
            return lastError && (
              <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10">
                <p className="text-xs text-white/50 mb-1">Dernière erreur</p>
                <p className="text-sm text-white/80">{lastError.message}</p>
                <p className="text-xs text-white/40 mt-1">
                  {new Date(lastError.timestamp).toLocaleString('fr-FR')}
                </p>
              </div>
            );
          })()}
        </motion.div>
      </div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={cn(
          'p-4 rounded-2xl backdrop-blur-md border',
          'bg-white/10 dark:bg-white/10 light:bg-white/60',
          'border-white/20 dark:border-white/20 light:border-gray-200'
        )}
      >
        <h3 className="text-lg font-semibold text-white dark:text-white light:text-gray-900 mb-4">
          Métriques de performance
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-xl bg-white/5">
            <p className="text-2xl font-bold text-emerald-400">
              {useAnalyticsStore.getState().performance.apiResponseTime.length > 0 
                ? Math.round(useAnalyticsStore.getState().performance.apiResponseTime.reduce((a, b) => a + b, 0) / useAnalyticsStore.getState().performance.apiResponseTime.length)
                : 0}ms
            </p>
            <p className="text-xs text-white/60 mt-1">API moyenne</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-white/5">
            <p className="text-2xl font-bold text-sky-400">
              {useAnalyticsStore.getState().performance.weatherLoadTime.length > 0 
                ? Math.round(useAnalyticsStore.getState().performance.weatherLoadTime.reduce((a, b) => a + b, 0) / useAnalyticsStore.getState().performance.weatherLoadTime.length)
                : 0}ms
            </p>
            <p className="text-xs text-white/60 mt-1">Chargement météo</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-white/5">
            <p className="text-2xl font-bold text-violet-400">
              {useAnalyticsStore.getState().performance.forecastLoadTime.length > 0 
                ? Math.round(useAnalyticsStore.getState().performance.forecastLoadTime.reduce((a, b) => a + b, 0) / useAnalyticsStore.getState().performance.forecastLoadTime.length)
                : 0}ms
            </p>
            <p className="text-xs text-white/60 mt-1">Chargement prévisions</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-white/5">
            <p className="text-2xl font-bold text-indigo-400">
              {useAnalyticsStore.getState().performance.geolocationTime.length > 0 
                ? Math.round(useAnalyticsStore.getState().performance.geolocationTime.reduce((a, b) => a + b, 0) / useAnalyticsStore.getState().performance.geolocationTime.length)
                : 0}ms
            </p>
            <p className="text-xs text-white/60 mt-1">Géolocalisation</p>
          </div>
        </div>
      </motion.div>

      {/* Usage Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={cn(
          'p-4 rounded-2xl backdrop-blur-md border',
          'bg-white/10 dark:bg-white/10 light:bg-white/60',
          'border-white/20 dark:border-white/20 light:border-gray-200'
        )}
      >
        <h3 className="text-lg font-semibold text-white dark:text-white light:text-gray-900 mb-4">
          Statistiques d&apos;utilisation
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5">
            <div className="p-2 rounded-lg bg-pink-500/20">
              <Heart className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{useAnalyticsStore.getState().usage.totalFavorites}</p>
              <p className="text-xs text-white/60">Favoris</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5">
            <div className="p-2 rounded-lg bg-amber-500/20">
              <BarChart3 className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{useAnalyticsStore.getState().usage.radarOpens}</p>
              <p className="text-xs text-white/60">Radar</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5">
            <div className="p-2 rounded-lg bg-yellow-500/20">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{useAnalyticsStore.getState().usage.alertsViewed}</p>
              <p className="text-xs text-white/60">Alertes</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5">
            <div className="p-2 rounded-lg bg-slate-500/20">
              <WifiOff className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{useAnalyticsStore.getState().usage.offlineEvents}</p>
              <p className="text-xs text-white/60">Mode offline</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5">
            <div className="p-2 rounded-lg bg-emerald-500/20">
              <Wifi className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">
                {metrics.eventsByType['online_mode'] || 0}
              </p>
              <p className="text-xs text-white/60">Retour online</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5">
            <div className="p-2 rounded-lg bg-cyan-500/20">
              <Search className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{metrics.uniqueCitiesCount}</p>
              <p className="text-xs text-white/60">Villes uniques</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
