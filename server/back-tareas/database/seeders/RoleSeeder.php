<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    static $roles = ['admin', 'desarrollador'];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (self::$roles as $name) {
            DB::table('roles')->insert(['name' => $name]);
        }
    }
}
