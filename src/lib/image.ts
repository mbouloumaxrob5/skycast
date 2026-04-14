import { ImageProps } from 'next/image';

/**
 * Configuration optimisée pour les images
 */
export const defaultImageConfig: Partial<ImageProps> = {
  loading: 'lazy',
  placeholder: 'blur',
  blurDataURL: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMzMzMiLz48L3N2Zz4=',
  quality: 75,
  priority: false,
};

/**
 * Génère un srcSet responsive
 */
export function generateSrcSet(src: string, sizes: number[]): string {
  return sizes.map((size) => `${src}?w=${size} ${size}w`).join(', ');
}

/**
 * Configuration pour les icônes météo
 */
export const weatherIconConfig = {
  ...defaultImageConfig,
  width: 64,
  height: 64,
  unoptimized: true, // Les icônes météo sont déjà optimisées par l'API
};

/**
 * Précharge les images critiques
 */
export function preloadImages(srcs: string[]): void {
  if (typeof window === 'undefined') return;
  
  srcs.forEach((src) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
}
