<?php

namespace App\Http\Controllers;

use App\helpers\Common;
use App\Models\RecoverCode;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response as SymphonyResponse;

class AuthController extends Controller
{
    function login(Request $request) {
        $validate = Validator::make(
            $request->all(),
            [
                'email' => 'required|email|max:255',
                'password' => 'required|max:255|string',
            ]
        );

        if ($validate->fails()) return Common::sendStdResponse(
            "Revisa la estructura de la petición e intentalo de nuevo.",
            [
                "logged" => false,
            ],
            SymphonyResponse::HTTP_BAD_REQUEST
        );

        $authAttempt = Auth::attempt([
            'email' => $request->email,
            'password' => $request->password
        ]);

        if (!$authAttempt) return Common::sendStdResponse(
            "Credenciales incorrectas. Revisa las credenciales introducidas de nuevo.",
            [
                "logged" => false,
            ]
        );

        $abilities = $this->getUserAbilities($request->email);

        $auth = Auth::user();
        $token =  $auth->createToken($request->email, $abilities)->plainTextToken;

        return Common::sendStdResponse(
            "Se ha iniciado sesión correctamente.",
            [
                "logged" => true,
                "token" => $token
            ]
        );
    }

    /*
     * Explicación sobre el algoritmo de recuperación de contraseña:
     *
     * Se ha implementado un sistema seguro en donde el usuario puede cambiar su contraseña a traves de codigos de un unico uso.
     * Es decir, cada vez que el usuario quiere recuperar su contraseña, debe introducir un codigo unico para poder cambiar su contraseña.
     *
     * 1. El usuario pide recuperar su contraseña. El servidor crea un nuevo codigo de un solo uso asociado al usuario y se le envia por email.
     *
     * 2. El usuario introduce el codigo que se le ha enviado por email, y el sistema comprueba si es correcto. Si es asi, el usuario recibirá una clave unica
     * asociada a su email, que servirá como identifiación a la hora de cambiar la contraseña.
     *
     * 3. El usuario manda la contraseña nueva, con la clave que ha recibido. Si todo es correcto, se cambiará la contraseña.
     * */

    public function generateRecoverCode(Request $request) {
        $validate = Validator::make(
            $request->all(),
            [
                'email' => 'required|email|max:255',
            ]
        );

        if ($validate->fails()) return Common::sendStdResponse(
            "Revisa la estructura de la petición e intentalo de nuevo.",
            [false],
            SymphonyResponse::HTTP_BAD_REQUEST
        );

        try
        {
            $email = $request->email;
            $user = User::where('email', $email)->first();

            if ($user) {
                $code = $this->generatePasswordCode($user);

                $this->sendRecoverEmail($code, $email, $user);

                return Common::sendStdResponse(
                    "Codigo de recuperación generado y enviado a $email",
                    ['executed' => true]
                );
            } else return Common::sendStdResponse(
                'Usuario no encontrado',
                ['executed' => false]
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

    public function checkRecoverCode(Request $request) {
        $validate = Validator::make(
            $request->all(),
            [
                'email' => 'required|email|max:255',
                'code' => 'required|integer|max_digits:6'
            ]
        );

        if ($validate->fails()) return Common::sendStdResponse(
            "Revisa la estructura de la petición e intentalo de nuevo.",
            [false],
            SymphonyResponse::HTTP_BAD_REQUEST
        );

        try
        {
            $user = User::where('email', $request->email)->first();

            if (!$user) return Common::sendStdResponse(
                "No se ha encontrado ningun usuario asociado.",
                ['executed' => false]
            );

            $lastUserCode = RecoverCode::where('user', $user->id)
                ->orderBy('expires_at', 'desc')
                ->first();

            if (!$lastUserCode) return Common::sendStdResponse(
                "El usuario no tiene ningun codigo asociado.",
                ['executed' => false]
            );

            if ($lastUserCode->used === false) return Common::sendStdResponse(
                "El codigo introducido ya ha sido usado.",
                ['executed' => false]
            );

            $codeExpireDate = $lastUserCode->expires_at;

            echo $lastUserCode->code;
            echo $request->code;

            // Comprobamos si el codigo ha expirado comprobando si su fecha de expiracion es superior a la fecha actual.
            if (now()->gt($codeExpireDate)) return Common::sendStdResponse(
                "El codigo introducido está expirado.",
                ['executed' => false]
            );

            if ($lastUserCode->code == $request->code) {
                $lastUserCode->used = true;
                $lastUserCode->save();

                return Common::sendStdResponse(
                    "Se ha validado el codigo introducido correctamente.",
                    [
                        'executed' => true,
                        'key' => $lastUserCode->key
                    ]
                );
            }
            else return Common::sendStdResponse(
                "El codigo introducido no es correcto.",
                ['executed' => false]
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

    public function changePassword(Request $request) {
        $validate = Validator::make(
            $request->all(),
            [
                'email' => 'required|email|max:255',
                'password' => 'required|string|max:35',
                'key' => 'required|string|max:10'
            ]
        );

        if ($validate->fails()) return Common::sendStdResponse(
            "Revisa la estructura de la petición e intentalo de nuevo.",
            [false],
            SymphonyResponse::HTTP_BAD_REQUEST
        );

        try
        {
            $user = User::where('email', $request->email)->first();

            if (!$user) return Common::sendStdResponse(
                "No se ha encontrado ningun usuario asociado.",
                ['executed' => false]
            );

            $lastUserCode = RecoverCode::where('user', $user->id)
                ->where('used', true)
                ->orderBy('expires_at', 'desc')
                ->first();

            if ($lastUserCode->key !== $request->key) return Common::sendStdResponse(
                "Clave invalida.",
                ['executed' => false]
            );

            $codeExpireDate = Carbon::make($lastUserCode->expires_at);

            if (now()->gt($codeExpireDate)) return Common::sendStdResponse(
                "La clave está expirada.",
                ['executed' => false]
            );

            $user->password = Hash::make($request->password);
            $userSaved = $user->save();

            if ($userSaved) return Common::sendStdResponse(
                "Se ha cambiado la contraseña correctamente.",
                ['executed' => true]
            );
            else return Common::sendStdResponse(
                "No se ha podido cambiar la contraseña.",
                ['executed' => false]
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

    private function generatePasswordCode(User $user)
    {
        $digitRange = config('constants.pass_code_digit');
        $code = rand($digitRange['min'], $digitRange['max']);
        $expireMinutes = 15;

        $recoverCode = new RecoverCode();
        $recoverCode->user = $user->id;
        $recoverCode->code = str($code);
        $recoverCode->key = Str::random(10); // Esto servirá como seguridad al cambiar la contraseña despues.
        $recoverCode->expires_at = now()->addMinutes($expireMinutes);

        $saved = $recoverCode->save() !== null;

        if ($saved) return $code;
        else return false;
    }

    private function getUserAbilities(string $email)
    {
        return User::where('email', $email)
            ->first()
            ->roles
            ->pluck('name')
            ->toArray();
    }

    /**
     * @param bool|int $code
     * @param mixed $email
     * @return void
     */
    public function sendRecoverEmail(bool|int $code, string $email, string $user): void
    {
        $mailData = ['code' => $code, 'email' => $email];
        $senderAddress = env('MAIL_FROM_ADDRESS');

        Mail::send('recover-password', $mailData, function ($message) use ($email, $senderAddress) {
            $message->to($email)->subject('Recuperación de contraseña de Tareas');
            $message->from($senderAddress, 'Tareas DAW2');
        });
    }
}
