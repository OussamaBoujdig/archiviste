<?php

namespace Database\Seeders;

use App\Models\Company;
use Illuminate\Database\Seeder;

class CompanySeeder extends Seeder
{
    public function run(): void
    {
        $companies = [
            [
                'name' => 'TechCorp Solutions',
                'email' => 'contact@techcorp.ma',
                'phone' => '+212 522 123 456',
                'address' => '123 Boulevard Mohammed V, Casablanca',
                'plan' => 'enterprise',
                'status' => 'active',
                'storage_used' => 25 * 1024 * 1024 * 1024,
                'storage_limit' => 500 * 1024 * 1024 * 1024,
                'users_count' => 45,
                'users_limit' => 100,
                'documents_count' => 1250,
                'monthly_revenue' => 2500.00,
                'subscription_start' => now()->subMonths(6),
                'subscription_end' => now()->addMonths(6),
            ],
            [
                'name' => 'MarocBTP',
                'email' => 'info@marocbtp.ma',
                'phone' => '+212 537 789 012',
                'address' => '45 Avenue Hassan II, Rabat',
                'plan' => 'professional',
                'status' => 'active',
                'storage_used' => 12 * 1024 * 1024 * 1024,
                'storage_limit' => 50 * 1024 * 1024 * 1024,
                'users_count' => 18,
                'users_limit' => 25,
                'documents_count' => 567,
                'monthly_revenue' => 990.00,
                'subscription_start' => now()->subMonths(3),
                'subscription_end' => now()->addMonths(9),
            ],
            [
                'name' => 'Atlas Finance',
                'email' => 'support@atlasfinance.ma',
                'phone' => '+212 528 456 789',
                'address' => '78 Rue de la Liberté, Marrakech',
                'plan' => 'professional',
                'status' => 'active',
                'storage_used' => 8 * 1024 * 1024 * 1024,
                'storage_limit' => 50 * 1024 * 1024 * 1024,
                'users_count' => 12,
                'users_limit' => 25,
                'documents_count' => 423,
                'monthly_revenue' => 990.00,
                'subscription_start' => now()->subMonths(4),
                'subscription_end' => now()->addMonths(8),
            ],
            [
                'name' => 'Sahara Import',
                'email' => 'contact@saharaimport.ma',
                'phone' => '+212 535 321 654',
                'address' => '12 Zone Industrielle, Fès',
                'plan' => 'starter',
                'status' => 'active',
                'storage_used' => 2 * 1024 * 1024 * 1024,
                'storage_limit' => 5 * 1024 * 1024 * 1024,
                'users_count' => 4,
                'users_limit' => 5,
                'documents_count' => 156,
                'monthly_revenue' => 290.00,
                'subscription_start' => now()->subMonths(2),
                'subscription_end' => now()->addMonths(10),
            ],
            [
                'name' => 'MediPharm Plus',
                'email' => 'admin@medipharm.ma',
                'phone' => '+212 522 987 654',
                'address' => '234 Boulevard Zerktouni, Casablanca',
                'plan' => 'enterprise',
                'status' => 'suspended',
                'storage_used' => 35 * 1024 * 1024 * 1024,
                'storage_limit' => 500 * 1024 * 1024 * 1024,
                'users_count' => 67,
                'users_limit' => 100,
                'documents_count' => 2100,
                'monthly_revenue' => 2500.00,
                'subscription_start' => now()->subMonths(8),
                'subscription_end' => now()->subMonths(1),
            ],
        ];

        foreach ($companies as $company) {
            Company::create($company);
        }
    }
}
