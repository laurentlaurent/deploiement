# BrainBoost

BrainBoost est une application web interactive qui utilise l'IA pour générer des cartes d'apprentissage (flashcards) à partir de divers types de contenus. L'application facilite l'apprentissage en transformant automatiquement des documents PDF, des images ou du texte en cartes questions-réponses.

## Fonctionnalités

- **Import multi-format**: téléchargez des PDF, images (PNG, JPG) ou fichiers texte
- **Génération automatique par IA**: création de cartes questions-réponses pertinentes grâce à Google Gemini AI
- **Mode d'étude interactif**: révisez vos cartes avec différents modes d'apprentissage
- **Suivi de progression**: évaluez votre maîtrise des concepts
- **Interface responsive**: utilisable sur ordinateur, tablette ou mobile

## Architecture du projet

Le projet est divisé en deux parties principales:

- **Backend** (Flask): API pour le traitement des fichiers et l'intégration avec Gemini AI
- **Frontend** (Next.js): Interface utilisateur interactive et responsive

## Prérequis

- Python 3.8 ou supérieur
- Node.js 18.x ou supérieur
- Une clé API Google Gemini (gratuite)

## Installation

### Avec Make (recommandé)

```bash
# Installer toutes les dépendances
make setup

# Configurer la clé API Gemini dans backend/.env
```

### Installation manuelle

#### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # Configurer la clé API Gemini
```

#### Frontend

```bash
cd frontend
npm install
```

## Démarrage

### Avec Make

```bash
# Terminal 1: Démarrer le backend
make run-backend

# Terminal 2: Démarrer le frontend
make run-frontend
```

### Démarrage manuel

#### Backend

```bash
cd backend
source venv/bin/activate  # Sur Windows: venv\Scripts\activate
python app.py
```

#### Frontend

```bash
cd frontend
npm run dev
```

## Obtenir une clé API Gemini

1. Visitez [Google AI Studio](https://ai.google.dev/)
2. Créez un compte si nécessaire
3. Accédez à la section API et créez une clé API
4. Copiez cette clé dans le fichier `backend/.env`

## Tests

Pour vérifier que l'API Gemini fonctionne correctement:

```bash
make test-backend
```


## Licence

Ce projet est sous licence MIT - voir le fichier LICENSE pour plus de détails.