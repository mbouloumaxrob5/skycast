'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';
import { useEffect, useState } from 'react';

type ThemeMode = 'dark' | 'light' | 'system';

interface ThemeToggleProps {
  variant?: 'simple' | 'full';
}

export function ThemeToggle({ variant = 'simple' }: ThemeToggleProps) {
  const { mode, isDark, setMode, toggleTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20" />
    );
  }

  if (variant === 'simple') {
    return (
      <motion.button
        whileHover={{ scale: 1.08, rotate: isDark ? -5 : 5 }}
        whileTap={{ scale: 0.92 }}
        onClick={toggleTheme}
        className="relative w-10 h-10 rounded-xl bg-linear-to-br from-white/15 to-white/5 border border-white/20 
                   hover:border-white/40 transition-all overflow-hidden shadow-lg shadow-black/10"
        aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
      >
        {/* Animated background glow */}
        <motion.div
          className={`absolute inset-0 rounded-xl ${
            isDark 
              ? 'bg-linear-to-br from-indigo-500/20 to-purple-500/10' 
              : 'bg-linear-to-br from-amber-500/20 to-orange-500/10'
          }`}
          animate={{ 
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
            ease: "easeInOut"
          }}
        />

        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="moon"
              className="relative z-10"
              initial={{ opacity: 0, rotate: -180, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 180, scale: 0.5 }}
              transition={{ duration: 0.4, ease: [0.175, 0.885, 0.32, 1.275] }}
            >
              <Moon size={20} className="text-indigo-300 drop-shadow-lg" />
              {/* Stars */}
              <motion.div
                className="absolute -top-0.5 -right-0.5 w-1 h-1 bg-white rounded-full"
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  delay: 0.5
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              className="relative z-10"
              initial={{ opacity: 0, rotate: 180, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -180, scale: 0.5 }}
              transition={{ duration: 0.4, ease: [0.175, 0.885, 0.32, 1.275] }}
            >
              <Sun size={20} className="text-amber-400 drop-shadow-lg" />
              {/* Rays */}
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute top-1/2 left-1/2 w-0.5 h-1 bg-amber-400/50 rounded-full"
                    style={{
                      transform: `rotate(${i * 90}deg) translateY(-10px)`,
                      transformOrigin: 'center'
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    );
  }

  return (
    <div className="flex items-center gap-1 p-1.5 rounded-xl bg-linear-to-br from-white/10 to-white/5 border border-white/15 shadow-lg shadow-black/10">
      {(['light', 'system', 'dark'] as ThemeMode[]).map((m, index) => (
        <motion.button
          key={m}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setMode(m)}
          className={`relative p-2.5 rounded-lg transition-all duration-300 ${
            mode === m 
              ? 'bg-linear-to-br from-white/20 to-white/10 shadow-md' 
              : 'hover:bg-white/10'
          }`}
          aria-label={
            m === 'light' ? 'Mode clair' : m === 'dark' ? 'Mode sombre' : 'Mode système'
          }
        >
          {/* Active indicator */}
          {mode === m && (
            <motion.div
              layoutId="activeThemeIndicator"
              className="absolute inset-0 bg-linear-to-br from-blue-500/20 to-indigo-500/20 rounded-lg"
              initial={false}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">
            {m === 'light' && <Sun size={18} className="text-amber-400" />}
            {m === 'system' && <Monitor size={18} className="text-blue-400" />}
            {m === 'dark' && <Moon size={18} className="text-indigo-300" />}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
