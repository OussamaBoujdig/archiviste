<?php

namespace Database\Seeders;

use App\Models\ActivityLog;
use Illuminate\Database\Seeder;

class ActivityLogSeeder extends Seeder
{
    public function run(): void
    {
        $logs = [
            ['company_id' => 1, 'user_id' => 2, 'user_name' => 'Ahmed Benali', 'action' => 'login', 'description' => 'Connexion réussie', 'created_at' => now()->subHours(1)],
            ['company_id' => 1, 'user_id' => 2, 'user_name' => 'Ahmed Benali', 'action' => 'upload', 'entity_type' => 'Document', 'entity_id' => 1, 'entity_name' => 'Facture Client ABC', 'description' => 'Document téléversé', 'created_at' => now()->subHours(2)],
            ['company_id' => 1, 'user_id' => 3, 'user_name' => 'Fatima Zahra', 'action' => 'view', 'entity_type' => 'Document', 'entity_id' => 1, 'entity_name' => 'Facture Client ABC', 'description' => 'Document consulté', 'created_at' => now()->subHours(3)],
            ['company_id' => 1, 'user_id' => 3, 'user_name' => 'Fatima Zahra', 'action' => 'download', 'entity_type' => 'Document', 'entity_id' => 2, 'entity_name' => 'Facture Fournisseur XYZ', 'description' => 'Document téléchargé', 'created_at' => now()->subHours(4)],
            ['company_id' => 1, 'user_id' => 2, 'user_name' => 'Ahmed Benali', 'action' => 'create_folder', 'entity_type' => 'Folder', 'entity_id' => 1, 'entity_name' => 'Factures', 'description' => 'Dossier créé', 'created_at' => now()->subDays(1)],
            ['company_id' => 2, 'user_id' => 5, 'user_name' => 'Karim Tazi', 'action' => 'login', 'description' => 'Connexion réussie', 'created_at' => now()->subHours(5)],
            ['company_id' => 2, 'user_id' => 5, 'user_name' => 'Karim Tazi', 'action' => 'upload', 'entity_type' => 'Document', 'entity_id' => 6, 'entity_name' => 'Projet Résidence Palmiers', 'description' => 'Document téléversé', 'created_at' => now()->subHours(6)],
            ['company_id' => 3, 'user_id' => 7, 'user_name' => 'Omar Idrissi', 'action' => 'login', 'description' => 'Connexion réussie', 'created_at' => now()->subHours(7)],
            ['company_id' => 3, 'user_id' => 7, 'user_name' => 'Omar Idrissi', 'action' => 'edit', 'entity_type' => 'Document', 'entity_id' => 8, 'entity_name' => 'Bilan Annuel 2023', 'description' => 'Document modifié', 'created_at' => now()->subHours(8)],
            ['company_id' => null, 'user_id' => 1, 'user_name' => 'Super Admin', 'action' => 'login', 'description' => 'Connexion Super Admin', 'created_at' => now()->subMinutes(30)],
        ];

        foreach ($logs as $log) {
            ActivityLog::create($log);
        }
    }
}
