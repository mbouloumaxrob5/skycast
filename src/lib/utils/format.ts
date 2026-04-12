export const format = {
  date: (date: Date): string => {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(date);
  },
  
  time: (date: Date): string => {
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  },
  
  shortTime: (date: Date): string => {
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  },
  
  day: (date: Date): string => {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'short',
      day: 'numeric',
    }).format(date);
  },
  
  temp: (temp: number): string => `${Math.round(temp)}°`,
  
  wind: (speed: number): string => `${Math.round(speed * 3.6)} km/h`,
  
  humidity: (value: number): string => `${value}%`,
  
  pressure: (value: number): string => `${value} hPa`,
  
  visibility: (value: number): string => `${(value / 1000).toFixed(1)} km`,
};
