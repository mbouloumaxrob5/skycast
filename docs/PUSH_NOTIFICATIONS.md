# Configuration des Notifications Push

## Prérequis

Pour activer les notifications push dans SkyCast, vous devez générer des clés VAPID.

## Générer les clés VAPID

```bash
npx web-push generate-vapid-keys
```

Cette commande génère :
- Une clé publique (à utiliser côté client)
- Une clé privée (à utiliser côté serveur)

## Configuration

1. Créez un fichier `.env.local` à la racine du projet :

```env
# Clé publique VAPID (côté client)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=votre_cle_publique_ici

# Clé privée VAPID (côté serveur - uniquement pour l'API)
VAPID_PRIVATE_KEY=votre_cle_privee_ici

# Email pour les notifications VAPID
VAPID_SUBJECT=mailto:votre-email@example.com
```

2. Redémarrez le serveur de développement

## Dépannage

### Erreur : "applicationServerKey is not valid"

**Cause :** La clé VAPID n'est pas définie ou est invalide.

**Solution :**
1. Vérifiez que `.env.local` existe avec `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
2. Régénérez les clés avec `npx web-push generate-vapid-keys`
3. Redémarrez le serveur

### Test des notifications

Une fois configuré, vous pouvez tester les notifications :
1. Ouvrez l'application
2. Cliquez sur "Activer les notifications"
3. Acceptez la permission
4. Cliquez sur "Envoyer une notification de test"

## Notes techniques

- La clé publique doit être au format base64url
- La clé convertie doit faire 65 bytes (EC P-256)
- Les variables `NEXT_PUBLIC_*` sont exposées au navigateur
- La clé privée ne doit JAMAIS être exposée côté client
