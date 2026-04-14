'use client';

import { motion } from 'framer-motion';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { useEffect, useState } from 'react';

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-indigo-950 overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 py-6 px-4 sm:px-6 border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/"
                className={cn(
                  'flex items-center gap-2 px-5 py-2.5 rounded-xl',
                  'bg-white/5 hover:bg-white/10 border border-white/10',
                  'text-white/80 hover:text-white text-sm font-medium',
                  'transition-all duration-300 backdrop-blur-sm',
                  'hover:border-white/20 hover:shadow-lg hover:shadow-white/5'
                )}
              >
                <ArrowLeft className="w-4 h-4" />
                Retour
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 py-8 px-4 sm:px-6">
        {mounted ? (
          <AnalyticsDashboard />
        ) : (
          <div className="w-full h-96 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white/20 border-t-blue-500 rounded-full animate-spin" />
          </div>
        )}
      </main>

      {/* Modern Footer */}
      <footer className="relative z-10 py-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/40">
              SkyCast Analytics • Données stockées localement
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-sm text-white/40 hover:text-white/70 transition-colors">
                Confidentialité
              </Link>
              <Link href="/legal" className="text-sm text-white/40 hover:text-white/70 transition-colors">
                Mentions légales
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
