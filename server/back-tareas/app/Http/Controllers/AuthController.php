<?php

namespace App\Http\Controllers;

use App\helpers\Common;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
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

    private function getUserAbilities(string $email)
    {
        return User::where('email', $email)
            ->first()
            ->roles
            ->pluck('name')
            ->toArray();
    }
}
