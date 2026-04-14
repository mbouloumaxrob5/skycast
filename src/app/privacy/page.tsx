'use client';

import { motion } from 'framer-motion';
import { Shield, Calendar, ArrowLeft, Lock, Eye, Database } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils/cn';

export default function PrivacyPage() {
  const t = useTranslations('privacy');

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-indigo-950 overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 backdrop-blur-2xl bg-slate-950/60 border-b border-white/10"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div className="flex items-center gap-4" whileHover={{ scale: 1.02 }}>
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/30 blur-xl rounded-2xl animate-pulse" />
                <div className="relative p-3 rounded-2xl bg-linear-to-br from-emerald-500/20 to-teal-500/20 border border-white/20 backdrop-blur-sm">
                  <Shield className="w-7 h-7 text-emerald-400" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-linear-to-r from-white to-white/70 bg-clip-text text-transparent">
                  {t('title')}
                </h1>
                <p className="text-sm text-white/50 flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  {t('lastUpdated')} : 2025
                </p>
              </div>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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

      <main className="relative z-10 py-12 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10"
        >

          {/* Content */}
          <div className="space-y-8 text-white/80">
            <section className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <Lock className="w-5 h-5 text-emerald-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">{t('section1')}</h2>
              </div>
              <p className="leading-relaxed pl-12">{t('section1Content')}</p>
            </section>

            <section className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <Eye className="w-5 h-5 text-emerald-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">{t('section2')}</h2>
              </div>
              <p className="leading-relaxed pl-12">{t('section2Content')}</p>
            </section>

            <section className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <Database className="w-5 h-5 text-emerald-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">{t('section3')}</h2>
              </div>
              <p className="leading-relaxed pl-12">{t('section3Content')}</p>
            </section>

            <section className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">{t('section4')}</h2>
              </div>
              <p className="leading-relaxed pl-12">{t('section4Content')}</p>
            </section>
          </div>

          {/* Footer Links */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 pt-8 border-t border-white/10"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('backHome')}
              </Link>
              <div className="flex items-center gap-4 text-sm text-white/40">
                <Link href="/legal" className="hover:text-white/70 transition-colors">
                  Mentions légales
                </Link>
                <span>•</span>
                <Link href="/help" className="hover:text-white/70 transition-colors">
                  Aide
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
