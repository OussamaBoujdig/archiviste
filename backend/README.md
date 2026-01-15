# AmanDocs Backend API

Backend API pour la plateforme AmanDocs / Archivist - Gestion d'archives numériques pour entreprises marocaines.

## 🚀 Démarrage rapide

### Prérequis
- Docker & Docker Compose
- Node.js 18+ (pour développement local)

### Avec Docker (Recommandé)

```bash
# Depuis le dossier racine du projet
docker-compose up -d
```

L'API sera disponible sur `http://localhost:3001`

### Développement local

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

## 📚 API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Utilisateur actuel
- `PUT /api/auth/password` - Changer mot de passe
- `POST /api/auth/logout` - Déconnexion

### Entreprises (Super Admin)
- `GET /api/companies` - Liste des entreprises
- `GET /api/companies/:id` - Détails entreprise
- `POST /api/companies` - Créer entreprise
- `PUT /api/companies/:id` - Modifier entreprise
- `DELETE /api/companies/:id` - Supprimer entreprise

### Utilisateurs
- `GET /api/users` - Liste des utilisateurs
- `GET /api/users/:id` - Détails utilisateur
- `POST /api/users` - Créer utilisateur
- `PUT /api/users/:id` - Modifier utilisateur
- `DELETE /api/users/:id` - Supprimer utilisateur

### Dossiers
- `GET /api/folders` - Liste des dossiers
- `GET /api/folders/:id` - Détails dossier
- `POST /api/folders` - Créer dossier
- `PUT /api/folders/:id` - Modifier dossier
- `DELETE /api/folders/:id` - Supprimer dossier

### Documents
- `GET /api/documents` - Liste des documents
- `GET /api/documents/:id` - Détails document
- `POST /api/documents` - Upload document
- `PUT /api/documents/:id` - Modifier métadonnées
- `DELETE /api/documents/:id` - Supprimer document

### Activité
- `GET /api/activity` - Journaux d'activité
- `GET /api/activity/stats` - Statistiques d'activité

### Statistiques
- `GET /api/stats/dashboard` - Stats tableau de bord
- `GET /api/stats/documents/by-type` - Stats par type
- `GET /api/stats/documents/by-folder` - Stats par dossier
- `GET /api/stats/documents/recent` - Documents récents

## 🔐 Authentification

L'API utilise JWT (JSON Web Tokens). Incluez le token dans l'en-tête:

```
Authorization: Bearer <token>
```

## 👥 Rôles

| Rôle | Description |
|------|-------------|
| `super_admin` | Gestion complète de la plateforme |
| `client_admin` | Gestion de son entreprise |
| `client_user` | Accès limité aux documents |
| `read_only` | Lecture seule (auditeur) |

## 🗄️ Base de données

PostgreSQL 15 avec les tables:
- `companies` - Entreprises clientes
- `users` - Utilisateurs
- `folders` - Dossiers
- `documents` - Documents
- `user_folder_access` - Accès aux dossiers
- `activity_logs` - Journaux d'activité

## 🔒 Sécurité

- Helmet.js pour les en-têtes HTTP
- Rate limiting (100 req/15min)
- Mots de passe hashés (bcrypt)
- Validation des entrées
- CORS configuré

## 📝 Comptes de test

| Email | Mot de passe | Rôle |
|-------|--------------|------|
| oussama@amandocs.ma | admin123 | Super Admin |
| karim@afriquia-casa.ma | admin123 | Client Admin |
| fatima@afriquia-casa.ma | user123 | Client User |
| audit@expert-audit.ma | audit123 | Read-Only |
