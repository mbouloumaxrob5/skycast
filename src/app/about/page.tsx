'use client';

import { motion } from 'framer-motion';
import { Cloud, MapPin, Bell, Palette, BarChart3, Globe, ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils/cn';

const features = [
  { icon: Cloud, title: 'weather', description: 'weatherDescription' },
  { icon: MapPin, title: 'location', description: 'locationDescription' },
  { icon: Bell, title: 'alerts', description: 'alertsDescription' },
  { icon: Palette, title: 'themes', description: 'themesDescription' },
  { icon: BarChart3, title: 'analytics', description: 'analyticsDescription' },
  { icon: Globe, title: 'i18n', description: 'i18nDescription' },
];

export default function AboutPage() {
  const t = useTranslations('about');

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-indigo-950 overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 backdrop-blur-2xl bg-slate-950/60 border-b border-white/10"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div className="flex items-center gap-4" whileHover={{ scale: 1.02 }}>
              <div className="relative">
                <div className="absolute inset-0 bg-sky-500/30 blur-xl rounded-2xl animate-pulse" />
                <div className="relative p-3 rounded-2xl bg-linear-to-br from-sky-500/20 to-blue-500/20 border border-white/20 backdrop-blur-sm">
                  <Cloud className="w-7 h-7 text-sky-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold bg-linear-to-r from-white to-white/70 bg-clip-text text-transparent">
                    {t('title')}
                  </h1>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-sm text-white/50">
                  {t('subtitle')}
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
      
      <main className="relative z-10 container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div 
            className="relative w-28 h-28 mx-auto mb-8"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="absolute inset-0 bg-sky-500/30 blur-2xl rounded-full" />
            <div className="relative w-full h-full bg-linear-to-br from-sky-500/30 to-blue-500/30 rounded-full flex items-center justify-center border border-white/20 backdrop-blur-sm">
              <Cloud size={56} className="text-sky-400" />
            </div>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('title')}
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="group relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-linear-to-br from-sky-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity" />
              <div className="relative">
                <div className="w-12 h-12 bg-sky-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-sky-500/30 transition-colors">
                  <feature.icon size={24} className="text-sky-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {t(feature.title)}
                </h3>
                <p className="text-white/60 text-sm">
                  {t(feature.description)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 mb-16"
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            {t('techStack')}
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS v4', 'Framer Motion', 'Zustand', 'TanStack Query', 'next-intl', 'PWA'].map((tech, index) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.05 }}
                className="px-4 py-2 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 rounded-full text-sm font-medium transition-colors cursor-default"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Footer Links */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap justify-center gap-6 text-white/60"
        >
          <Link href="/" className="hover:text-white transition-colors">
            {t('backHome')}
          </Link>
          <Link href="/settings" className="hover:text-white transition-colors">
            Paramètres
          </Link>
          <Link href="/help" className="hover:text-white transition-colors">
            Aide
          </Link>
          <Link href="/legal" className="hover:text-white transition-colors">
            {t('legal')}
          </Link>
          <Link href="/privacy" className="hover:text-white transition-colors">
            {t('privacy')}
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
