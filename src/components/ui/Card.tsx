'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { cardVariants, scaleOnHover } from '@/lib/animations/variants';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  glass?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hoverable = true, glass = true, onClick }: CardProps) {
  const baseClasses = cn(
    'rounded-2xl p-6 transition-all duration-300',
    glass && [
      'backdrop-blur-xl border shadow-2xl',
      'bg-glass-bg border-glass-border shadow-black/10',
      'dark:shadow-black/10 light:shadow-gray-200/50',
    ],
    hoverable && 'hover:backdrop-blur-2xl cursor-pointer',
    className
  );

  if (onClick || hoverable) {
    return (
      <motion.div
        variants={cardVariants}
        whileHover={hoverable ? scaleOnHover : undefined}
        whileTap={onClick ? { scale: 0.98 } : undefined}
        onClick={onClick}
        className={baseClasses}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div variants={cardVariants} className={baseClasses}>
      {children}
    </motion.div>
  );
}
