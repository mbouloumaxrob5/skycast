# SkyCast - Guide de Sécurité

Ce document décrit les mesures de sécurité mises en place pour protéger l'application SkyCast.

## 🔒 Mesures de Sécurité Implémentées

### 1. Security Headers (Middleware Next.js)

Le fichier `middleware.ts` applique automatiquement les headers de sécurité suivants à toutes les requêtes :

- **Content-Security-Policy (CSP)** : Empêche l'injection de scripts malveillants
- **X-Frame-Options: DENY** : Protection contre le clickjacking
- **X-Content-Type-Options: nosniff** : Empêche le MIME sniffing
- **X-XSS-Protection** : Protection XSS supplémentaire
- **Strict-Transport-Security (HSTS)** : Force HTTPS
- **Referrer-Policy** : Contrôle les informations de référence
- **Permissions-Policy** : Limite les fonctionnalités du navigateur

### 2. Rate Limiting

**Fichier** : `src/lib/security/rateLimit.ts`

- **Limite** : 60 requêtes par minute par IP
- **Headers** : `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- **Nettoyage automatique** : Toutes les 5 minutes

### 3. Validation et Sanitization

**Fichier** : `src/lib/security/validation.ts`

#### Validation des entrées utilisateur :
- **Noms de villes** : Caractères alphanumériques, espaces, tirets, apostrophes uniquement
- **Coordonnées GPS** : Validation des limites (-90 à 90°, -180 à 180°)
- **Sanitization** : Suppression des balises HTML, échappement des caractères spéciaux
- **Limitation de taille** : 100 caractères max

### 4. API Météo Sécurisée

**Fichier** : `src/app/api/weather/route.ts`

- **Rate limiting** par IP
- **Validation des paramètres** avant envoi à OpenWeatherMap
- **Clé API cachée** côté serveur uniquement (pas de NEXT_PUBLIC_*)
- **Suppression des paramètres dangereux** (appid, apikey, key, token, secret)
- **Validation du Content-Type** et taille du body

## 🛡️ Protection contre les attaques

### XSS (Cross-Site Scripting)
- ✅ Content Security Policy (CSP) stricte
- ✅ Sanitization des entrées utilisateur
- ✅ Échappement des caractères spéciaux (&, <, >, ", ')

### Injection SQL / NoSQL
- ✅ Pas de base de données utilisée dans l'application
- ✅ Validation stricte des entrées

### CSRF (Cross-Site Request Forgery)
- ✅ SameSite cookies (par défaut Next.js)
- ✅ Validation des en-têtes de requête

### Clickjacking
- ✅ X-Frame-Options: DENY
- ✅ CSP frame-ancestors directive

### DoS / DDoS
- ✅ Rate limiting (60 req/min)
- ✅ Limitation de la taille des requêtes (1MB max)
- ✅ Validation des coordonnées

### Man-in-the-Middle
- ✅ HSTS (HTTPS obligatoire)
- ✅ Cookies sécurisés

## 🔧 Configuration Requise

### Variables d'environnement

Créer un fichier `.env.local` à la racine du projet :

```bash
# Clé API OpenWeatherMap (serveur uniquement)
OPENWEATHER_API_KEY=votre_cle_api_ici

# Ne PAS utiliser NEXT_PUBLIC_ pour les clés API
# ❌ NEXT_PUBLIC_OPENWEATHER_API_KEY=xxx
```

### Déploiement en Production

1. **HTTPS obligatoire** : Configurer SSL/TLS
2. **Headers de sécurité** : Vérifier avec [securityheaders.com](https://securityheaders.com)
3. **Audit régulier** : `npm audit` pour détecter les vulnérabilités
4. **Mises à jour** : Maintenir les dépendances à jour

## 📋 Checklist de Sécurité

### Avant déploiement :
- [ ] Clé API OpenWeatherMap configurée côté serveur uniquement
- [ ] Pas de NEXT_PUBLIC_ pour les secrets
- [ ] HTTPS activé
- [ ] Rate limiting testé
- [ ] Validation des entrées testée
- [ ] npm audit sans vulnérabilités critiques

### Maintenance régulière :
- [ ] Mise à jour des dépendances mensuelle
- [ ] Audit de sécurité trimestriel
- [ ] Revue des logs de sécurité
- [ ] Test des limites de rate limiting

## 🚨 Signalement de Vulnérabilités

Si vous découvrez une vulnérabilité de sécurité :

1. Ne créez PAS d'issue publique sur GitHub
2. Envoyez un email à [votre-email@example.com]
3. Incluez :
   - Description détaillée de la vulnérabilité
   - Étapes pour reproduire
   - Impact potentiel
   - Suggestions de correction (si applicable)

Nous nous engageons à :
- Accuser réception sous 48h
- Fournir un correctif sous 7 jours pour les vulnérabilités critiques
- Vous créditer dans les notes de version (si vous le souhaitez)

## 📚 Ressources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Headers](https://nextjs.org/docs/advanced-features/security-headers)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)

---

**Dernière mise à jour** : 13 Avril 2026
**Version** : 1.0.0
