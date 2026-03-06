<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user for Ian Jay
        User::firstOrCreate(
            ['email' => 'admin@wedding.com'],
            [
                'name' => 'Ian Jay Broñola',
                'email_verified_at' => now(),
                'password' => bcrypt('password'),
            ]
        );
    }
}
