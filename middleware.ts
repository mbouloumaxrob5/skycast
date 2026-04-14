import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Configuration CSP stricte
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.rainviewer.com https://tile.openweathermap.org;
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https://openweathermap.org https://tile.openweathermap.org https://www.rainviewer.com;
  font-src 'self';
  connect-src 'self' https://api.openweathermap.org https://tile.openweathermap.org;
  media-src 'self';
  object-src 'none';
  frame-src https://www.rainviewer.com;
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, ' ').trim();

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Security Headers essentiels
  const headers = response.headers;

  // Content Security Policy
  headers.set('Content-Security-Policy', ContentSecurityPolicy);

  // X-Frame-Options - Empêche le clickjacking
  headers.set('X-Frame-Options', 'DENY');

  // X-Content-Type-Options - Empêche le MIME sniffing
  headers.set('X-Content-Type-Options', 'nosniff');

  // X-XSS-Protection
  headers.set('X-XSS-Protection', '1; mode=block');

  // Referrer-Policy
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions-Policy
  headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(self), browsing-topics=()'
  );

  // HSTS - Force HTTPS
  headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );

  // Cache-Control pour les pages dynamiques
  if (request.nextUrl.pathname.startsWith('/api')) {
    headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');
  }

  // Remove potentially dangerous headers
  headers.delete('X-Powered-By');
  headers.delete('Server');

  return response;
}

// Configurer le middleware pour s'appliquer à toutes les routes
export const config = {
  matcher: [
    '/',
    '/((?!_next/static|_next/image|favicon.ico|api/health).*)',
  ],
};
