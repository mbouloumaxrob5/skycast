import { format, fromUnixTime } from 'date-fns';
import { fr } from 'date-fns/locale';

export function formatTemperature(temp: number): string {
  return `${Math.round(temp)}°`;
}

export function formatTime(timestamp: number): string {
  return format(fromUnixTime(timestamp), 'HH:mm', { locale: fr });
}

export function formatDate(timestamp: number): string {
  return format(fromUnixTime(timestamp), 'EEEE d MMMM yyyy', { locale: fr });
}

export function formatShortDate(timestamp: number): string {
  return format(fromUnixTime(timestamp), 'EEE', { locale: fr });
}

export function formatWindSpeed(speed: number): string {
  return `${Math.round(speed * 3.6)} km/h`;
}

export function formatVisibility(visibility: number): string {
  return `${(visibility / 1000).toFixed(1)} km`;
}

export function formatPressure(pressure: number): string {
  return `${pressure} hPa`;
}

export function formatHumidity(humidity: number): string {
  return `${humidity}%`;
}

export function getWindDirection(deg: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
}
