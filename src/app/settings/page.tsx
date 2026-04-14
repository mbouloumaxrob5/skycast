'use client';

import { motion } from 'framer-motion';
import { 
  Settings, 
  Moon, 
  Sun, 
  Monitor, 
  Bell, 
  Globe, 
  Shield, 
  Database,
  ArrowLeft,
  Trash2,
  RotateCcw
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { useThemeStore } from '@/store/themeStore';
import { useAnalyticsStore } from '@/store/analyticsStore';
import { useState } from 'react';

type ThemeMode = 'dark' | 'light' | 'system';

interface SettingSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function SettingSection({ title, icon, children }: SettingSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="rounded-2xl bg-linear-to-br from-white/10 to-white/5 border border-white/15 backdrop-blur-xl overflow-hidden shadow-xl shadow-black/10 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 group"
    >
      <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-linear-to-r from-white/5 to-transparent">
        <motion.div 
          className="p-2.5 rounded-xl bg-linear-to-br from-blue-500/20 to-indigo-500/20 border border-blue-400/20 shadow-lg shadow-blue-500/10"
          whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
          transition={{ duration: 0.5 }}
        >
          {icon}
        </motion.div>
        <h2 className="text-lg font-semibold text-white tracking-tight">{title}</h2>
      </div>
      <div className="p-4 space-y-2">
        {children}
      </div>
    </motion.div>
  );
}

interface SettingItemProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  action: React.ReactNode;
}

function SettingItem({ icon, label, description, action }: SettingItemProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-white/5 text-white/60 group-hover:text-white transition-colors">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-white">{label}</p>
          {description && (
            <p className="text-xs text-white/50">{description}</p>
          )}
        </div>
      </div>
      {action}
    </div>
  );
}

function ThemeToggle() {
  const { mode, setMode } = useThemeStore();
  
  const themes: { value: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Clair', icon: <Sun className="w-4 h-4" /> },
    { value: 'dark', label: 'Sombre', icon: <Moon className="w-4 h-4" /> },
    { value: 'system', label: 'Système', icon: <Monitor className="w-4 h-4" /> },
  ];

  return (
    <div className="flex bg-white/5 rounded-xl p-1">
      {themes.map((theme) => (
        <button
          key={theme.value}
          onClick={() => setMode(theme.value)}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
            mode === theme.value
              ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
              : 'text-white/60 hover:text-white'
          )}
        >
          {theme.icon}
          {theme.label}
        </button>
      ))}
    </div>
  );
}

function LanguageSelector() {
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');
  
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setLanguage('fr')}
        className={cn(
          'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
          language === 'fr'
            ? 'bg-blue-500 text-white'
            : 'bg-white/5 text-white/60 hover:bg-white/10'
        )}
      >
        🇫🇷 FR
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={cn(
          'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
          language === 'en'
            ? 'bg-blue-500 text-white'
            : 'bg-white/5 text-white/60 hover:bg-white/10'
        )}
      >
        🇬🇧 EN
      </button>
    </div>
  );
}

