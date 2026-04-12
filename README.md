# ☁️ SkyCast - Application Météo Moderne

Une application météo élégante et performante avec géolocalisation, prévisions 5 jours et 24h, alertes météo en temps réel, et thèmes adaptatifs.

![Next.js](https://img.shields.io/badge/Next.js-16.2.3-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-06B6D4?style=flat-square&logo=tailwindcss)

## ✨ Fonctionnalités

- 🌍 **Géolocalisation** - Détection automatique de la position
- 🔍 **Recherche de villes** - Autocomplétion avec navigation clavier
- 📊 **Prévisions 5 jours** - Températures min/max et conditions
- 🕐 **Prévisions 24h** - Graphique interactif avec tooltips
- 🌙 **Thème Dark/Light** - Basculement manuel ou automatique
- 🔔 **Alertes météo** - Notifications pour conditions extrêmes
- 📴 **Mode hors-ligne** - Cache des données pour consultation offline
- ⭐ **Favoris** - Sauvegarde de vos villes préférées
- 🎨 **Glassmorphism** - Design moderne avec effets de transparence
- ⚡ **Animations fluides** - Framer Motion pour transitions naturelles

## 🚀 Démarrage

### Prérequis

- Node.js 18+
- Clé API OpenWeatherMap (gratuite sur [openweathermap.org](https://openweathermap.org/api))

### Installation

```bash
# Cloner le projet
git clone https://github.com/votre-username/skycast.git
cd skycast

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec votre clé API
```

### Configuration

Créez un fichier `.env.local` :

```env
NEXT_PUBLIC_OPENWEATHER_API_KEY=votre_cle_api_ici
```

### Lancer en développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

### Build de production

```bash
npm run build
npm start
```

## 🏗️ Architecture

```
src/
├── app/                 # Routes Next.js App Router
├── components/
│   ├── layout/         # Header, backgrounds
│   ├── ui/             # Composants réutilisables
│   └── weather/        # Composants météo spécifiques
├── hooks/              # Custom React hooks
├── lib/
│   ├── api/            # Services API
│   └── utils/          # Utilitaires
├── store/              # Zustand stores
├── styles/             # Thèmes et variables
└── types/              # Types TypeScript
```

## 🛠️ Technologies

- **Framework** : [Next.js 16](https://nextjs.org) avec App Router
- **UI** : [React 19](https://react.dev) + [TypeScript](https://typescriptlang.org)
- **Styling** : [Tailwind CSS 4](https://tailwindcss.com)
- **Animations** : [Framer Motion](https://framer.com/motion)
- **State** : [Zustand](https://zustand-demo.pmnd.rs) avec persistance
- **Data Fetching** : [TanStack Query](https://tanstack.com/query)
- **Icons** : [Lucide React](https://lucide.dev)
- **API** : [OpenWeatherMap](https://openweathermap.org/api)

## 📝 Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lancer le serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Démarrer le serveur de production |
| `npm run lint` | Lancer ESLint |

## 🌐 Déploiement

Le build est optimisé pour [Vercel](https://vercel.com) :

```bash
npm i -g vercel
vercel
```

## 📄 Licence

MIT © [Votre Nom]
