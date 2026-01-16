<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Super Admin
        User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@amandocs.ma',
            'password' => Hash::make('password'),
            'role' => 'super_admin',
            'status' => 'active',
            'company_id' => null,
        ]);

        // Company 1 Users (TechCorp)
        User::create([
            'name' => 'Ahmed Benali',
            'email' => 'ahmed@techcorp.ma',
            'password' => Hash::make('password'),
            'role' => 'client_admin',
            'status' => 'active',
            'company_id' => 1,
            'department' => 'Direction',
            'phone' => '+212 661 123 456',
        ]);

        User::create([
            'name' => 'Fatima Zahra',
            'email' => 'fatima@techcorp.ma',
            'password' => Hash::make('password'),
            'role' => 'client_user',
            'status' => 'active',
            'company_id' => 1,
            'department' => 'Comptabilité',
            'phone' => '+212 662 234 567',
        ]);

        User::create([
            'name' => 'Youssef El Amrani',
            'email' => 'youssef@techcorp.ma',
            'password' => Hash::make('password'),
            'role' => 'read_only',
            'status' => 'active',
            'company_id' => 1,
            'department' => 'Audit',
            'phone' => '+212 663 345 678',
        ]);

        // Company 2 Users (MarocBTP)
        User::create([
            'name' => 'Karim Tazi',
            'email' => 'karim@marocbtp.ma',
            'password' => Hash::make('password'),
            'role' => 'client_admin',
            'status' => 'active',
            'company_id' => 2,
            'department' => 'Direction Générale',
            'phone' => '+212 664 456 789',
        ]);

        User::create([
            'name' => 'Nadia Benhaddou',
            'email' => 'nadia@marocbtp.ma',
            'password' => Hash::make('password'),
            'role' => 'client_user',
            'status' => 'active',
            'company_id' => 2,
            'department' => 'RH',
            'phone' => '+212 665 567 890',
        ]);

        // Company 3 Users (Atlas Finance)
        User::create([
            'name' => 'Omar Idrissi',
            'email' => 'omar@atlasfinance.ma',
            'password' => Hash::make('password'),
            'role' => 'client_admin',
            'status' => 'active',
            'company_id' => 3,
            'department' => 'Direction',
            'phone' => '+212 666 678 901',
        ]);

        // Company 4 Users (Sahara Import)
        User::create([
            'name' => 'Hassan Alaoui',
            'email' => 'hassan@saharaimport.ma',
            'password' => Hash::make('password'),
            'role' => 'client_admin',
            'status' => 'active',
            'company_id' => 4,
            'department' => 'Direction',
            'phone' => '+212 667 789 012',
        ]);
    }
}
