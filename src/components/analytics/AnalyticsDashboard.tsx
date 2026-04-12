'use client';

import { useState, useMemo, useSyncExternalStore } from 'react';
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
import { AnalyticsEventType, AggregatedMetrics } from '@/types/analytics';
import { cn } from '@/lib/utils/cn';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
}

function StatCard({ title, value, icon, trend, trendValue, className }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'p-4 rounded-2xl backdrop-blur-md border',
        'bg-white/10 dark:bg-white/10 light:bg-white/60',
        'border-white/20 dark:border-white/20 light:border-gray-200',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="p-2 rounded-xl bg-white/10 dark:bg-white/10 light:bg-blue-500/10">
          {icon}
        </div>
        {trend && trendValue && (
          <div className={cn(
            'flex items-center gap-1 text-xs font-medium',
            trend === 'up' && 'text-emerald-400',
            trend === 'down' && 'text-rose-400',
            trend === 'neutral' && 'text-white/60'
          )}>
            {trend === 'up' && <TrendingUp className="w-3 h-3" />}
            {trend === 'down' && <TrendingDown className="w-3 h-3" />}
            {trendValue}
          </div>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-white dark:text-white light:text-gray-900">
          {value}
        </p>
        <p className="text-sm text-white/60 dark:text-white/60 light:text-gray-500">
          {title}
        </p>
      </div>
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
    geolocation_request: 'Demandes de géoloc',
    geolocation_success: 'Géoloc réussies',
    geolocation_error: 'Erreurs géoloc',
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
    <div className="flex items-center gap-3 py-2">
      <span className="w-32 text-xs text-white/70 dark:text-white/70 light:text-gray-600 truncate">
        {labels[type] || type}
      </span>
      <div className="flex-1 h-2 bg-white/10 dark:bg-white/10 light:bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={cn('h-full rounded-full', color)}
        />
      </div>
      <span className="w-8 text-xs text-white/60 dark:text-white/60 light:text-gray-500 text-right">
        {count}
      </span>
    </div>
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

// Simple time store for getting current time
function subscribe(callback: () => void) {
  const interval = setInterval(callback, 60000); // Update every minute
  return () => clearInterval(interval);
}

function getSnapshot() {
  return Date.now();
}

function getServerSnapshot() {
  return Date.now();
}

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'all'>('today');
  const now = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const store = useAnalyticsStore();

  const metrics: AggregatedMetrics = useMemo(() => {
    // Calculate range based on timeRange selection
    let range;
    
    switch (timeRange) {
      case 'today':
        range = { start: now - 24 * 60 * 60 * 1000, end: now };
        break;
      case 'week':
        range = { start: now - 7 * 24 * 60 * 60 * 1000, end: now };
        break;
      default:
        range = undefined;
    }
    
    return store.getAggregatedMetrics(range);
  }, [timeRange, now, store]);

  const sessionDuration = useMemo(() => {
    const duration = metrics.sessionDuration;
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  }, [metrics.sessionDuration]);

  const avgResponseTime = useMemo(() => {
    return metrics.averageApiResponseTime > 0 
      ? `${metrics.averageApiResponseTime.toFixed(0)}ms` 
      : 'N/A';
  }, [metrics.averageApiResponseTime]);

  const handleExport = () => {
    const data = store.exportData();
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
      store.reset();
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
          value={avgResponseTime}
          icon={<Clock className="w-5 h-5 text-emerald-400" />}
          trend="neutral"
        />
        <StatCard
          title="Durée session"
          value={sessionDuration}
          icon={<Globe className="w-5 h-5 text-violet-400" />}
          trend="neutral"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Recherches"
          value={store.usage.totalSearches}
          icon={<Search className="w-5 h-5 text-cyan-400" />}
        />
        <StatCard
          title="Villes uniques"
          value={metrics.uniqueCitiesCount}
          icon={<MapPin className="w-5 h-5 text-teal-400" />}
        />
        <StatCard
          title="Favoris"
          value={store.usage.totalFavorites}
          icon={<Heart className="w-5 h-5 text-pink-400" />}
        />
        <StatCard
          title="Radar ouvert"
          value={store.usage.radarOpens}
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
              <span className="text-lg font-bold text-rose-400">{store.errors.weatherErrors}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-orange-500/10">
              <span className="text-sm text-white/70">Erreurs géoloc</span>
              <span className="text-lg font-bold text-orange-400">{store.errors.geolocationErrors}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10">
              <span className="text-sm text-white/70">Erreurs API</span>
              <span className="text-lg font-bold text-amber-400">{store.errors.apiErrors}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-yellow-500/10">
              <span className="text-sm text-white/70">Erreurs réseau</span>
              <span className="text-lg font-bold text-yellow-400">{store.errors.networkErrors}</span>
            </div>
          </div>
          
          {store.errors.lastError && (
            <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs text-white/50 mb-1">Dernière erreur</p>
              <p className="text-sm text-white/80">{store.errors.lastError.message}</p>
              <p className="text-xs text-white/40 mt-1">
                {new Date(store.errors.lastError.timestamp).toLocaleString('fr-FR')}
              </p>
            </div>
          )}
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
              {store.performance.apiResponseTime.length > 0 
                ? Math.round(store.performance.apiResponseTime.reduce((a, b) => a + b, 0) / store.performance.apiResponseTime.length)
                : 0}ms
            </p>
            <p className="text-xs text-white/60 mt-1">API moyenne</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-white/5">
            <p className="text-2xl font-bold text-sky-400">
              {store.performance.weatherLoadTime.length > 0 
                ? Math.round(store.performance.weatherLoadTime.reduce((a, b) => a + b, 0) / store.performance.weatherLoadTime.length)
                : 0}ms
            </p>
            <p className="text-xs text-white/60 mt-1">Chargement météo</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-white/5">
            <p className="text-2xl font-bold text-violet-400">
              {store.performance.forecastLoadTime.length > 0 
                ? Math.round(store.performance.forecastLoadTime.reduce((a, b) => a + b, 0) / store.performance.forecastLoadTime.length)
                : 0}ms
            </p>
            <p className="text-xs text-white/60 mt-1">Chargement prévisions</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-white/5">
            <p className="text-2xl font-bold text-indigo-400">
              {store.performance.geolocationTime.length > 0 
                ? Math.round(store.performance.geolocationTime.reduce((a, b) => a + b, 0) / store.performance.geolocationTime.length)
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
              <p className="text-xl font-bold text-white">{store.usage.totalFavorites}</p>
              <p className="text-xs text-white/60">Favoris</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5">
            <div className="p-2 rounded-lg bg-amber-500/20">
              <BarChart3 className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{store.usage.radarOpens}</p>
              <p className="text-xs text-white/60">Radar</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5">
            <div className="p-2 rounded-lg bg-yellow-500/20">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{store.usage.alertsViewed}</p>
              <p className="text-xs text-white/60">Alertes</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5">
            <div className="p-2 rounded-lg bg-slate-500/20">
              <WifiOff className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{store.usage.offlineEvents}</p>
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
