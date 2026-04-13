<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Seed a default admin user for testing.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@burqahouse.com'],
            [
                'name'     => 'Admin',
                'password' => Hash::make('password'),
                'role'     => 'admin',
                'phone'    => '+8801700000000',
            ]
        );

        User::updateOrCreate(
            ['email' => 'customer@burqahouse.com'],
            [
                'name'     => 'Test Customer',
                'password' => Hash::make('password'),
                'role'     => 'customer',
                'phone'    => '+8801711111111',
            ]
        );
    }
}
