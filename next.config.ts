import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Désactiver les avertissements d'environnement Turbopack
  turbopack: {
    ignoreIssue: [
      {
        path: '**/*',
        title: 'ENVIRONMENT_FALLBACK',
      },
    ],
  },
  // Configuration pour éviter les problèmes d'environnement
  env: {
    NEXT_PUBLIC_APP_ENV: process.env.NODE_ENV || 'development',
  },
};

export default nextConfig;
