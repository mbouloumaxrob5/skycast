// Validation et sanitization des entrées utilisateur

// Regex patterns pour validation
const PATTERNS = {
  // Validation des noms de villes : lettres, espaces, tirets, apostrophes
  cityName: /^[a-zA-ZÀ-ÿ\s\-\'\.]+$/,
  
  // Validation des coordonnées GPS
  latitude: /^-?([0-8]?\d|90)(\.\d+)?$/,
  longitude: /^-?(1[0-7]\d|[0-9]?\d)(\.\d+)?$/,
  
  // Validation des codes postaux (exemple générique)
  zipCode: /^[A-Z0-9\-\s]{3,10}$/i,
  
  // Validation des pays (codes ISO)
  countryCode: /^[A-Z]{2}$/i,
};

// Sanitization : échapper les caractères dangereux
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .trim()
    // Supprimer les balises HTML
    .replace(/<[^>]*>/g, '')
    // Échapper les caractères spéciaux
    .replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
    }[char] || char))
    // Limiter la longueur
    .slice(0, 100);
}

// Validation du nom de ville
export function validateCityName(city: string): { isValid: boolean; sanitized: string; error?: string } {
  const sanitized = sanitizeInput(city);
  
  if (!sanitized) {
    return { isValid: false, sanitized: '', error: 'Nom de ville requis' };
  }
  
  if (sanitized.length < 2) {
    return { isValid: false, sanitized, error: 'Nom de ville trop court' };
  }
  
  if (!PATTERNS.cityName.test(sanitized)) {
    return { isValid: false, sanitized, error: 'Caractères non autorisés' };
  }
  
  return { isValid: true, sanitized };
}

// Validation des coordonnées
export function validateCoordinates(lat: number, lon: number): { isValid: boolean; error?: string } {
  if (typeof lat !== 'number' || typeof lon !== 'number') {
    return { isValid: false, error: 'Coordonnées invalides' };
  }
  
  if (lat < -90 || lat > 90) {
    return { isValid: false, error: 'Latitude hors limites (-90 à 90)' };
  }
  
  if (lon < -180 || lon > 180) {
    return { isValid: false, error: 'Longitude hors limites (-180 à 180)' };
  }
  
  return { isValid: true };
}

// Validation des requêtes API
export function validateApiRequest(request: Request): { isValid: boolean; error?: string } {
  // Vérifier le Content-Type
  const contentType = request.headers.get('content-type');
  if (contentType && !contentType.includes('application/json')) {
    // Autoriser aussi les requêtes sans body
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return { isValid: false, error: 'Content-Type non supporté' };
    }
  }
  
  // Vérifier la taille du body (limite à 1MB)
  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength) > 1024 * 1024) {
    return { isValid: false, error: 'Body trop volumineux' };
  }
  
  return { isValid: true };
}

// Validation du code pays
export function validateCountryCode(code: string): boolean {
  if (!code || typeof code !== 'string') return false;
  return PATTERNS.countryCode.test(code.trim().toUpperCase());
}

// Rate limiting simple (pour usage côté serveur)
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

export function checkRateLimit(identifier: string, maxRequests: number = 100, windowMs: number = 60000): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);
  
  if (!entry || now > entry.resetTime) {
    // Nouvelle fenêtre
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { allowed: true, remaining: maxRequests - 1, resetTime: now + windowMs };
  }
  
  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetTime: entry.resetTime };
  }
  
  entry.count++;
  return { allowed: true, remaining: maxRequests - entry.count, resetTime: entry.resetTime };
}

// Nettoyer les entrées expirées du rate limit (appeler périodiquement)
export function cleanupRateLimit(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}
