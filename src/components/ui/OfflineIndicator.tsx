'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface OfflineIndicatorProps {
  isOffline: boolean;
  onRefresh?: () => void;
  hasCachedData?: boolean;
}

export function OfflineIndicator({ isOffline, onRefresh, hasCachedData }: OfflineIndicatorProps) {
  return (
    <AnimatePresence mode="wait">
      {isOffline && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={cn(
            "fixed top-20 left-1/2 -translate-x-1/2 z-50",
            "flex items-center gap-3 px-4 py-3 rounded-xl",
            "bg-amber-500/90 dark:bg-amber-500/90 light:bg-amber-500 backdrop-blur-xl shadow-xl",
            "border border-amber-400/50 dark:border-amber-400/50 light:border-amber-300"
          )}
        >
          <WifiOff size={18} className="text-white" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">
              Mode hors ligne
            </span>
            {hasCachedData && (
              <span className="text-xs text-white/90 dark:text-white/90 light:text-white/80">
                Données mises en cache affichées
              </span>
            )}
          </div>
          {onRefresh && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onRefresh}
              className="p-2 rounded-full bg-white/20 dark:bg-white/20 light:bg-white/30 hover:bg-white/30 text-white transition-colors"
            >
              <RefreshCw size={16} />
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
