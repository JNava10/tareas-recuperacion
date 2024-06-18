<?php

namespace App\Http\Controllers;

use App\helpers\Common;
use App\Models\Difficulty;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Mockery\Exception;
use Symfony\Component\HttpFoundation\Response as SymphonyResponse;

class TaskController extends Controller
{
    function getAllTasks() {
        try {
            $tasks = Task::with('difficulty')->get();

            if ($tasks->isEmpty()) {
                return Common::sendStdResponse(
                    'No hay ninguna tarea en el sistema.',
                    ['tasks' => $tasks],
                    SymphonyResponse::HTTP_NOT_FOUND
                );
            }

            return Common::sendStdResponse(
                'Se han obtenido correctamente todas las tareas.',
                ['tasks' => $tasks]
            );
        } catch (Exception $exception)
        {
            return Common::sendStdResponse(
                'Ha ocurrido un error en el servidor.',
                [
                    'error' => $exception->getMessage()
                ],
                SymphonyResponse::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    function getAllWithAssignedBy() {
        try {
            $tasks = Task::with(['difficulty', 'assignedBy'])->get();

            if ($tasks->isEmpty()) {
                return Common::sendStdResponse(
                    'No hay ninguna tarea en el sistema.',
                    ['tasks' => $tasks],
                    SymphonyResponse::HTTP_NOT_FOUND
                );
            }

            return Common::sendStdResponse(
                'Se han obtenido correctamente todas las tareas.',
                ['tasks' => $tasks]
            );
        } catch (Exception $exception)
        {
            return Common::sendStdResponse(
                'Ha ocurrido un error en el servidor.',
                [
                    'error' => $exception->getMessage()
                ],
                SymphonyResponse::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    function getAllWithAssignedTo() {
        try {
            $tasks = Task::with(['difficulty', 'userAssigned'])->get();

            if ($tasks->isEmpty()) {
                return Common::sendStdResponse(
                    'No hay ninguna tarea en el sistema.',
                    ['tasks' => $tasks],
                    SymphonyResponse::HTTP_NOT_FOUND
                );
            }

            return Common::sendStdResponse(
                'Se han obtenido correctamente todas las tareas.',
                ['tasks' => $tasks]
            );
        } catch (Exception $exception)
        {
            return Common::sendStdResponse(
                'Ha ocurrido un error en el servidor.',
                [
                    'error' => $exception->getMessage()
                ],
                SymphonyResponse::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    function getAvailableTasks(Request $request) {
        try {
            $tasks = Task::with('difficulty')
                ->whereNull(['assigned_to', 'assigned_by'])
                ->get();

            if ($tasks->isEmpty()) {
                return Common::sendStdResponse(
                    'No hay ninguna tarea disponible.',
                    ['tasks' => $tasks],
                    SymphonyResponse::HTTP_NOT_FOUND
                );
            }

            return Common::sendStdResponse(
                'Se han obtenido correctamente todas las tareas.',
                ['tasks' => $tasks]
            );
        } catch (Exception $exception)
        {
            return Common::sendStdResponse(
                'Ha ocurrido un error en el servidor.',
                [
                    'error' => $exception->getMessage()
                ],
                SymphonyResponse::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    function getAllDifficulties() {
        try {
            $difficulties = Difficulty::all();

            if ($difficulties->isEmpty()) {
                return Common::sendStdResponse(
                    'No hay ninguna dificulta de tarea en el sistema.',
                    ['tasks' => $difficulties],
                    SymphonyResponse::HTTP_NOT_FOUND
                );
            }

            return Common::sendStdResponse(
                'Se han obtenido correctamente las dificultades de tarea.',
                ['difficulties' => $difficulties]
            );
        } catch (Exception $exception)
        {
            return Common::sendStdResponse(
                'Ha ocurrido un error en el servidor.',
                [
                    'error' => $exception->getMessage()
                ],
                SymphonyResponse::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }


    function deleteTask(int $id) {
        try {
            $task = Task::find($id);

            if (!$task) {
                return Common::sendStdResponse(
                    'No hay ninguna tarea coincidente.',
                    ['tasks' => $task],
                    SymphonyResponse::HTTP_NOT_FOUND
                );
            }

            if ($task->userAssigned()) {
                $task->userAssigned()->delete();
            }

            if ($task->assignedBy()) {
                $task->assignedBy()->delete();
            }

            $deleted = $task->delete();

            return Common::sendStdResponse(
                'Se ha borrado la tarea correctamente.',
                ['executed' => $deleted]
            );
        } catch (Exception $exception)
        {
            return Common::sendStdResponse(
                'Ha ocurrido un error en el servidor.',
                [
                    'error' => $exception->getMessage()
                ],
                SymphonyResponse::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    function editTask(int $id, Request $request) {
        $validate = Validator::make(
            $request->all(),
            [
                'name' => 'string|max:255',
                'description' => 'string|max:255',
                'scheduledHours' => 'integer|max:255',
                'realizedHours' => 'integer|max:255',
                'progress' => 'integer|max:255',
            ]
        );

        if ($validate->fails()) return Common::sendStdResponse(
            "Revisa la estructura de la petición e intentalo de nuevo.",
            [false],
            SymphonyResponse::HTTP_BAD_REQUEST
        );

        try {
            $task = Task::find($id);

            if (!$task) {
                return Common::sendStdResponse(
                    'No hay ninguna tarea coincidente.',
                    ['tasks' => $task],
                    SymphonyResponse::HTTP_NOT_FOUND
                );
            }

            if ($request->name) $task->name = $request->name;
            if (isset($request->description)) $task->description = $request->description;
            if (isset($request->scheduledHours)) $task->scheduled_hours = $request->scheduledHours;
            if (isset($request->realizedHours)) $task->realized_hours = $request->realizedHours;
            if (isset($request->progress)) $task->progress = $request->progress;

            $edited = $task->save();

            return Common::sendStdResponse(
                'Se ha editado la tarea correctamente.',
                ['executed' => $edited]
            );
        } catch (Exception $exception)
        {
            return Common::sendStdResponse(
                'Ha ocurrido un error en el servidor.',
                [
                    'error' => $exception->getMessage()
                ],
                SymphonyResponse::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }


    function createTask(Request $request) {
        $validate = Validator::make(
            $request->all(),
            [
                'name' => 'string|max:255',
                'description' => 'string|max:255',
                'scheduledHours' => 'integer|max:255',
                'realizedHours' => 'integer|max:255',
                'progress' => 'integer|max:255',
                'diffId' => 'integer|max:255',
            ]
        );

        if ($validate->fails()) return Common::sendStdResponse(
            "Revisa la estructura de la petición e intentalo de nuevo.",
            [false],
            SymphonyResponse::HTTP_BAD_REQUEST
        );

        try {
            $task = new Task();

            $task->name = $request->name;
            $task->description = $request->description;
            $task->scheduled_hours = $request->scheduledHours;
            $task->progress = $request->progress;
            $task->diff_id = $request->diffId;

            $created = $task->save();

            return Common::sendStdResponse(
                'Se ha creado la tarea correctamente.',
                ['executed' => $created]
            );
        } catch (Exception $exception)
        {
            return Common::sendStdResponse(
                'Ha ocurrido un error en el servidor.',
                [
                    'error' => $exception->getMessage()
                ],
                SymphonyResponse::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    function assignTask(int $id, Request $request) {
        $validate = Validator::make(
            $request->all(),
            [
                'assignTo' => 'required|integer|max:255',
                'assignedBy' => 'required|integer|max:255',
            ]
        );

        if ($validate->fails()) return Common::sendStdResponse(
            "Revisa la estructura de la petición e intentalo de nuevo.",
            [false],
            SymphonyResponse::HTTP_BAD_REQUEST
        );

        try {
            $task = Task::find($id);

            $task->assigned_to = $request->assignTo;
            $task->assigned_by = $request->assignedBy;

            $updated = $task->save();

            return Common::sendStdResponse(
                'Se ha asignado la tarea correctamente.',
                ['executed' => $updated]
            );
        } catch (Exception $exception)
        {
            return Common::sendStdResponse(
                'Ha ocurrido un error en el servidor.',
                [
                    'error' => $exception->getMessage()
                ],
                SymphonyResponse::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    function unassignTask(int $id) {
        try {
            $task = Task::find($id);

            $task->assigned_to = null;
            $task->assigned_by = null;

            $updated = $task->save();

            return Common::sendStdResponse(
                'Se ha liberado la tarea correctamente.',
                ['executed' => $updated]
            );
        } catch (Exception $exception)
        {
            return Common::sendStdResponse(
                'Ha ocurrido un error en el servidor.',
                [
                    'error' => $exception->getMessage()
                ],
                SymphonyResponse::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    function getAssignedTasks(int $id) {
        try {
            $tasks = Task::with(['difficulty', 'assignedBy'])
                ->where('assigned_to', $id)
                ->where('progress', '<', 100)
                ->get();

            if ($tasks->isEmpty()) {
                return Common::sendStdResponse(
                    'El usuario no tiene tareas asignadas.',
                    ['tasks' => $tasks]
                );
            }

            return Common::sendStdResponse(
                'Se han obtenido correctamente todas las tareas asignadas al usuarios.',
                ['tasks' => $tasks]
            );
        } catch (Exception $exception)
        {
            return Common::sendStdResponse(
                'Ha ocurrido un error en el servidor.',
                [
                    'error' => $exception->getMessage()
                ],
                SymphonyResponse::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    function getRealizedTasks(int $id) {
        try {
            $tasks = Task::with(['difficulty', 'assignedBy'])
                ->where('assigned_to', $id)
                ->where('progress', '=', '100')
                ->get();

            if ($tasks->isEmpty()) {
                return Common::sendStdResponse(
                    'El usuario no tiene tareas asignadas.',
                    ['tasks' => $tasks]
                );
            }

            return Common::sendStdResponse(
                'Se han obtenido correctamente todas las tareas asignadas al usuarios.',
                ['tasks' => $tasks]
            );
        } catch (Exception $exception)
        {
            return Common::sendStdResponse(
                'Ha ocurrido un error en el servidor.',
                [
                    'error' => $exception->getMessage()
                ],
                SymphonyResponse::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    function changeTaskProgress(int $id, Request $request) {
        $validate = Validator::make(
            $request->all(),
            [
                'progress' => 'required|integer|min:0|max:100',
            ]
        );

        if ($validate->fails()) return Common::sendStdResponse(
            "Revisa la estructura de la petición e intentalo de nuevo.",
            [false],
            SymphonyResponse::HTTP_BAD_REQUEST
        );

        try {
            $task = Task::find($id);

            if (!$task) {
                return Common::sendStdResponse(
                    'No hay ninguna tarea disponible.',
                    ['task' => $task],
                    SymphonyResponse::HTTP_NOT_FOUND
                );
            }

            $task->progress = $request->progress;

            $task->save();

            return Common::sendStdResponse(
                'Se ha editado el progreso de la tarea correctamente.',
                ['task' => $task]
            );
        } catch (Exception $exception)
        {
            return Common::sendStdResponse(
                'Ha ocurrido un error en el servidor.',
                [
                    'error' => $exception->getMessage()
                ],
                SymphonyResponse::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    function getMostAffineUser(int $taskId) {
        try {
            $task = Task::with('difficulty')->find($taskId);
            $diff = $task->difficulty->id;
            $hours = $task->scheduled_hours;


            // 1. Sacamos el ranking de usuarios que mas tareas hayan realizado, con un limite de 15.
            $baseUsers = DB::table('tasks')
                ->join('difficulties', 'tasks.diff_id', '=', 'difficulties.id')
                ->selectRaw('assigned_to AS user, COUNT(tasks.id) AS realizedCount')
                ->where('tasks.progress', '=', 100)
                ->where('difficulties.id', '=', $diff)
                ->groupBy('user')
                ->orderBy('realizedCount', 'desc')
                ->limit(20)
                ->get();

            $baseIds = $baseUsers->pluck('user');

            // Sacamos el top de dificultad de cada usuario base, según cuantas ha realizado.
            $topDiffs = DB::table('tasks')
                ->join('difficulties', 'tasks.diff_id', '=', 'difficulties.id')
                ->selectRaw('assigned_to AS user, tasks.diff_id AS difficulty, COUNT(tasks.id) AS realizedCount')
                ->where('tasks.progress', '=', 100)
                ->whereIn('tasks.assigned_to', $baseIds)
                ->groupBy('user', 'difficulty')
                ->orderBy('realizedCount', 'desc')
                ->get();

            // Sacamos quien es el usuario que mas tareas tiene
            $mostBusyUsers = DB::table('tasks')
                ->selectRaw('assigned_to AS user, COUNT(tasks.id) AS realizedCount')
                ->whereNotNull('tasks.assigned_to')
                ->whereIn('tasks.assigned_to', $baseIds)
                ->orderBy('realizedCount', 'desc')
                ->groupBy('user')
                ->get();

            // Sacamos la media de tiempo que tardan los usuarios en realizar tareas.
            $averageRealizeTime = DB::table('tasks')
                ->selectRaw('assigned_to AS user, AVG(tasks.realized_hours) AS averageTime')
                ->whereNotNull('tasks.assigned_to')
                ->whereIn('tasks.assigned_to', $baseIds)
                ->orderBy('averageTime', 'desc')
                ->groupBy('user')
                ->get();

            echo json_encode($averageRealizeTime);

            $pointList = []; // Array clave-valor con clave: ID de usuario, valor: Puntuacion.
            $basePoints = $baseIds->count() - (floor($baseUsers->count() * 0.20)); // Le restamos un porcentaje para balancear, y que los primeros no tengan tanta ventaja.

            foreach ($baseIds as $id) {
                $pointList[$id] = $basePoints;
            }


            if (!$task) {
                return Common::sendStdResponse(
                    'No existe la tarea en el sistema.',
                    [],
                    SymphonyResponse::HTTP_NOT_FOUND
                );
            }

//            return Common::sendStdResponse(
//                'Se han obtenido correctamente todos los usuarios.',
//                ['roles' => $user->roles]
//            );
        } catch (Exception $exception)
        {
            return Common::sendStdResponse(
                'Ha ocurrido un error en el servidor.',
                [
                    'error' => $exception->getMessage()
                ],
                SymphonyResponse::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

}
