'use client';

import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface AlertBadgeProps {
  count: number;
  onClick?: () => void;
}

export function AlertBadge({ count, onClick }: AlertBadgeProps) {
  if (count === 0) return null;

  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={
        "relative flex items-center gap-2 px-3 py-1.5 rounded-full " +
        "bg-red-500/90 dark:bg-red-500/90 light:bg-red-500 backdrop-blur-xl " +
        "border border-red-400/50 dark:border-red-400/50 light:border-red-300 " +
        "text-white text-sm font-medium shadow-lg hover:bg-red-500 " +
        "transition-colors"
      }
    >
      <AlertTriangle size={16} />
      <span>{count} alerte{count > 1 ? 's' : ''}</span>
      
      {/* Pulsation */}
      <motion.span
        className="absolute inset-0 rounded-full bg-red-400"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.button>
  );
}
