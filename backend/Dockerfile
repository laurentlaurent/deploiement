FROM python:3.11-slim

WORKDIR /app

# Copie des fichiers de dépendances
COPY requirements.txt .

# Installation des dépendances
RUN pip install --no-cache-dir -r requirements.txt

# Copie du reste du code
COPY . .

# Création du dossier uploads s'il n'existe pas
RUN mkdir -p uploads

# Exposition du port
EXPOSE 5000

# Commande de démarrage
CMD ["python", "app.py"]
