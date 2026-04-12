import { City } from '@/types/weather';

const GEO_BASE = 'https://api.openweathermap.org/geo/1.0';

export async function searchCities(query: string, apiKey: string): Promise<City[]> {
  if (!query.trim() || query.length < 2) return [];
  
  const res = await fetch(
    `${GEO_BASE}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${apiKey}`
  );
  
  if (!res.ok) {
    throw new Error('Erreur lors de la recherche de villes');
  }
  
  const cities: City[] = await res.json();
  
  // Dédoublonner les villes (même nom + pays + coordonnées arrondies à 2 décimales)
  const seen = new Set<string>();
  return cities.filter(city => {
    const key = `${city.name}-${city.country}-${Math.round(city.lat * 100) / 100}-${Math.round(city.lon * 100) / 100}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function reverseGeocode(lat: number, lon: number, apiKey: string): Promise<City | null> {
  const res = await fetch(
    `${GEO_BASE}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`
  );
  
  if (!res.ok) {
    throw new Error('Erreur lors de la géolocalisation inverse');
  }
  
  const data = await res.json();
  return data[0] || null;
}
