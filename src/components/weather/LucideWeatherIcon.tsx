'use client';

import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudLightning, 
  CloudSnow, 
  CloudFog,
  CloudDrizzle,
  Moon,
  CloudMoon,
} from 'lucide-react';

interface WeatherIconProps {
  icon: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const dimensions = {
  sm: 24,
  md: 40,
  lg: 64,
  xl: 96,
};

export function WeatherIcon({ icon, size = 'md', className = '' }: WeatherIconProps) {
  const sizeValue = dimensions[size];
  
  // Couleur basée sur le type d'icône
  const getColorClass = () => {
    if (icon.includes('01')) return 'text-yellow-400'; // Soleil/Lune
    if (icon.includes('13')) return 'text-blue-200';   // Neige
    if (icon.includes('11')) return 'text-purple-400'; // Orage
    if (icon.includes('10') || icon.includes('09')) return 'text-blue-400'; // Pluie
    if (icon.includes('50')) return 'text-gray-400';  // Brouillard
    return 'text-white/80'; // Nuages
  };
  
  const colorClass = getColorClass();
  const iconProps = { size: sizeValue, className: colorClass, strokeWidth: 1.5 };
  
  // Rendu conditionnel des icônes (pas de création dynamique de composant)
  // Ciel dégagé jour
  if (icon === '01d') return <div className={`flex items-center justify-center ${className}`}><Sun {...iconProps} /></div>;
  // Ciel dégagé nuit
  if (icon === '01n') return <div className={`flex items-center justify-center ${className}`}><Moon {...iconProps} /></div>;
  // Nuages
  if (icon === '02d' || icon === '03d' || icon === '04d') return <div className={`flex items-center justify-center ${className}`}><Cloud {...iconProps} /></div>;
  // Nuages nuit
  if (icon === '02n' || icon === '03n' || icon === '04n') return <div className={`flex items-center justify-center ${className}`}><CloudMoon {...iconProps} /></div>;
  // Bruine
  if (icon === '09d' || icon === '09n') return <div className={`flex items-center justify-center ${className}`}><CloudDrizzle {...iconProps} /></div>;
  // Pluie
  if (icon === '10d' || icon === '10n') return <div className={`flex items-center justify-center ${className}`}><CloudRain {...iconProps} /></div>;
  // Orage
  if (icon === '11d' || icon === '11n') return <div className={`flex items-center justify-center ${className}`}><CloudLightning {...iconProps} /></div>;
  // Neige
  if (icon === '13d' || icon === '13n') return <div className={`flex items-center justify-center ${className}`}><CloudSnow {...iconProps} /></div>;
  // Brouillard
  if (icon === '50d' || icon === '50n') return <div className={`flex items-center justify-center ${className}`}><CloudFog {...iconProps} /></div>;
  
  // Fallback
  return <div className={`flex items-center justify-center ${className}`}><Cloud {...iconProps} /></div>;
}
