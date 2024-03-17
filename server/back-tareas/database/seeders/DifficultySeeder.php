<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DifficultySeeder extends Seeder
{
    static $diffNames = ['xs', 's', 'm', 'l', 'xl'];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (self::$diffNames as $name) {
            DB::table('difficulties')->insert(['name' => $name]);
        }
    }
}
