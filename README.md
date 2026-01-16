# AmanDocs - Plateforme d'Archivage Numérique

Une application moderne de gestion d'archives numériques pour entreprises marocaines.

## Architecture

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Laravel 10 + MySQL + Sanctum API

## Quick Start

### 1. Backend Laravel

```bash
cd laravel-backend
composer install
cp .env.example .env
php artisan key:generate

# Configurer la base de données dans .env
php artisan migrate
php artisan db:seed
php artisan serve --port=8000
```

### 2. Frontend React

```bash
npm install
cp .env.example .env
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## Documentation

- [Backend Laravel](./laravel-backend/README.md) - API et configuration
- [Frontend React](./README.md) - Interface utilisateur

## Fonctionnalités

- **Page de connexion** - Interface sécurisée et professionnelle
- **Tableau de bord** - Vue d'ensemble avec statistiques
- **Gestion des documents** - Recherche, filtrage, téléversement
- **Visualiseur de documents** - Aperçu avec métadonnées
- **Gestion des utilisateurs** - Rôles Admin/Utilisateur
- **Paramètres** - Configuration de l'entreprise et sécurité

## Technologies

- React 18 avec hooks modernes
- React Router v6 pour la navigation
- Lucide React pour les icônes
- CSS personnalisé (design system blue/gray)
- Vite pour le bundling

## Installation

```bash
npm install
```

## Développement

```bash
npm run dev
```

L'application sera accessible sur http://localhost:3000

## Build

```bash
npm run build
```

## Structure du projet

```
├── laravel-backend/          # API Laravel
│   ├── app/
│   │   ├── Http/Controllers/ # Contrôleurs API
│   │   └── Models/           # Modèles Eloquent
│   ├── database/
│   │   ├── migrations/       # Schéma de base
│   │   └── seeders/          # Données de démo
│   └── routes/api.php        # Routes API
│
├── src/                      # Frontend React
│   ├── components/           # Composants réutilisables
│   ├── context/              # Context React (Auth)
│   ├── hooks/                # Hooks personnalisés
│   ├── pages/                # Pages de l'application
│   ├── services/             # Services API
│   └── data/                 # Données mock (fallback)
```

## Comptes de démo

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Super Admin | superadmin@amandocs.ma | password |
| Client Admin | ahmed@techcorp.ma | password |
| Client User | fatima@techcorp.ma | password |
| Lecture seule | youssef@techcorp.ma | password |

## Licence

MIT
