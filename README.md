# Archivist - Plateforme de gestion d'archives numériques

Une interface frontend moderne pour la gestion d'archives numériques destinée aux entreprises (avocats, comptables, stations-service, PME).

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
src/
├── components/
│   └── Layout.jsx        # Shell avec sidebar
├── data/
│   └── mockData.js       # Données de démonstration
├── pages/
│   ├── Login.jsx         # Page de connexion
│   ├── Dashboard.jsx     # Tableau de bord
│   ├── Documents.jsx     # Liste des documents
│   ├── DocumentViewer.jsx# Visualiseur
│   ├── Users.jsx         # Gestion utilisateurs
│   └── Settings.jsx      # Paramètres
├── App.jsx               # Routes et état global
├── main.jsx              # Point d'entrée
└── index.css             # Styles globaux
```

## Notes

Ceci est une démo frontend uniquement. Les données sont simulées et aucun backend n'est connecté.
