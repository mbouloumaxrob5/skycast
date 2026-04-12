'use client';

import { motion } from 'framer-motion';
import { WifiOff, RefreshCw } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 max-w-md"
      >
        <div className="w-24 h-24 mx-auto rounded-full bg-amber-500/20 flex items-center justify-center">
          <WifiOff size={48} className="text-amber-400" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white dark:text-white light:text-gray-900">
            Vous êtes hors ligne
          </h1>
          <p className="text-white/70 dark:text-white/70 light:text-gray-600">
            Impossible de charger les données météo. Vérifiez votre connexion internet et réessayez.
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
        >
          <RefreshCw size={18} />
          Réessayer
        </motion.button>
      </motion.div>
    </div>
  );
}
