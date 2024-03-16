<?php

namespace Database\Factories;

use App\Models\Difficulty;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    static $taskNames = [
        'Ver el GP de Australia',
        'Encontrar el octavo titulo mundial de Hamilton',
        'Implementar la base de datos',
        'Implementar un CRUD de usuarios',
        'Implementar la asignación de tareas',
    ];

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->randomElement(self::$taskNames),
            'description' => fake()->word(),
            'diff_id' => Difficulty::find(1)->id
        ];
    }
}
