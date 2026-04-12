'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
  text?: string;
}

export function LoadingSpinner({ size = 24, className, text }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className={className}
      >
        <Loader2 size={size} className="text-white/80 dark:text-white/80 light:text-gray-600" />
      </motion.div>
      {text && <p className="text-sm text-white/60 dark:text-white/60 light:text-gray-500">{text}</p>}
    </div>
  );
}
