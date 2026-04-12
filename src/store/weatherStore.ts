import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FavoriteCity, City } from '@/types/weather';

interface WeatherState {
  selectedCity: City | null;
  favorites: FavoriteCity[];
  lastSearched: City | null;
  
  setSelectedCity: (city: City | null) => void;
  addToFavorites: (city: City) => void;
  removeFromFavorites: (cityId: string) => void;
  isFavorite: (lat: number, lon: number) => boolean;
  setLastSearched: (city: City) => void;
  clearLastSearched: () => void;
}

function generateCityId(city: City): string {
  return `${city.name}-${city.country}-${city.lat.toFixed(2)}-${city.lon.toFixed(2)}`;
}

export const useWeatherStore = create<WeatherState>()(
  persist(
    (set, get) => ({
      selectedCity: null,
      favorites: [],
      lastSearched: null,
      
      setSelectedCity: (city) => set({ selectedCity: city }),
      
      addToFavorites: (city) => {
        const id = generateCityId(city);
        const favorites = get().favorites;
        
        if (favorites.some(f => f.id === id)) return;
        if (favorites.length >= 5) {
          favorites.pop();
        }
        
        set({
          favorites: [{ ...city, id }, ...favorites],
        });
      },
      
      removeFromFavorites: (cityId) => {
        set({
          favorites: get().favorites.filter(f => f.id !== cityId),
        });
      },
      
      isFavorite: (lat, lon) => {
        return get().favorites.some(
          f => Math.abs(f.lat - lat) < 0.01 && Math.abs(f.lon - lon) < 0.01
        );
      },
      
      setLastSearched: (city) => set({ lastSearched: city }),
      clearLastSearched: () => set({ lastSearched: null }),
    }),
    {
      name: 'skycast-storage',
      partialize: (state) => ({ favorites: state.favorites, lastSearched: state.lastSearched }),
    }
  )
);
