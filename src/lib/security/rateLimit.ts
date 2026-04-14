// Rate limiting pour les routes API
import { securityLogger } from '@/lib/utils/logger';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Configuration par défaut
const DEFAULT_MAX_REQUESTS = 60; // 60 requêtes
const DEFAULT_WINDOW_MS = 60000; // par minute

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

/**
 * Vérifie et met à jour le rate limit pour un identifiant donné
 * @param identifier - IP address ou user ID
 * @param maxRequests - Nombre maximum de requêtes dans la fenêtre
 * @param windowMs - Durée de la fenêtre en millisecondes
 */
export function checkRateLimit(
  identifier: string,
  maxRequests: number = DEFAULT_MAX_REQUESTS,
  windowMs: number = DEFAULT_WINDOW_MS
): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  // Si pas d'entrée ou fenêtre expirée, créer nouvelle entrée
  if (!entry || now > entry.resetTime) {
    const resetTime = now + windowMs;
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime,
    });
    
    return {
      allowed: true,
      limit: maxRequests,
      remaining: maxRequests - 1,
      resetTime,
    };
  }

  // Si limite atteinte
  if (entry.count >= maxRequests) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    return {
      allowed: false,
      limit: maxRequests,
      remaining: 0,
      resetTime: entry.resetTime,
      retryAfter,
    };
  }

  // Incrémenter le compteur
  entry.count++;
  
  return {
    allowed: true,
    limit: maxRequests,
    remaining: maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Nettoie les entrées expirées du rate limit
 * À appeler périodiquement (ex: toutes les 5 minutes)
 */
export function cleanupRateLimit(): void {
  const now = Date.now();
  let cleanedCount = 0;
  
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key);
      cleanedCount++;
    }
  }
  
  securityLogger.debug(`Nettoyage: ${cleanedCount} entrées supprimées`);
}

/**
 * Obtient l'IP réelle du client (supporte les proxys)
 */
export function getClientIP(request: Request): string {
  // Vérifier les headers de proxy
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    // Prendre la première IP si plusieurs (chaîne de proxys)
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  // Fallback
  return 'unknown';
}

// Nettoyage automatique toutes les 5 minutes
if (typeof globalThis !== 'undefined') {
  setInterval(cleanupRateLimit, 5 * 60 * 1000);
}
