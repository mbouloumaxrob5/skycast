'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, X, Star, Loader2, Settings } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { useDebounce } from '@/hooks/useDebounce';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { PushNotificationToggle } from '@/components/ui/PushNotificationToggle';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { City } from '@/types/weather';
import { useTranslations } from 'next-intl';
import { searchCities } from '@/lib/api/geocodingService';

interface HeaderProps {
  onCitySelect?: (city: City) => void;
  onGeolocate?: () => void;
  isGeolocating?: boolean;
  selectedCity?: City | null;
  alertBadge?: React.ReactNode;
  hideSearch?: boolean;
}

export function Header({ onCitySelect, onGeolocate, isGeolocating, selectedCity, alertBadge }: HeaderProps) {
  const t = useTranslations('header');
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
      setSearchError(t('searchError'));
    } finally {
      setIsSearching(false);
    }
  }, [debouncedQuery, apiKey, t]);
  
  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);
  
  const handleSelect = (city: City) => {
    onCitySelect?.(city);
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
          <motion.div 
            className="flex items-center gap-3 group cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <div className="relative w-12 h-12 rounded-2xl bg-linear-to-br from-sky-400 via-blue-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-500/30 overflow-hidden ring-2 ring-white/20 ring-offset-2 ring-offset-transparent">
              {/* Animated gradient background */}
              <motion.div
                className="absolute inset-0 bg-linear-to-br from-cyan-300/60 via-blue-400/40 to-transparent"
                animate={{ 
                  opacity: [0.4, 0.7, 0.4],
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              {/* Rotating shine effect */}
              <motion.div
                className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent"
                animate={{ 
                  rotate: [0, 360],
                }}
                transition={{ 
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{ transformOrigin: "center" }}
              />
              <motion.span 
                className="relative text-2xl drop-shadow-lg"
                animate={{ 
                  y: [0, -2, 0],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                ☁️
              </motion.span>
            </div>
            <div className="hidden sm:flex flex-col">
              <motion.h1 
                className="text-xl font-bold bg-linear-to-r from-white to-white/80 bg-clip-text text-transparent tracking-tight leading-tight"
                whileHover={{ x: 2 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                SkyCast
              </motion.h1>
              <span className="text-[10px] text-white/50 dark:text-white/50 light:text-slate-500 uppercase tracking-widest font-semibold">
                Weather
              </span>
            </div>
          </motion.div>
          
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
                placeholder={t('searchPlaceholder')}
                aria-label={t('searchPlaceholder')}
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
                      {t('searching')}
                    </div>
                  )}
                  
                  {searchError && (
                    <div className="px-4 py-3 text-red-300 dark:text-red-300 light:text-red-600 text-sm">
                      {searchError}
                    </div>
                  )}
                  
                  {!isSearching && !searchError && suggestions.length === 0 && debouncedQuery.length >= 2 && (
                    <div className="px-4 py-3 text-white/50 dark:text-white/50 light:text-gray-500 text-sm">
                      {t('noResults', { query: debouncedQuery })}
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
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onGeolocate?.()}
            disabled={isGeolocating}
            className={cn(
              "p-2.5 rounded-xl",
              "bg-white/10 dark:bg-white/10 light:bg-white/80",
              "border border-white/20 dark:border-white/20 light:border-slate-200",
              "text-white dark:text-white light:text-slate-700",
              "hover:border-white/40 dark:hover:border-white/40 light:hover:border-slate-300",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "transition-all duration-200",
              "shadow-sm"
            )}
            title={t('myLocation')}
          >
            <motion.div
              animate={isGeolocating ? { 
                rotate: 360,
                scale: [1, 1.1, 1]
              } : { rotate: 0 }}
              transition={{ duration: 1, repeat: isGeolocating ? Infinity : 0, ease: 'linear' }}
            >
              <MapPin size={20} />
            </motion.div>
          </motion.button>
          
          <LanguageSwitcher />
          <PushNotificationToggle />
          <ThemeToggle />
          
          {/* Settings Link */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/settings"
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-xl",
                "bg-white/10 dark:bg-white/10 light:bg-white/80",
                "border border-white/20 dark:border-white/20 light:border-slate-200",
                "text-white dark:text-white light:text-slate-700",
                "hover:bg-white/20 dark:hover:bg-white/20 light:hover:bg-white/90",
                "hover:border-white/40 dark:hover:border-white/40 light:hover:border-slate-300",
                "transition-all duration-200",
                "shadow-sm"
              )}
              title="Paramètres"
            >
              <Settings size={20} />
            </Link>
          </motion.div>
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
