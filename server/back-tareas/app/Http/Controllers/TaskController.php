<?php

namespace App\Http\Controllers;

use App\helpers\Common;
use App\Models\Difficulty;
use App\Models\Task;
use Illuminate\Http\Request;
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
}
