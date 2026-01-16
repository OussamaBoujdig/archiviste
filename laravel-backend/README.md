# AmanDocs Laravel Backend

API Backend pour la plateforme AmanDocs - Gestion d'archives numériques.

## Requirements

- PHP >= 8.1
- Composer
- MySQL >= 8.0 ou MariaDB >= 10.3
- Node.js >= 18 (pour le frontend)

## Installation

### 1. Cloner et installer les dépendances

```bash
cd laravel-backend
composer install
```

### 2. Configuration de l'environnement

```bash
cp .env.example .env
php artisan key:generate
```

Éditer `.env` avec vos paramètres de base de données :

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=amandocs
DB_USERNAME=root
DB_PASSWORD=votre_mot_de_passe

FRONTEND_URL=http://localhost:3000
SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000
```

### 3. Créer la base de données

```sql
CREATE DATABASE amandocs CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Exécuter les migrations et seeders

```bash
php artisan migrate
php artisan db:seed
```

### 5. Créer le lien de stockage

```bash
php artisan storage:link
```

### 6. Démarrer le serveur

```bash
php artisan serve --port=8000
```

L'API sera accessible sur `http://localhost:8000/api`

## Comptes de démonstration

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Super Admin | superadmin@amandocs.ma | password |
| Client Admin (TechCorp) | ahmed@techcorp.ma | password |
| Client User (TechCorp) | fatima@techcorp.ma | password |
| Read Only (TechCorp) | youssef@techcorp.ma | password |

## Endpoints API

### Authentication
- `POST /api/login` - Connexion
- `POST /api/register` - Inscription
- `POST /api/logout` - Déconnexion (auth required)
- `GET /api/me` - Profil utilisateur (auth required)
- `PUT /api/profile` - Mettre à jour le profil
- `PUT /api/password` - Changer le mot de passe

### Dashboard
- `GET /api/dashboard/super-admin` - Stats Super Admin
- `GET /api/dashboard/client-admin` - Stats Client Admin

### Companies (Super Admin)
- `GET /api/companies` - Liste des entreprises
- `GET /api/companies/{id}` - Détails d'une entreprise
- `POST /api/companies` - Créer une entreprise
- `PUT /api/companies/{id}` - Modifier une entreprise
- `DELETE /api/companies/{id}` - Supprimer une entreprise
- `POST /api/companies/{id}/suspend` - Suspendre
- `POST /api/companies/{id}/activate` - Réactiver
- `GET /api/companies/stats` - Statistiques

### Documents
- `GET /api/documents` - Liste des documents
- `GET /api/documents/{id}` - Détails d'un document
- `POST /api/documents` - Téléverser un document
- `PUT /api/documents/{id}` - Modifier un document
- `DELETE /api/documents/{id}` - Supprimer un document
- `GET /api/documents/{id}/download` - Télécharger
- `POST /api/documents/{id}/archive` - Archiver
- `GET /api/documents/stats` - Statistiques

### Folders
- `GET /api/folders` - Liste des dossiers
- `GET /api/folders/tree` - Arborescence
- `GET /api/folders/{id}` - Détails d'un dossier
- `POST /api/folders` - Créer un dossier
- `PUT /api/folders/{id}` - Modifier un dossier
- `DELETE /api/folders/{id}` - Supprimer un dossier

### Users (Admin)
- `GET /api/users` - Liste des utilisateurs
- `GET /api/users/{id}` - Détails d'un utilisateur
- `POST /api/users` - Créer un utilisateur
- `PUT /api/users/{id}` - Modifier un utilisateur
- `DELETE /api/users/{id}` - Supprimer un utilisateur
- `POST /api/users/{id}/reset-password` - Réinitialiser le mot de passe

### Activity Logs
- `GET /api/activity-logs` - Liste des activités
- `GET /api/activity-logs/{id}` - Détails d'une activité
- `GET /api/activity-logs/stats` - Statistiques

## Structure du projet

```
laravel-backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/    # Contrôleurs API
│   │   └── Middleware/         # Middlewares
│   ├── Models/                 # Modèles Eloquent
│   └── Providers/              # Service Providers
├── config/                     # Configuration
├── database/
│   ├── migrations/             # Migrations
│   └── seeders/                # Seeders
├── routes/
│   └── api.php                 # Routes API
└── storage/
    └── app/documents/          # Stockage des fichiers
```

## Rôles et Permissions

| Rôle | Permissions |
|------|-------------|
| `super_admin` | Accès total, gestion des entreprises |
| `client_admin` | Gestion complète de son entreprise |
| `client_user` | Upload, modification, suppression de documents |
| `read_only` | Consultation uniquement |

## Tests

```bash
php artisan test
```

## Licence

MIT
