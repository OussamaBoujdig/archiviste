<?php

namespace Database\Seeders;

use App\Models\Document;
use Illuminate\Database\Seeder;

class DocumentSeeder extends Seeder
{
    public function run(): void
    {
        $documents = [
            // Company 1 Documents
            [
                'company_id' => 1,
                'folder_id' => 2,
                'uploaded_by' => 2,
                'name' => 'Facture Client ABC',
                'original_name' => 'facture_abc_001.pdf',
                'file_path' => 'documents/1/facture_abc_001.pdf',
                'file_type' => 'pdf',
                'mime_type' => 'application/pdf',
                'file_size' => 256000,
                'category' => 'facture',
                'tags' => ['client', 'abc', '2024'],
                'document_date' => now()->subDays(5),
            ],
            [
                'company_id' => 1,
                'folder_id' => 2,
                'uploaded_by' => 3,
                'name' => 'Facture Fournisseur XYZ',
                'original_name' => 'facture_xyz_002.pdf',
                'file_path' => 'documents/1/facture_xyz_002.pdf',
                'file_type' => 'pdf',
                'mime_type' => 'application/pdf',
                'file_size' => 189000,
                'category' => 'facture',
                'tags' => ['fournisseur', 'xyz', '2024'],
                'document_date' => now()->subDays(10),
            ],
            [
                'company_id' => 1,
                'folder_id' => 4,
                'uploaded_by' => 2,
                'name' => 'Contrat de Service Premium',
                'original_name' => 'contrat_service_premium.pdf',
                'file_path' => 'documents/1/contrat_service_premium.pdf',
                'file_type' => 'pdf',
                'mime_type' => 'application/pdf',
                'file_size' => 512000,
                'category' => 'contrat',
                'tags' => ['service', 'premium', 'annuel'],
                'document_date' => now()->subMonths(2),
            ],
            [
                'company_id' => 1,
                'folder_id' => 5,
                'uploaded_by' => 2,
                'name' => 'Contrat Employé - Ahmed',
                'original_name' => 'contrat_ahmed_benali.pdf',
                'file_path' => 'documents/1/contrat_ahmed_benali.pdf',
                'file_type' => 'pdf',
                'mime_type' => 'application/pdf',
                'file_size' => 324000,
                'category' => 'rh',
                'tags' => ['contrat', 'employe', 'cdi'],
                'document_date' => now()->subYears(1),
            ],
            [
                'company_id' => 1,
                'folder_id' => 6,
                'uploaded_by' => 2,
                'name' => 'Statuts Société',
                'original_name' => 'statuts_techcorp.pdf',
                'file_path' => 'documents/1/statuts_techcorp.pdf',
                'file_type' => 'pdf',
                'mime_type' => 'application/pdf',
                'file_size' => 856000,
                'category' => 'legal',
                'tags' => ['statuts', 'juridique', 'creation'],
                'document_date' => now()->subYears(3),
            ],
            // Company 2 Documents
            [
                'company_id' => 2,
                'folder_id' => 7,
                'uploaded_by' => 5,
                'name' => 'Projet Résidence Palmiers',
                'original_name' => 'projet_palmiers.pdf',
                'file_path' => 'documents/2/projet_palmiers.pdf',
                'file_type' => 'pdf',
                'mime_type' => 'application/pdf',
                'file_size' => 2048000,
                'category' => 'rapport',
                'tags' => ['projet', 'residence', 'palmiers'],
                'document_date' => now()->subWeeks(3),
            ],
            [
                'company_id' => 2,
                'folder_id' => 8,
                'uploaded_by' => 5,
                'name' => 'Appel d\'offres Marina',
                'original_name' => 'ao_marina_2024.pdf',
                'file_path' => 'documents/2/ao_marina_2024.pdf',
                'file_type' => 'pdf',
                'mime_type' => 'application/pdf',
                'file_size' => 1536000,
                'category' => 'correspondance',
                'tags' => ['appel', 'offre', 'marina'],
                'document_date' => now()->subDays(15),
            ],
            // Company 3 Documents
            [
                'company_id' => 3,
                'folder_id' => 9,
                'uploaded_by' => 7,
                'name' => 'Bilan Annuel 2023',
                'original_name' => 'bilan_2023.xlsx',
                'file_path' => 'documents/3/bilan_2023.xlsx',
                'file_type' => 'xlsx',
                'mime_type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'file_size' => 456000,
                'category' => 'rapport',
                'tags' => ['bilan', 'annuel', '2023'],
                'document_date' => now()->subMonths(4),
            ],
            [
                'company_id' => 3,
                'folder_id' => 10,
                'uploaded_by' => 7,
                'name' => 'Dossier Client Premium',
                'original_name' => 'dossier_client_premium.pdf',
                'file_path' => 'documents/3/dossier_client_premium.pdf',
                'file_type' => 'pdf',
                'mime_type' => 'application/pdf',
                'file_size' => 789000,
                'category' => 'autre',
                'tags' => ['client', 'premium', 'dossier'],
                'document_date' => now()->subWeeks(2),
            ],
        ];

        foreach ($documents as $doc) {
            Document::create($doc);
        }
    }
}
