import { CurrentWeather, ForecastData, ForecastDay, ForecastItem, City } from '@/types/weather';

const GEO_BASE = 'https://api.openweathermap.org/geo/1.0';

interface OpenWeatherItem {
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  pop?: number;
}

interface OpenWeatherForecast {
  city: {
    name: string;
    country: string;
  };
  list: OpenWeatherItem[];
}

interface OpenWeatherCurrent {
  name: string;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  visibility: number;
  uvi?: number;
  weather: Array<{
    description: string;
    icon: string;
    id: number;
  }>;
}

export class WeatherAPIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'WeatherAPIError';
  }
}

async function fetchWithProxy(endpoint: string, params: Record<string, string>) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`/api/weather?endpoint=${endpoint}&${query}`);
  
  if (!res.ok) {
    throw new WeatherAPIError(res.status, 'Erreur lors de la récupération des données météo');
  }
  
  return res.json();
}

export function transformCurrentWeather(raw: OpenWeatherCurrent): CurrentWeather {
  return {
    city: raw.name,
    country: raw.sys.country,
    temperature: Math.round(raw.main.temp),
    feelsLike: Math.round(raw.main.feels_like),
    humidity: raw.main.humidity,
    pressure: raw.main.pressure,
    windSpeed: raw.wind.speed,
    windDeg: raw.wind.deg,
    visibility: raw.visibility / 1000,
    uvi: raw.uvi || 0,
    sunrise: formatTime(raw.sys.sunrise),
    sunset: formatTime(raw.sys.sunset),
    description: raw.weather[0].description,
    icon: raw.weather[0].icon,
    conditionId: raw.weather[0].id,
    timestamp: Date.now(),
  };
}

export function transformForecast(raw: OpenWeatherForecast): ForecastData {
  const dailyData: { [key: string]: OpenWeatherItem[] } = {};
  
  raw.list.forEach((item) => {
    const date = item.dt_txt.split(' ')[0];
    if (!dailyData[date]) {
      dailyData[date] = [];
    }
    dailyData[date].push(item);
  });
  
  const days: ForecastDay[] = Object.entries(dailyData)
    .slice(0, 5)
    .map(([date, items]) => {
      const temps = items.map((i) => i.main.temp);
      const midDayItem = items.find((i) => i.dt_txt.includes('12:00')) || items[Math.floor(items.length / 2)];
      
      return {
        date,
        dayName: formatShortDayName(midDayItem.dt),
        icon: midDayItem.weather[0].icon,
        tempMin: Math.round(Math.min(...temps)),
        tempMax: Math.round(Math.max(...temps)),
        description: midDayItem.weather[0].description,
        humidity: Math.round(items.reduce((acc: number, i) => acc + i.main.humidity, 0) / items.length),
        windSpeed: Math.round(items.reduce((acc: number, i) => acc + i.wind.speed, 0) / items.length),
        pop: Math.max(...items.map((i) => i.pop || 0)),
      };
    });
  
  // Extraire les données horaires (8 prochaines prévisions = 24h)
  const hourly: ForecastItem[] = raw.list.slice(0, 8).map(item => ({
    dt: item.dt,
    main: {
      temp: item.main.temp,
      feels_like: item.main.temp, // Simplifié
      humidity: item.main.humidity,
      pressure: 0, // Non utilisé
    },
    weather: item.weather.map(w => ({
      id: 0,
      main: w.description,
      description: w.description,
      icon: w.icon,
    })),
    wind: {
      speed: item.wind.speed,
      deg: 0, // Non utilisé
    },
    visibility: 0,
    pop: item.pop || 0,
    dt_txt: item.dt_txt,
  }));

  return {
    city: raw.city.name,
    country: raw.city.country,
    days,
    hourly,
  };
}

function formatTime(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatShortDayName(timestamp: number): string {
  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  return days[new Date(timestamp * 1000).getDay()];
}

export const weatherService = {
  async getCurrent(lat: number, lon: number): Promise<CurrentWeather> {
    const raw = await fetchWithProxy('weather', { lat: String(lat), lon: String(lon) });
    return transformCurrentWeather(raw);
  },
  
  async getForecast(lat: number, lon: number): Promise<ForecastData> {
    const raw = await fetchWithProxy('forecast', { lat: String(lat), lon: String(lon) });
    return transformForecast(raw);
  },
  
  async searchCities(query: string): Promise<City[]> {
    if (!query.trim() || query.length < 2) return [];
    
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    const res = await fetch(
      `${GEO_BASE}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${apiKey}`
    );
    
    if (!res.ok) {
      throw new WeatherAPIError(res.status, 'Erreur lors de la recherche de villes');
    }
    
    return res.json();
  },
};
