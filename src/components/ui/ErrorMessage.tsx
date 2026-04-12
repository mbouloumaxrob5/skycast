'use client';

import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-red-500/20 dark:bg-red-500/20 light:bg-red-100/80 backdrop-blur-xl border border-red-500/30 dark:border-red-500/30 light:border-red-300"
    >
      <AlertCircle size={32} className="text-red-400 dark:text-red-400 light:text-red-600" />
      <p className="text-center text-red-100 dark:text-red-100 light:text-red-800">{message}</p>
      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/30 dark:bg-red-500/30 light:bg-red-200 hover:bg-red-500/50 dark:hover:bg-red-500/50 light:hover:bg-red-300 text-red-100 dark:text-red-100 light:text-red-800 transition-colors"
        >
          <RefreshCw size={16} />
          Réessayer
        </motion.button>
      )}
    </motion.div>
  );
}
