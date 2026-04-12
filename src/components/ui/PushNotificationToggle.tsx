'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellOff, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { usePushNotifications } from '@/hooks/usePushNotifications';

export function PushNotificationToggle() {
  const {
    isSupported,
    isSubscribed,
    permission,
    isLoading,
    error,
    subscribe,
    unsubscribe,
    sendTestNotification,
    clearError,
  } = usePushNotifications();

  // Ne pas afficher si non supporté
  if (!isSupported) {
    return null;
  }

  const handleToggle = async () => {
    if (isSubscribed) {
      await unsubscribe();
    } else {
      await subscribe();
    }
  };

  const getButtonText = () => {
    if (isLoading) return 'Chargement...';
    if (isSubscribed) return 'Notifications activées';
    if (permission === 'denied') return 'Notifications bloquées';
    return 'Activer les alertes';
  };

  const getIcon = () => {
    if (isSubscribed) return <Check size={16} />;
    if (permission === 'denied') return <BellOff size={16} />;
    return <Bell size={16} />;
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: permission === 'denied' ? 1 : 1.02 }}
        whileTap={{ scale: permission === 'denied' ? 1 : 0.98 }}
        onClick={handleToggle}
        disabled={isLoading || permission === 'denied'}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
          'backdrop-blur-xl border',
          isSubscribed
            ? 'bg-green-500/20 border-green-500/30 text-green-400'
            : permission === 'denied'
            ? 'bg-red-500/20 border-red-500/30 text-red-400 cursor-not-allowed'
            : 'bg-white/10 dark:bg-white/10 light:bg-white/80 border-white/20 dark:border-white/20 light:border-gray-300 text-white dark:text-white light:text-gray-700 hover:bg-white/20 dark:hover:bg-white/20 light:hover:bg-gray-100'
        )}
      >
        {getIcon()}
        <span>{getButtonText()}</span>
      </motion.button>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm"
          >
            <div className="flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={clearError}
              className="absolute top-1 right-1 p-1 text-red-400/60 hover:text-red-400"
            >
              <span className="sr-only">Fermer</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Test button (only when subscribed) */}
      <AnimatePresence>
        {isSubscribed && (
          <motion.button
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onClick={sendTestNotification}
            className="mt-2 text-xs text-white/50 dark:text-white/50 light:text-gray-500 hover:text-white dark:hover:text-white light:hover:text-gray-700 transition-colors"
          >
            Envoyer une notification de test
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
