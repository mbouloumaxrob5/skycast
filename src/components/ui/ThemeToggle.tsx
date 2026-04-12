'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';

type ThemeMode = 'dark' | 'light' | 'system';

interface ThemeToggleProps {
  variant?: 'simple' | 'full';
}

export function ThemeToggle({ variant = 'simple' }: ThemeToggleProps) {
  const { mode, isDark, setMode, toggleTheme } = useThemeStore();

  if (variant === 'simple') {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleTheme}
        className="relative p-2 rounded-xl bg-white/10 border border-white/20 
                   hover:bg-white/20 transition-colors"
        aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <Moon size={20} className="text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              transition={{ duration: 0.2 }}
            >
              <Sun size={20} className="text-yellow-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    );
  }

  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-white/10 border border-white/20">
      {(['light', 'system', 'dark'] as ThemeMode[]).map((m) => (
        <motion.button
          key={m}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setMode(m)}
          className={`relative p-2 rounded-lg transition-colors ${
            mode === m ? 'bg-white/20' : 'hover:bg-white/10'
          }`}
          aria-label={
            m === 'light' ? 'Mode clair' : m === 'dark' ? 'Mode sombre' : 'Mode système'
          }
        >
          {m === 'light' && <Sun size={18} className="text-yellow-500" />}
          {m === 'system' && <Monitor size={18} className="text-blue-400" />}
          {m === 'dark' && <Moon size={18} className="text-white" />}
        </motion.button>
      ))}
    </div>
  );
}
