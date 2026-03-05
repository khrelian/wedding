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
        User::factory()->create([
            'name' => 'Ian Jay Broñola',
            'email' => 'admin@wedding.com',
            'password' => bcrypt('password'), // Change this to your preferred password
        ]);
    }
}
