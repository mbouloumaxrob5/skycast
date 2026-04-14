'use client';

import { motion } from 'framer-motion';
import { CloudOff, Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('errors');

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center px-4"
      >
        {/* Animated Cloud Icon */}
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mb-8"
        >
          <div className="w-32 h-32 mx-auto bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
            <CloudOff size={64} className="text-white/80" />
          </div>
        </motion.div>

        {/* Error Code */}
        <motion.h1
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="text-8xl font-bold text-white mb-4"
        >
          404
        </motion.h1>

        {/* Message */}
        <h2 className="text-2xl font-semibold text-white/90 mb-2">
          {t('notFound')}
        </h2>
        <p className="text-white/60 mb-8 max-w-md mx-auto">
          {t('notFoundDescription')}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
          >
            <Home size={20} />
            {t('backHome')}
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors"
          >
            <ArrowLeft size={20} />
            {t('goBack')}
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="mt-12 flex justify-center gap-2">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 2,
                delay: i * 0.2,
                repeat: Infinity
              }}
              className="w-2 h-2 rounded-full bg-blue-400"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
