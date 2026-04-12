'use client';

import { motion } from 'framer-motion';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-white/10"
      >
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/20">
                <BarChart3 className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  Analytics & Monitoring
                </h1>
                <p className="text-xs text-white/60">
                  Dashboard de suivi
                </p>
              </div>
            </div>
            
            <Link
              href="/"
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl',
                'bg-white/10 hover:bg-white/20 transition-colors',
                'text-white/80 hover:text-white text-sm font-medium'
              )}
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="py-8">
        <AnalyticsDashboard />
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-white/40">
        SkyCast Analytics • Données stockées localement
      </footer>
    </div>
  );
}
