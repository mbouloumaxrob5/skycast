'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, X, Star, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useDebounce } from '@/hooks/useDebounce';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { City } from '@/types/weather';
import { searchCities } from '@/lib/api/geocodingService';

interface HeaderProps {
  onCitySelect: (city: City) => void;
  onGeolocate: () => void;
  isGeolocating?: boolean;
  selectedCity: City | null;
  alertBadge?: React.ReactNode;
}

export function Header({ onCitySelect, onGeolocate, isGeolocating, selectedCity, alertBadge }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const debouncedQuery = useDebounce(searchQuery, 300);
  
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  
  const [searchError, setSearchError] = useState<string | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions = useCallback(async () => {
    if (!debouncedQuery || debouncedQuery.length < 2 || !apiKey) {
      setSuggestions([]);
      setSearchError(null);
      return;
    }
    
    setIsSearching(true);
    setSearchError(null);
    try {
      const cities = await searchCities(debouncedQuery, apiKey);
      setSuggestions(cities);
      setHighlightedIndex(-1);
    } catch {
      setSuggestions([]);
      setSearchError('Erreur de recherche. Vérifiez votre connexion.');
    } finally {
      setIsSearching(false);
    }
  }, [debouncedQuery, apiKey]);
  
  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);
  
  const handleSelect = (city: City) => {
    onCitySelect(city);
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };
  
  const clearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSearchError(null);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  // Fermer au clic extérieur
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Navigation clavier
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          handleSelect(suggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        inputRef.current?.blur();
        break;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-black/20 dark:bg-black/20 light:bg-white/70 border-b border-white/10 dark:border-white/10 light:border-gray-200/50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-400 to-cyan-300 flex items-center justify-center">
              <span className="text-xl">☁️</span>
            </div>
            <h1 className="text-xl font-bold text-white dark:text-white light:text-gray-900 hidden sm:block">SkyCast</h1>
          </div>
          
          {alertBadge && (
            <div className="hidden sm:block">
              {alertBadge}
            </div>
          )}
          
          <div className="flex-1 relative" ref={containerRef}>
            <div className="relative">
              {isSearching ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                >
                  <Loader2 size={18} className="text-white/50 dark:text-white/50 light:text-gray-400" />
                </motion.div>
              ) : (
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 dark:text-white/50 light:text-gray-400" size={18} />
              )}
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                  setSearchError(null);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
                placeholder="Rechercher une ville... (ex: Paris, Tokyo)"
                aria-label="Rechercher une ville"
                className={cn(
                  "w-full pl-10 pr-10 py-2.5 rounded-xl",
                  "bg-white/10 dark:bg-white/10 light:bg-white/80",
                  "border border-white/20 dark:border-white/20 light:border-gray-300",
                  "text-white dark:text-white light:text-gray-900",
                  "placeholder:text-white/50 dark:placeholder:text-white/50 light:placeholder:text-gray-400",
                  "focus:outline-none focus:ring-2 focus:ring-blue-400/50",
                  "transition-all duration-200"
                )}
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 dark:text-white/50 light:text-gray-400 hover:text-white dark:hover:text-white light:hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            
            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 py-2 rounded-xl bg-slate-900/95 dark:bg-slate-900/95 light:bg-white/95 backdrop-blur-xl border border-white/20 dark:border-white/20 light:border-gray-200 shadow-2xl z-50 max-h-72 overflow-y-auto"
                  role="listbox"
                >
                  {isSearching && (
                    <div className="px-4 py-3 text-white/50 dark:text-white/50 light:text-gray-500 text-sm flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Recherche en cours...
                    </div>
                  )}
                  
                  {searchError && (
                    <div className="px-4 py-3 text-red-300 dark:text-red-300 light:text-red-600 text-sm">
                      {searchError}
                    </div>
                  )}
                  
                  {!isSearching && !searchError && suggestions.length === 0 && debouncedQuery.length >= 2 && (
                    <div className="px-4 py-3 text-white/50 dark:text-white/50 light:text-gray-500 text-sm">
                      Aucune ville trouvée pour &ldquo;{debouncedQuery}&rdquo;
                    </div>
                  )}
                  
                  {suggestions.map((city, index) => (
                    <button
                      key={`${city.name}-${city.lat}-${city.lon}-${index}`}
                      onClick={() => handleSelect(city)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      className={cn(
                        "w-full px-4 py-2.5 text-left flex items-center gap-3 transition-colors",
                        index === highlightedIndex 
                          ? 'bg-white/20 dark:bg-white/20 light:bg-blue-100' 
                          : 'hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-gray-100'
                      )}
                      role="option"
                      aria-selected={index === highlightedIndex}
                    >
                      <MapPin size={16} className="text-white/50 dark:text-white/50 light:text-gray-400" />
                      <div>
                        <p className="text-white dark:text-white light:text-gray-900 font-medium">{city.name}</p>
                        <p className="text-white/50 dark:text-white/50 light:text-gray-500 text-sm">
                          {city.state ? `${city.state}, ` : ''}{city.country}
                        </p>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onGeolocate}
            disabled={isGeolocating}
            className={cn(
              "p-2.5 rounded-xl",
              "bg-white/10 dark:bg-white/10 light:bg-white/80 border border-white/20 dark:border-white/20 light:border-gray-300",
              "text-white dark:text-white light:text-gray-700 hover:bg-white/20 dark:hover:bg-white/20 light:hover:bg-gray-100",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "transition-colors"
            )}
            title="Ma position"
          >
            <motion.div
              animate={isGeolocating ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 1, repeat: isGeolocating ? Infinity : 0, ease: 'linear' }}
            >
              <MapPin size={20} />
            </motion.div>
          </motion.button>
          
          <ThemeToggle />
        </div>
        
        {selectedCity && (
          <div className="mt-3 flex items-center gap-2 text-sm text-white/70 dark:text-white/70 light:text-gray-600">
            <Star size={14} />
            <span>{selectedCity.name}, {selectedCity.country}</span>
          </div>
        )}
      </div>
    </header>
  );
}
