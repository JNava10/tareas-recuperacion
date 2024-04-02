<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('/auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('gen_recover_code', [AuthController::class, 'generateRecoverCode']);
    Route::post('check_recover_code', [AuthController::class, 'checkRecoverCode']);
    Route::post('change_password', [AuthController::class, 'changePassword']);
});
