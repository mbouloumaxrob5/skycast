export interface Coordinates {
  lat: number;
  lon: number;
}

export interface City {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

export interface CurrentWeather {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDeg: number;
  visibility: number;
  uvi: number;
  sunrise: string;
  sunset: string;
  description: string;
  icon: string;
  conditionId: number;
  timestamp: number;
}

export interface ForecastDay {
  date: string;
  dayName: string;
  icon: string;
  tempMin: number;
  tempMax: number;
  description: string;
  humidity: number;
  windSpeed: number;
  pop: number;
}

export interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  visibility: number;
  pop: number;
  dt_txt: string;
}

export interface ForecastData {
  city: string;
  country: string;
  days: ForecastDay[];
  hourly?: ForecastItem[];
}

export interface WeatherTheme {
  name: string;
  gradient: string;
  accent: string;
  text: string;
  icon: string;
}

export interface WeatherAlert {
  id: string;
  type: 'info' | 'warning' | 'severe';
  title: string;
  message: string;
  icon: string;
  color: string;
}

export interface FavoriteCity {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  current?: CurrentWeather;
}

export type WeatherCondition = 
  | 'clear'
  | 'clouds'
  | 'rain'
  | 'drizzle'
  | 'thunderstorm'
  | 'snow'
  | 'mist'
  | 'night-clear'
  | 'night-clouds';

export interface DetailItem {
  icon: string;
  label: string;
  value: string | number;
  unit?: string;
}