function ToggleSwitch({ 
  checked, 
  onChange 
}: { 
  checked: boolean; 
  onChange: (checked: boolean) => void 
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        'relative w-11 h-6 rounded-full transition-colors duration-300',
        checked ? 'bg-blue-500' : 'bg-white/20'
      )}
    >
      <motion.div
        className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-md"
        animate={{ x: checked ? 20 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  useAnalyticsStore(); // Hook pour accès au store si nécessaire

  const handleReset = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser toutes les données ?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-indigo-950 overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 backdrop-blur-2xl bg-slate-950/60 border-b border-white/10"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div className="flex items-center gap-4" whileHover={{ scale: 1.02 }}>
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500/30 blur-xl rounded-2xl animate-pulse" />
                <div className="relative p-3 rounded-2xl bg-linear-to-br from-indigo-500/20 to-purple-500/20 border border-white/20 backdrop-blur-sm">
                  <Settings className="w-7 h-7 text-indigo-400" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-linear-to-r from-white to-white/70 bg-clip-text text-transparent">
                  Paramètres
                </h1>
                <p className="text-sm text-white/50">
                  Personnalisez votre expérience
                </p>
              </div>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/"
                className={cn(
                  'flex items-center gap-2 px-5 py-2.5 rounded-xl',
                  'bg-white/5 hover:bg-white/10 border border-white/10',
                  'text-white/80 hover:text-white text-sm font-medium',
                  'transition-all duration-300 backdrop-blur-sm',
                  'hover:border-white/20 hover:shadow-lg hover:shadow-white/5'
                )}
              >
                <ArrowLeft className="w-4 h-4" />
                Retour
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Apparence */}
          <SettingSection title="Apparence" icon={<Moon className="w-5 h-5 text-indigo-400" />}>
            <SettingItem
              icon={<Monitor className="w-5 h-5" />}
              label="Thème"
              description="Choisissez votre préférence d'affichage"
              action={<ThemeToggle />}
            />
          </SettingSection>

          {/* Langue */}
          <SettingSection title="Langue" icon={<Globe className="w-5 h-5 text-emerald-400" />}>
            <SettingItem
              icon={<Globe className="w-5 h-5" />}
              label="Langue de l'application"
              description="Français ou Anglais"
              action={<LanguageSelector />}
            />
          </SettingSection>

          {/* Notifications */}
          <SettingSection title="Notifications" icon={<Bell className="w-5 h-5 text-amber-400" />}>
            <SettingItem
              icon={<Bell className="w-5 h-5" />}
              label="Alertes météo"
              description="Recevoir des notifications pour les alertes"
              action={<ToggleSwitch checked={notifications} onChange={setNotifications} />}
            />
          </SettingSection>

          {/* Confidentialité */}
          <SettingSection title="Confidentialité" icon={<Shield className="w-5 h-5 text-rose-400" />}>
            <SettingItem
              icon={<Database className="w-5 h-5" />}
              label="Collecte d'analytics"
              description="Aider à améliorer l'application"
              action={<ToggleSwitch checked={analyticsEnabled} onChange={setAnalyticsEnabled} />}
            />
            <SettingItem
              icon={<Globe className="w-5 h-5" />}
              label="Géolocalisation"
              description="Accès à votre position"
              action={<ToggleSwitch checked={locationEnabled} onChange={setLocationEnabled} />}
            />
          </SettingSection>

          {/* Données */}
          <SettingSection title="Données" icon={<Database className="w-5 h-5 text-cyan-400" />}>
            <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20">
              <div className="flex items-start gap-3">
                <Trash2 className="w-5 h-5 text-rose-400 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-white">Réinitialiser les données</h3>
                  <p className="text-xs text-white/50 mt-1 mb-3">
                    Cette action supprimera toutes vos données locales : favoris, recherches, paramètres...
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleReset}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-medium',
                      'bg-rose-500/10 text-rose-400 border border-rose-500/20',
                      'hover:bg-rose-500/20 transition-colors',
                      'flex items-center gap-2'
                    )}
                  >
                    <RotateCcw className="w-4 h-4" />
                    Tout effacer
                  </motion.button>
                </div>
              </div>
            </div>
          </SettingSection>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center pt-8"
          >
            <p className="text-sm text-white/40">
              SkyCast v1.0.0 • Données stockées localement
            </p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <Link href="/about" className="text-sm text-white/40 hover:text-white/70 transition-colors">
                À propos
              </Link>
              <span className="text-white/20">•</span>
              <Link href="/privacy" className="text-sm text-white/40 hover:text-white/70 transition-colors">
                Confidentialité
              </Link>
              <span className="text-white/20">•</span>
              <Link href="/legal" className="text-sm text-white/40 hover:text-white/70 transition-colors">
                Mentions légales
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
