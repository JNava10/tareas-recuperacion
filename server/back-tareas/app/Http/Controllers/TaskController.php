<?php

namespace App\Http\Controllers;

use App\helpers\Common;
use App\Models\Difficulty;
use App\Models\Task;
use Illuminate\Http\Request;
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

            if ($task->user()) $task->user()->delete();

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
}
