'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';
import { WeatherAlert as WeatherAlertType } from '@/types/weather';
import { cn } from '@/lib/utils/cn';

interface WeatherAlertsProps {
  alerts: WeatherAlertType[];
  autoDismiss?: boolean;
  dismissDelay?: number;
}

export function WeatherAlerts({ 
  alerts, 
  autoDismiss = true, 
  dismissDelay = 10000 
}: WeatherAlertsProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const dismiss = useCallback((id: string) => {
    setDismissed(prev => new Set([...prev, id]));
  }, []);

  const activeAlerts = alerts.filter(alert => !dismissed.has(alert.id));

  // Auto-dismiss après délai
  useEffect(() => {
    if (!autoDismiss) return;

    const timers: NodeJS.Timeout[] = [];
    activeAlerts.forEach(alert => {
      const timer = setTimeout(() => dismiss(alert.id), dismissDelay);
      timers.push(timer);
    });

    return () => timers.forEach(clearTimeout);
  }, [activeAlerts, autoDismiss, dismissDelay, dismiss]);

  if (activeAlerts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-40 flex flex-col gap-3 max-w-sm">
      <AnimatePresence mode="popLayout">
        {activeAlerts.map((alert, index) => (
          <WeatherAlertItem 
            key={alert.id} 
            alert={alert} 
            index={index}
            onDismiss={dismiss}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

interface WeatherAlertItemProps {
  alert: WeatherAlertType;
  index: number;
  onDismiss: (id: string) => void;
}

function WeatherAlertItem({ alert, index, onDismiss }: WeatherAlertItemProps) {
  const severityStyles = {
    info: 'bg-blue-500/90 dark:bg-blue-500/90 light:bg-blue-500 border-blue-400/50 dark:border-blue-400/50 light:border-blue-300',
    warning: 'bg-amber-500/90 dark:bg-amber-500/90 light:bg-amber-500 border-amber-400/50 dark:border-amber-400/50 light:border-amber-300',
    severe: 'bg-red-500/90 dark:bg-red-500/90 light:bg-red-500 border-red-400/50 dark:border-red-400/50 light:border-red-300',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.1,
        layout: { duration: 0.2 }
      }}
      className={cn(
        "relative overflow-hidden rounded-xl backdrop-blur-xl",
        "border shadow-xl",
        severityStyles[alert.type]
      )}
    >
      {/* Barre de progression auto-dismiss */}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 10, ease: 'linear' }}
        className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 origin-left"
      />

      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-white/20">
            <AlertTriangle size={20} className="text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-white text-sm">
              {alert.title}
            </h4>
            <p className="text-white/90 text-sm mt-1 leading-relaxed">
              {alert.message}
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDismiss(alert.id)}
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X size={14} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
