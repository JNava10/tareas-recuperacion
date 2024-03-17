<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    function login(Request $request) {

//        $validate = $request->validate([
//            'email' => 'required|email|max:255',
//            'password' => 'required|max:255|string',
//        ]);
        return response()->json($request->user());

        $token = $request->user()->createToken($request->email);

        return response()->json(['token' => $token->plainTextToken]);
    }
}
