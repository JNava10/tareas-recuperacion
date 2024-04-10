<?php

namespace App\Http\Controllers;

use App\helpers\Common;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Http\Request;
use Mockery\Exception;
use Symfony\Component\HttpFoundation\Response as SymphonyResponse;

class UserController extends Controller
{
    function getAllUsers() {
        try {
            $users = User::all();

            if ($users->isEmpty()) {
                return Common::sendStdResponse(
                    'No hay ningun usuario en el sistema.',
                    ['users', $users],
                    SymphonyResponse::HTTP_NOT_FOUND
                );
            }

            return Common::sendStdResponse(
                'Se han obtenido correctamente todos los usuarios.',
                ['users', $users]
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

    function getAllDevelopers() {
        try {
            // Se usa WhereHas en vez de With para evitar traer todos los registros. Al no ser una consulta join, es necesario para filtrar los resultados.
            $users = User::withWhereHas('roles', function ($query) {
                $query->where('name', '=','developer');
            })->get();

            if ($users->isEmpty()) {
                return Common::sendStdResponse(
                    'No hay ningun usuario desarrollador en el sistema.',
                    ['users' => $users],
                    SymphonyResponse::HTTP_NOT_FOUND
                );
            }

            return Common::sendStdResponse(
                'Se han obtenido correctamente todos los usuarios.',
                ['users' => $users],

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

    function getAllAdmins() {
        try {
            $users = User::withWhereHas('roles', function ($query) {
                $query->where('name', '=', 'admin');
            })->get();

            if ($users->isEmpty()) {
                return Common::sendStdResponse(
                    'No se han encontrado usuarios administradores.',
                    ['users' => $users, 'executed' => true],
                    SymphonyResponse::HTTP_NOT_FOUND
                );
            }

            return Common::sendStdResponse(
                'Se han obtenido correctamente los usuarios.',
                ['users' => $users, 'executed' => true]
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

    function getUsersByFullname(Request $request) {
        try {
            $lowerSearch = strtolower($request->search);

            $users = User::orWhere( function (Builder $query) use ($lowerSearch) {
                $query->whereRaw('LOWER(name) = ?', [$lowerSearch])
                    ->whereRaw('LOWER(first_lastname) = ?', [$lowerSearch])
                    ->whereRaw('LOWER(second_lastname) = ?', [$lowerSearch]);
            })->get();

            if ($users->isEmpty()) {
                return Common::sendStdResponse(
                    'No se han encontrado usuarios administradores.',
                    ['users' => $users, 'executed' => true],
                    SymphonyResponse::HTTP_NOT_FOUND
                );
            }

            return Common::sendStdResponse(
                'Se han obtenido correctamente los usuarios.',
                ['users' => $users, 'executed' => true]
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

    function getUserByEmail(Request $request) {
        try {
            $users = User::where('name', strtolower($request->email))->first();

            if ($users->isEmpty()) {
                return Common::sendStdResponse(
                    'No se han encontrado usuarios administradores.',
                    ['users' => $users, 'executed' => true],
                    SymphonyResponse::HTTP_NOT_FOUND
                );
            }

            return Common::sendStdResponse(
                'Se han obtenido correctamente los usuarios.',
                ['users' => $users, 'executed' => true]
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
