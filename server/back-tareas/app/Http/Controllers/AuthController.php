<?php

namespace App\Http\Controllers;

use App\helpers\Common;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response as SymphonyResponse;

class AuthController extends Controller
{
    function login(Request $request) {
        //        $validate = $request->validate([
        //            'email' => 'required|email|max:255',
        //            'password' => 'required|max:255|string',
        //        ]);

        $authAttempt = Auth::attempt([
            'email' => $request->email,
            'password' => $request->password
        ]);

        if (!$authAttempt) return Common::sendStdResponse(
            "Credenciales incorrectas. Revisa las credenciales introducidas de nuevo.",
            [
                "logged" => false,
            ],
            SymphonyResponse::HTTP_UNAUTHORIZED
        );

        $auth = Auth::user();
        $token =  $auth->createToken($request->email)->plainTextToken;

        return Common::sendStdResponse(
            "Se ha iniciado sesión correctamente.",
            [
                "logged" => true,
                "token" => $token
            ]
        );
    }
}
