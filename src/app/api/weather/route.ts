import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIP } from '@/lib/security/rateLimit';
import { validateCityName, validateCoordinates, validateApiRequest } from '@/lib/security/validation';
import { weatherLogger } from '@/lib/utils/logger';

// Configuration des limites
const RATE_LIMIT_MAX = 60; // 60 requêtes par minute
const RATE_LIMIT_WINDOW = 60000; // 1 minute

export async function GET(request: NextRequest) {
  // 1. Rate Limiting
  const clientIP = getClientIP(request);
  const rateLimit = checkRateLimit(`weather:${clientIP}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW);
  
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { 
        error: 'Trop de requêtes',
        retryAfter: rateLimit.retryAfter 
      },
      { 
        status: 429,
        headers: {
          'Retry-After': String(rateLimit.retryAfter),
          'X-RateLimit-Limit': String(rateLimit.limit),
          'X-RateLimit-Remaining': String(rateLimit.remaining),
          'X-RateLimit-Reset': String(rateLimit.resetTime),
        }
      }
    );
  }

  // 2. Validation de la requête
  const validation = validateApiRequest(request);
  if (!validation.isValid) {
    return NextResponse.json(
      { error: validation.error },
      { status: 400 }
    );
  }

  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');
  
  // 3. Validation et sanitization des paramètres
  const city = searchParams.get('q');
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  
  if (city) {
    const cityValidation = validateCityName(city);
    if (!cityValidation.isValid) {
      return NextResponse.json(
        { error: cityValidation.error },
        { status: 400 }
      );
    }
    // Remplacer par la valeur sanitizée
    searchParams.set('q', cityValidation.sanitized);
  }
  
  if (lat && lon) {
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    const coordValidation = validateCoordinates(latNum, lonNum);
    
    if (!coordValidation.isValid) {
      return NextResponse.json(
        { error: coordValidation.error },
        { status: 400 }
      );
    }
  }

  // 4. Vérification de l'API key (uniquement côté serveur)
  const apiKey = process.env.OPENWEATHER_API_KEY;
  
  if (!apiKey) {
    // Ne jamais exposer NEXT_PUBLIC_ en production
    weatherLogger.error('[API Weather] OPENWEATHER_API_KEY manquante');
    return NextResponse.json(
      { error: 'Service temporairement indisponible' },
      { status: 503 }
    );
  }
  
  if (!endpoint || !['weather', 'forecast'].includes(endpoint)) {
    return NextResponse.json(
      { error: 'Endpoint invalide' },
      { status: 400 }
    );
  }
  
  // Supprimer tous les paramètres potentiellement dangereux
  const dangerousParams = ['appid', 'apikey', 'key', 'token', 'secret'];
  dangerousParams.forEach(param => searchParams.delete(param));
  
  // Ajouter les paramètres sécurisés
  searchParams.append('appid', apiKey);
  searchParams.append('units', 'metric');
  searchParams.append('lang', 'fr');
  
  const url = `https://api.openweathermap.org/data/2.5/${endpoint}?${searchParams}`;
  
  try {
    const res = await fetch(url, { 
      next: { revalidate: 300 },
      headers: { 'Accept': 'application/json' }
    });
    
    if (!res.ok) {
      const error = await res.json();
      return NextResponse.json(
        { error: error.message || 'Erreur API météo' },
        { status: res.status }
      );
    }
    
    const data = await res.json();
    return NextResponse.json(data);
    
  } catch (error) {
    weatherLogger.error('[API Weather] Erreur:', { error });
    return NextResponse.json(
      { error: 'Erreur de connexion' },
      { status: 503 }
    );
  }
}
