.PHONY: setup-backend setup-frontend run-backend run-frontend test-backend clean help

# Couleurs pour les messages
YELLOW=\033[0;33m
GREEN=\033[0;32m
BLUE=\033[0;34m
RED=\033[0;31m
NC=\033[0m # No Color

# Variables
BACKEND_DIR=backend
FRONTEND_DIR=frontend
VENV_DIR=$(BACKEND_DIR)/venv
DEV ?= 1

help:
	@echo "${BLUE}BrainBoost - Assistant d'apprentissage par flashcards${NC}"
	@echo ""
	@echo "${YELLOW}Commandes disponibles:${NC}"
	@echo "  ${GREEN}setup-backend${NC}    Installer les dépendances du backend"
	@echo "  ${GREEN}setup-frontend${NC}   Installer les dépendances du frontend"
	@echo "  ${GREEN}setup${NC}            Installer les dépendances backend et frontend"
	@echo "  ${GREEN}run-backend${NC}      Démarrer le serveur backend"
	@echo "  ${GREEN}run-frontend${NC}     Démarrer le serveur frontend"
	@echo "  ${GREEN}run${NC}              Démarrer les serveurs backend et frontend"
	@echo "  ${GREEN}test-backend${NC}     Tester la connexion à l'API Gemini"
	@echo "  ${GREEN}clean${NC}            Nettoyer les fichiers temporaires"
	@echo ""
	@echo "${YELLOW}Exemple:${NC} make setup-backend"

setup-backend:
	@echo "${BLUE}Installation des dépendances du backend...${NC}"
	@if [ ! -d "$(VENV_DIR)" ]; then \
		python -m venv $(VENV_DIR); \
	fi
	@. $(VENV_DIR)/bin/activate && pip install -r $(BACKEND_DIR)/requirements.txt
	@if [ ! -f "$(BACKEND_DIR)/.env" ]; then \
		cp $(BACKEND_DIR)/.env.example $(BACKEND_DIR)/.env; \
		echo "${YELLOW}Fichier .env créé. Veuillez configurer votre clé API Gemini dans $(BACKEND_DIR)/.env${NC}"; \
	fi
	@echo "${GREEN}✅ Installation du backend terminée${NC}"

setup-frontend:
	@echo "${BLUE}Installation des dépendances du frontend...${NC}"
	@cd $(FRONTEND_DIR) && npm install
	@echo "${GREEN}✅ Installation du frontend terminée${NC}"

setup: setup-backend setup-frontend
	@echo "${GREEN}✅ Installation terminée${NC}"

run-backend:
	@echo "${BLUE}Démarrage du serveur backend...${NC}"
	@. $(VENV_DIR)/bin/activate && cd $(BACKEND_DIR) && python app.py

run-frontend:
	@echo "${BLUE}Démarrage du serveur frontend...${NC}"
ifeq ($(DEV),1)
	@cd $(FRONTEND_DIR) && npm run dev
else
	@cd $(FRONTEND_DIR) && npm run build && npm start
endif

run:
	@echo "${RED}Pour exécuter les deux serveurs simultanément, veuillez utiliser deux terminaux séparés:${NC}"
	@echo "  ${YELLOW}Terminal 1:${NC} make run-backend"
	@echo "  ${YELLOW}Terminal 2:${NC} make run-frontend"

test-backend:
	@echo "${BLUE}Test de la connexion à l'API Gemini...${NC}"
	@if [ ! -d "$(VENV_DIR)" ]; then \
		echo "${RED}Veuillez d'abord configurer le backend avec 'make setup-backend'${NC}"; \
		exit 1; \
	fi
	@. $(VENV_DIR)/bin/activate && cd $(BACKEND_DIR) && python -c "import os, sys; sys.path.append('.'); from app import test_gemini_api; result = test_gemini_api(); sys.exit(0 if result else 1)"
	@if [ $$? -eq 0 ]; then \
		echo "${GREEN}✅ Connexion à l'API Gemini réussie${NC}"; \
	else \
		echo "${RED}❌ Échec de la connexion à l'API Gemini${NC}"; \
		echo "${YELLOW}Vérifiez votre clé API dans $(BACKEND_DIR)/.env${NC}"; \
	fi

clean:
	@echo "${BLUE}Nettoyage des fichiers temporaires...${NC}"
	@find . -type d -name "__pycache__" -exec rm -rf {} +
	@find . -type f -name "*.pyc" -delete
	@find . -type d -name ".pytest_cache" -exec rm -rf {} +
	@find . -type f -name ".coverage" -delete
	@find . -type d -name "htmlcov" -exec rm -rf {} +
	@echo "${GREEN}✅ Nettoyage terminé${NC}"