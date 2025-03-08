FROM node:20-alpine

WORKDIR /app

# Copie des fichiers de dépendances
COPY package.json package-lock.json* ./

# Installation des dépendances
RUN npm ci

# Copie du reste du code
COPY . .

# Build de l'application en ignorant les erreurs de lint
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Exposition du port
EXPOSE 3000

# Commande de démarrage
CMD ["npm", "start"]
