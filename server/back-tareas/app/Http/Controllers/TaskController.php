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
}