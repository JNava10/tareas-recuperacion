<?php

namespace Database\Factories;

use App\Models\Difficulty;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    static $taskNames = [
        'Ver el GP de Australia',
        'Encontrar el octavo título mundial de Hamilton',
        'Implementar la base de datos para seguimiento de resultados',
        'Crear un sistema de clasificación de pilotos',
        'Desarrollar un simulador de carreras en línea',
        'Implementar un CRUD de equipos de F1',
        'Asignar roles y permisos para administradores de F1',
        'Integrar API de F1 para obtener datos en tiempo real',
        'Configurar un servidor de streaming para transmisiones de F1',
        'Organizar un torneo virtual de F1 entre amigos',
        'Investigar sobre los mejores momentos históricos de F1',
        'Crear un blog sobre estrategias de carrera en F1',
        'Desarrollar una aplicación móvil para seguir F1 en vivo',
        'Implementar un chatbot para responder preguntas sobre F1',
        'Investigar tecnologías para reducir emisiones en F1',
        'Colaborar con universidades para proyectos de investigación en F1',
        'Desarrollar un sistema de gestión de residuos de neumáticos usados en F1',
        'Promover la adopción de vehículos eléctricos en el paddock de F1',
        'Organizar eventos educativos sobre sostenibilidad en F1',
        'Implementar medidas de eficiencia energética en instalaciones de F1',
        'Investigar en tecnologías de baterías reciclables para F1',
        'Desarrollar protocolos de construcción sostenible para circuitos de F1',
    ];

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $users = User::all(['id']);

        echo $users;

        return [
            'name' => fake()->randomElement(self::$taskNames),
            'description' => fake()->word(),
            'diff_id' => Difficulty::find(rand(1, 3))->id,
            'assigned_to' => fake()->randomElement($users)->id,
            'assigned_by' => fake()->randomElement($users)->id,
            'progress' => fake()->numberBetween(98, 100),
            'scheduled_hours' => fake()->numberBetween(0, 100),
            'realized_hours' => fake()->numberBetween(0, 100),
        ];
    }
}
