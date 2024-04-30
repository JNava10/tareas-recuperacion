<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\RoleController;
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

Route::prefix('/user')->group(function () {
    Route::get('admin', [UserController::class, 'getAllAdmins']);
    Route::get('/', [UserController::class, 'getAllUsers']);
    Route::get('dev', [UserController::class, 'getAllDevelopers']);
    Route::get('fullname', [UserController::class, 'getUsersByFullname']);
    Route::get('email', [UserController::class, 'getUserByEmail']);

    Route::put('data', [UserController::class, 'editUserData']);
    Route::put('password', [UserController::class, 'editUserPassword']);
    Route::delete('/{id}', [UserController::class, 'deleteUser']);
    Route::post('restore', [UserController::class, 'restoreUser']);
});

Route::prefix('/role')->group(function () {
    Route::get('/', [RoleController::class, 'getAllRoles']);
});
