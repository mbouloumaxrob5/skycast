'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';
import { logger } from '@/lib/utils/logger';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error('Application error:', { error });
  }, [error]);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={40} className="text-red-400" />
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">
          Oups ! Une erreur est survenue
        </h1>

        <p className="text-white/60 mb-8">
          {error.message || "Quelque chose s&apos;est mal passé. Veuillez réessayer."}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-xl transition-colors"
          >
            <RefreshCw size={18} />
            Réessayer
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white/80 rounded-xl transition-colors"
          >
            <Home size={18} />
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
