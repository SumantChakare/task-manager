<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Administrator Account
        User::updateOrCreate(
            ['email' => 'sumant@example.com'],
            [
                'name' => 'Sumant',
                'password' => Hash::make('password123'),
                'role' => 'admin',
            ]
        );

        // 2. Standard Regular User Account
        User::updateOrCreate(
            ['email' => 'user@example.com'],
            [
                'name' => 'Demo User',
                'password' => Hash::make('password123'),
                'role' => 'user',
            ]
        );
    }
}
