<?php

namespace App\Http\Controllers;

use App\helpers\Common;
use App\Models\AssignedRoles;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Mockery\Exception;
use Symfony\Component\HttpFoundation\Response as SymphonyResponse;

class UserController extends Controller
{
    function getAllUsers() {
        try {
            $users = User::withTrashed()->get();

            if ($users->isEmpty()) {
                return Common::sendStdResponse(
                    'No hay ningun usuario en el sistema.',
                    ['users' => $users],
                    SymphonyResponse::HTTP_NOT_FOUND
                );
            }

            return Common::sendStdResponse(
                'Se han obtenido correctamente todos los usuarios.',
                ['users' => $users]
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

    function getUser(int $id) {
        try {
            $user = User::with('roles')->find($id);

            if (!$user) {
                return Common::sendStdResponse(
                    'No existe ningun usuario coincidente.',
                    [$user],
                    SymphonyResponse::HTTP_NOT_FOUND
                );
            }

            return Common::sendStdResponse(
                'Se han obtenido correctamente el usuario.',
                [$user]
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
            $validate = Validator::make(
                $request->all(),
                [
                    'search' => 'required|string|max:255'
                ]
            );

            if ($validate->fails()) return Common::sendStdResponse(
                "Revisa la estructura de la petición e intentalo de nuevo.",
                [false],
                SymphonyResponse::HTTP_BAD_REQUEST
            );

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
            $validate = Validator::make(
                $request->all(),
                [
                    'email' => 'required|email|max:255'
                ]
            );

            if ($validate->fails()) return Common::sendStdResponse(
                "Revisa la estructura de la petición e intentalo de nuevo.",
                [false],
                SymphonyResponse::HTTP_BAD_REQUEST
            );

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

    function searchUser(string $searchInput) {
        try {
            $users = User::whereLike('name', strtolower($searchInput))
                ->whereLike('first_lastname', strtolower($searchInput))
                ->whereLike('second_lastname', strtolower($searchInput))
                ->whereLike('nickname', strtolower($searchInput))
                ->get();

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

    function editUserData(Request $request) {
        $validate = Validator::make(
            $request->all(),
            [
                'id' => 'required|string|max:255',
                'name' => 'string|max:255',
                'firstSurname' => 'string|max:255',
                'secondSurname' => 'string|max:255',
            ]
        );

        if ($validate->fails()) return Common::sendStdResponse(
            "Revisa la estructura de la petición e intentalo de nuevo.",
            [false],
            SymphonyResponse::HTTP_BAD_REQUEST
        );

        try {
            $user = User::find($request->id);

            if ($request->name) $user->name = $request->name;
            elseif ($request->firstLastname) $user->first_lastname = $request->firstLastname;
            elseif ($request->secondLastname) $user->second_lastname = $request->secondSurname;
            else return Common::sendStdResponse(
                'No se ha indicado ningun campo que actualizar.',
                ['executed' => false]
            );

            $user->save();

            return Common::sendStdResponse(
                'Se ha actualizado el usuario correctamente.',
                ['executed' => true]
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

    function editUserPassword(Request $request) {
        $validate = Validator::make(
            $request->all(),
            [
                'id' => 'required|string|max:255',
                'password' => 'required|string|max:255'
            ]
        );

        if ($validate->fails()) return Common::sendStdResponse(
            "Revisa la estructura de la petición e intentalo de nuevo.",
            [false],
            SymphonyResponse::HTTP_BAD_REQUEST
        );

        try {
            $user = User::find($request->id);
            $user->password = Hash::make($request->password);

            $user->save();

            return Common::sendStdResponse(
                'Se ha actualizado la contraseña del usuario correctamente.',
                ['executed' => true]
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

    function deleteUser(int $id) {
        try {
            $user = User::find($id);

            if (!$user) return Common::sendStdResponse(
                    'No se ha encontrado ningun usuario activo que coincida.',
                    ['executed' => false],
                SymphonyResponse::HTTP_NOT_FOUND
            );

            $deleted = $user->delete();
            $msg = $deleted ? 'Se ha borrado el usuario correctamente.' : 'No se ha podido borrar el usuario.';

            return Common::sendStdResponse(
                $msg,
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

    function restoreUser(Request $request) {
        try {
            $validate = Validator::make(
                $request->all(),
                [
                    'id' => 'required|integer|max:255',
                ]
            );

            if ($validate->fails()) return Common::sendStdResponse(
                "Revisa la estructura de la petición e intentalo de nuevo.",
                [false],
                SymphonyResponse::HTTP_BAD_REQUEST
            );

            $user = User::withTrashed()->find($request->id);

            if (!$user) return Common::sendStdResponse(
                'No se ha encontrado ningun usuario coincidente.',
                ['executed' => false],
                SymphonyResponse::HTTP_NOT_FOUND
            );

            if ($user->deleted_at === null) return Common::sendStdResponse(
                'El usuario ya estaba activado.',
                ['executed' => false]
            );

            $restored = $user->restore();
            $msg = $restored ? 'Se ha activado el usuario correctamente.' : 'No se ha podido activar el usuario.';

            return Common::sendStdResponse(
                $msg,
                ['executed' => $restored]
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

    function createUser(Request $request) {
        try {
            $validate = Validator::make(
                $request->all(),
                [
                    'name' => 'required|string|max:255',
                    'email' => 'required|string|max:255',
                    'first_lastname' => 'required|string|max:255',
                    'second_lastname' => 'required|string|max:255',
                    'password' => 'required|string|max:255',
                    'roles' => 'array',
                    'roles.*' => 'integer|required|max:255'
                ]
            );

            if ($validate->fails()) return Common::sendStdResponse(
                "Revisa la estructura de la petición e intentalo de nuevo.",
                [false],
                SymphonyResponse::HTTP_BAD_REQUEST
            );

            $emailExists = User::where('email', $request->email)->exists();

            if ($emailExists) return Common::sendStdResponse(
                'Ya existe un usuario con el correo electronico indicado.',
                ['executed' => false]
            );

            $user = new User();

            $user->name = $request->name;
            $user->email = $request->email;
            $user->first_lastname = $request->first_lastname;
            $user->second_lastname = $request->second_lastname;
            $user->password = Hash::make($request->password);

            $saved = $user->save();
            $userId = User::where('email', $request->email)->first()->id;


            foreach ($request->roles as $roleId) {
                $assignedRole = new AssignedRoles();

                $assignedRole->user_id = $userId;
                $assignedRole->role_id = $roleId;
                $assignedRole->created_at = now();
                $assignedRole->updated_at = now();
                $assignedRole->save();
            }

            return Common::sendStdResponse(
                'Se ha guardado el usuario correctamente.',
                ['executed' => $saved]
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

    function updateUserRoles(int $id, Request $request) {
        $validate = Validator::make(
            $request->all(),
            [
                'roles' => 'required|array',
                'roles.*' => 'required|int|max:255'
            ]
        );

        if ($validate->fails()) return Common::sendStdResponse(
            "Revisa la estructura de la petición e intentalo de nuevo.",
            [false],
            SymphonyResponse::HTTP_BAD_REQUEST
        );

        try {
            foreach ($request->roles as $role) {
                $assignedRole = new AssignedRoles();

                $assignedRole->user_id = $id;
                $assignedRole->role_id = $role;

                $assignedRole->save();
            }

            return Common::sendStdResponse(
                'Se han asignado los roles correctamente.',
                ['executed' => true]
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

    public function changeProfilePic(int $userId, Request $request) {
        $validate = Validator::make(
            $request->all(),
            [
                'image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            ]
        );

        if ($validate->fails()) return Common::sendStdResponse(
            "Revisa la estructura de la petición e intentalo de nuevo.",
            ['fails' => $validate->failed(), 'request' =>  $request->all()],
            SymphonyResponse::HTTP_BAD_REQUEST
        );

        $file = $request->file('image');
        $path = $file->store('profile_pìcs', 's3');
        $url = Storage::disk('s3')->url($path);

        if (!$url) return Common::sendStdResponse(
            "Ha ocurrido un error al subir la imagen.",
            [false],
            SymphonyResponse::HTTP_INTERNAL_SERVER_ERROR
        );

        $user = User::find($userId);
        $user->pic_url = $url;
        $user->save();

        return Common::sendStdResponse(
            'Se ha cambiado la foto de perfil correctamente.',
            ['url' => $url]
        );
    }

    function getUserRoles(int $id) {
        try {
            $user = User::with('roles')->find($id);

            if (!$user) {
                return Common::sendStdResponse(
                    'No existe el usuario en el sistema.',
                    ['users' => $user],
                    SymphonyResponse::HTTP_NOT_FOUND
                );
            }

            return Common::sendStdResponse(
                'Se han obtenido correctamente todos los usuarios.',
                ['roles' => $user->roles]
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
