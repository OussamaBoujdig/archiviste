<?php

namespace Database\Seeders;

use App\Models\Folder;
use Illuminate\Database\Seeder;

class FolderSeeder extends Seeder
{
    public function run(): void
    {
        // Company 1 Folders (TechCorp)
        $factures = Folder::create([
            'company_id' => 1,
            'created_by' => 2,
            'name' => 'Factures',
            'description' => 'Toutes les factures de l\'entreprise',
            'color' => '#3b82f6',
            'icon' => 'file-text',
        ]);

        Folder::create([
            'company_id' => 1,
            'created_by' => 2,
            'parent_id' => $factures->id,
            'name' => 'Factures 2024',
            'description' => 'Factures de l\'année 2024',
            'color' => '#3b82f6',
        ]);

        Folder::create([
            'company_id' => 1,
            'created_by' => 2,
            'parent_id' => $factures->id,
            'name' => 'Factures 2023',
            'description' => 'Factures de l\'année 2023',
            'color' => '#3b82f6',
        ]);

        Folder::create([
            'company_id' => 1,
            'created_by' => 2,
            'name' => 'Contrats',
            'description' => 'Contrats clients et fournisseurs',
            'color' => '#10b981',
            'icon' => 'file-signature',
        ]);

        Folder::create([
            'company_id' => 1,
            'created_by' => 2,
            'name' => 'RH',
            'description' => 'Documents des ressources humaines',
            'color' => '#f59e0b',
            'icon' => 'users',
        ]);

        Folder::create([
            'company_id' => 1,
            'created_by' => 2,
            'name' => 'Juridique',
            'description' => 'Documents légaux',
            'color' => '#ef4444',
            'icon' => 'shield',
        ]);

        // Company 2 Folders (MarocBTP)
        Folder::create([
            'company_id' => 2,
            'created_by' => 5,
            'name' => 'Projets',
            'description' => 'Documents des projets de construction',
            'color' => '#8b5cf6',
            'icon' => 'building',
        ]);

        Folder::create([
            'company_id' => 2,
            'created_by' => 5,
            'name' => 'Appels d\'offres',
            'description' => 'Documents des appels d\'offres',
            'color' => '#06b6d4',
            'icon' => 'file-text',
        ]);

        // Company 3 Folders (Atlas Finance)
        Folder::create([
            'company_id' => 3,
            'created_by' => 7,
            'name' => 'Rapports Financiers',
            'description' => 'Rapports et bilans financiers',
            'color' => '#22c55e',
            'icon' => 'bar-chart',
        ]);

        Folder::create([
            'company_id' => 3,
            'created_by' => 7,
            'name' => 'Clients',
            'description' => 'Dossiers clients',
            'color' => '#3b82f6',
            'icon' => 'users',
        ]);
    }
}
