<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    static $userCount = 10;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()
            ->count(UserSeeder::$userCount)
            ->create();

        User::factory()->create(
            ['email' =>  config('constants.default_email')]
        );
    }
}
