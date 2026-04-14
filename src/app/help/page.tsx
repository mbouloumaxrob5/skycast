'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, 
  Search, 
  MapPin, 
  Bell, 
  Shield,
  ArrowLeft,
  ChevronDown,
  MessageCircle,
  Mail,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { useState } from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

function FAQItem({ question, answer, isOpen, onClick }: FAQItemProps) {
  return (
    <motion.div
      className={cn(
        'rounded-xl border transition-colors overflow-hidden',
        isOpen 
          ? 'bg-white/10 border-white/20' 
          : 'bg-white/5 border-white/10 hover:border-white/20'
      )}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <span className="text-sm font-medium text-white pr-4">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-white/50" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 pb-4">
              <p className="text-sm text-white/60 leading-relaxed">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const faqs = [
  {
    category: 'Recherche',
    icon: Search,
    items: [
      {
        question: 'Comment rechercher une ville ?',
        answer: 'Utilisez la barre de recherche en haut de la page. Tapez le nom de la ville et sélectionnez-la dans la liste des suggestions. Vous pouvez aussi utiliser la géolocalisation pour votre position actuelle.'
      },
      {
        question: 'Les données météo sont-elles précises ?',
        answer: 'Les données proviennent de services météorologiques professionnels et sont mises à jour régulièrement. La précision dépend de la qualité des sources et de la proximité des stations météo.'
      }
    ]
  },
  {
    category: 'Favoris',
    icon: MapPin,
    items: [
      {
        question: 'Comment ajouter une ville aux favoris ?',
        answer: 'Après avoir recherché une ville, cliquez sur l\'icône cœur à côté du nom de la ville. Elle sera automatiquement ajoutée à votre liste de favoris accessible depuis la page d\'accueil.'
      },
      {
        question: 'Où sont stockées mes données ?',
        answer: 'Toutes vos données (favoris, paramètres, analytics) sont stockées localement dans votre navigateur via localStorage. Aucune donnée n\'est envoyée à nos serveurs.'
      }
    ]
  },
  {
    category: 'Notifications',
    icon: Bell,
    items: [
      {
        question: 'Comment activer les notifications ?',
        answer: 'Allez dans les paramètres de l\'application et activez "Alertes météo". Votre navigateur vous demandera ensuite la permission d\'envoyer des notifications.'
      },
      {
        question: 'Quelles alertes puis-je recevoir ?',
        answer: 'L\'application peut vous notifier en cas d\'alertes météorologiques importantes (tempêtes, canicules, etc.) pour vos villes favorites.'
      }
    ]
  },
  {
    category: 'Confidentialité',
    icon: Shield,
    items: [
      {
        question: 'Quelles données collectez-vous ?',
        answer: 'SkyCast collecte uniquement des données anonymes d\'utilisation localement dans votre navigateur (pages vues, recherches) pour améliorer l\'expérience. Aucune donnée personnelle n\'est partagée.'
      },
      {
        question: 'Comment supprimer mes données ?',
        answer: 'Rendez-vous dans Paramètres > Données, puis cliquez sur "Tout effacer". Cela supprimera toutes vos données locales : favoris, recherches, paramètres et analytics.'
      }
    ]
  }
];

export default function HelpPage() {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filteredFaqs = searchQuery 
    ? faqs.map(category => ({
        ...category,
        items: category.items.filter(
          item => 
            item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.items.length > 0)
    : faqs;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-indigo-950 overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
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
                <div className="absolute inset-0 bg-emerald-500/30 blur-xl rounded-2xl animate-pulse" />
                <div className="relative p-3 rounded-2xl bg-linear-to-br from-emerald-500/20 to-teal-500/20 border border-white/20 backdrop-blur-sm">
                  <HelpCircle className="w-7 h-7 text-emerald-400" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-linear-to-r from-white to-white/70 bg-clip-text text-transparent">
                  Aide & FAQ
                </h1>
                <p className="text-sm text-white/50">
                  Trouvez des réponses à vos questions
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
          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Rechercher une question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                'w-full pl-12 pr-4 py-4 rounded-2xl',
                'bg-white/5 border border-white/10',
                'text-white placeholder:text-white/40',
                'focus:outline-none focus:border-white/30 focus:bg-white/10',
                'transition-all'
              )}
            />
          </motion.div>

          {/* FAQ Categories */}
          <div className="space-y-8">
            {filteredFaqs.map((category, categoryIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-white/5">
                    <category.icon className="w-5 h-5 text-white/60" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">{category.category}</h2>
                </div>
                <div className="space-y-2">
                  {category.items.map((item, itemIndex) => (
                    <motion.div
                      key={`${category.category}-${itemIndex}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: itemIndex * 0.05 }}
                    >
                      <FAQItem
                        question={item.question}
                        answer={item.answer}
                        isOpen={openItems.includes(`${category.category}-${itemIndex}`)}
                        onClick={() => toggleItem(`${category.category}-${itemIndex}`)}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-white/50">Aucune question trouvée pour &ldquo;{searchQuery}&rdquo;</p>
            </motion.div>
          )}

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-2xl bg-linear-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-xl p-6"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-500/10">
                  <MessageCircle className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Besoin d&apos;aide ?</h3>
                  <p className="text-sm text-white/50">
                    Notre équipe est là pour vous aider 😉
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <a
                  href="mailto:support@skycast.app"
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl',
                    'bg-white/5 hover:bg-white/10 border border-white/10',
                    'text-white/80 hover:text-white text-sm font-medium',
                    'transition-all'
                  )}
                >
                  <Mail className="w-4 h-4" />
                  Email
                </a>
                <Link
                  href="/about"
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl',
                    'bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20',
                    'text-blue-400 hover:text-blue-300 text-sm font-medium',
                    'transition-all'
                  )}
                >
                  <ExternalLink className="w-4 h-4" />
                  À propos
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
