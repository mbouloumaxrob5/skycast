'use client';

import { useMemo } from 'react';
import { CurrentWeather, WeatherAlert } from '@/types/weather';

export function useWeatherAlerts(weather: CurrentWeather | null): WeatherAlert[] {
  return useMemo(() => {
    if (!weather) return [];

    const alerts: WeatherAlert[] = [];
    const { conditionId, temperature, windSpeed, humidity } = weather;

    // Orage (200-299)
    if (conditionId >= 200 && conditionId < 300) {
      alerts.push({
        id: 'thunderstorm',
        type: 'severe',
        title: '⚡ Orage en cours',
        message: 'Foudre et vents violents. Restez à l\'intérieur.',
        icon: 'cloud-lightning',
        color: '#DC2626',
      });
    }

    // Pluie forte (>= 500mm ou condition 502, 503, 504)
    if (conditionId === 502 || conditionId === 503 || conditionId === 504) {
      alerts.push({
        id: 'heavy-rain',
        type: 'warning',
        title: '🌧️ Pluie forte',
        message: 'Précipitations intenses. Routes glissantes.',
        icon: 'cloud-rain',
        color: '#F59E0B',
      });
    }

    // Neige/verglas (600-699)
    if (conditionId >= 600 && conditionId < 700) {
      alerts.push({
        id: 'snow',
        type: 'warning',
        title: '❄️ Conditions hivernales',
        message: 'Neige ou verglas. Conduite dangereuse.',
        icon: 'snowflake',
        color: '#3B82F6',
      });
    }

    // Canicule (> 35°C)
    if (temperature > 35) {
      alerts.push({
        id: 'heat',
        type: 'warning',
        title: '🌡️ Canicule',
        message: `Température extrême (${Math.round(temperature)}°C). Hydratez-vous !`,
        icon: 'sun',
        color: '#EF4444',
      });
    }

    // Froid extrême (< -10°C)
    if (temperature < -10) {
      alerts.push({
        id: 'cold',
        type: 'warning',
        title: '🥶 Froid extrême',
        message: `Risque de gelures. Couvrez-vous bien !`,
        icon: 'thermometer-snowflake',
        color: '#06B6D4',
      });
    }

    // Vent violent (> 50 km/h = ~14 m/s)
    if (windSpeed > 14) {
      alerts.push({
        id: 'wind',
        type: 'warning',
        title: '💨 Vent violent',
        message: `Vents de ${Math.round(windSpeed * 3.6)} km/h. Attention aux objets volants.`,
        icon: 'wind',
        color: '#8B5CF6',
      });
    }

    // Brouillard dense (741)
    if (conditionId === 741) {
      alerts.push({
        id: 'fog',
        type: 'info',
        title: '🌫️ Brouillard dense',
        message: 'Visibilité réduite. Allumez vos feux.',
        icon: 'cloud-fog',
        color: '#64748B',
      });
    }

    return alerts;
  }, [weather]);
}
