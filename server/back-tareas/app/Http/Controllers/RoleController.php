<?php

namespace App\Http\Controllers;

use App\helpers\Common;
use App\Models\Role;
use Illuminate\Http\Request;
use Mockery\Exception;
use Symfony\Component\HttpFoundation\Response as SymphonyResponse;

class RoleController extends Controller
{
    function getAllRoles() {
        try {
            $roles = Role::all();

            if ($roles->isEmpty()) {
                return Common::sendStdResponse(
                    'No hay ningun usuario en el sistema.',
                    ['roles' => $roles],
                    SymphonyResponse::HTTP_NOT_FOUND
                );
            }

            return Common::sendStdResponse(
                'Se han obtenido correctamente los roles.',
                ['roles' => $roles]
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
