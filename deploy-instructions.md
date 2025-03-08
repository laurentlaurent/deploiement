# Instructions de déploiement sur Vercel

## Prérequis
- Un compte [Vercel](https://vercel.com/signup)
- Node.js installé sur votre machine
- Votre code versionné avec Git (recommandé)

## Étapes de déploiement

### 1. Installer Vercel CLI
```bash
npm install -g vercel
```

### 2. Se connecter à Vercel
```bash
vercel login
```

Après avoir exécuté cette commande :
- Un message apparaîtra demandant votre adresse e-mail
- Entrez l'adresse e-mail associée à votre compte Vercel
- Un e-mail de vérification sera envoyé à cette adresse
- Ouvrez votre boîte de réception et cliquez sur le lien de vérification
- Une fois que vous avez cliqué sur le lien, le terminal affichera un message de confirmation de connexion réussie

Alternativement, si vous préférez vous connecter avec un jeton (token), vous pouvez utiliser :
```bash
vercel login --token votre_token_vercel
```
Vous pouvez créer un jeton d'accès dans les paramètres de votre compte Vercel (Settings > Tokens).

### 3. Naviguer vers votre projet
```bash
```

### 4. Déployer
```bash
vercel
```

Suivez les instructions à l'écran. Pour votre application monorepo (frontend + backend), assurez-vous de:
- Sélectionner le répertoire racine du projet (où se trouve votre vercel.json principal)
- Confirmer la détection du projet Next.js et Python
- Vérifier que les variables d'environnement sont correctement configurées
- Pour le backend, vérifiez que la variable d'environnement GEMINI_API_KEY est configurée dans l'interface Vercel

Si vous avez besoin de variables d'environnement supplémentaires pour votre API Gemini, vous pouvez les ajouter dans l'interface Vercel après le déploiement initial ou les spécifier avec la commande:
```bash
vercel --env GEMINI_API_KEY=votre_cle_api
```

### 5. Déploiement terminé
Une fois le déploiement terminé, Vercel fournira une URL pour accéder à votre application déployée.

### Dépannage courant
Si vous rencontrez des problèmes avec le backend Python:
1. Vérifiez que les dépendances sont correctement listées dans requirements.txt
2. Vérifiez les logs de déploiement dans l'interface Vercel
3. Assurez-vous que l'API Gemini est accessible depuis les serveurs Vercel

Si le frontend ne communique pas correctement avec le backend:
1. Vérifiez que NEXT_PUBLIC_API_URL est correctement configuré
2. Assurez-vous que les routes dans vercel.json sont correctes

### Déploiement automatique avec GitHub/GitLab/Bitbucket
Pour une configuration plus avancée, vous pouvez connecter votre dépôt Git à Vercel via l'interface web pour des déploiements automatiques à chaque push.

1. Allez sur [vercel.com](https://vercel.com)
2. Importez votre projet depuis GitHub/GitLab/Bitbucket
3. Configurez les paramètres de déploiement
4. Vercel déploiera automatiquement à chaque push sur la branche principale
