<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\TaskController;
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
    Route::post('', [UserController::class, 'createUser']);
    Route::get('/search/{searchInput}', [UserController::class, 'searchUser']);

    Route::put('/roles/{id}', [UserController::class, 'updateUserRoles']);
    Route::get('/roles/{id}', [UserController::class, 'getUserRoles']);
    Route::post('/profile_pic/{userId}', [\App\Http\Controllers\UserController::class, 'changeProfilePic']);

});

Route::prefix('/role')->group(function () {
    Route::get('/', [RoleController::class, 'getAllRoles']);
});

Route::prefix('/task')->group(function () {
    Route::get('/', [TaskController::class, 'getAllTasks']);
    Route::get('/difficulties', [TaskController::class, 'getAllDifficulties']);
    Route::delete('/{id}', [TaskController::class, 'deleteTask']);
    Route::put('/{id}', [TaskController::class, 'editTask']);
    Route::post('/', [TaskController::class, 'createTask']);
    Route::post('/assign/{id}', [TaskController::class, 'assignTask']);
    Route::post('/unassign/{id}', [TaskController::class, 'unassignTask']);
    Route::post('/release/{id}', [TaskController::class, 'unassignTask']);

    Route::get('/assigned/{id}', [TaskController::class, 'getAssignedTasks']);
    Route::get('/realized/{id}', [TaskController::class, 'getRealizedTasks']);
    Route::get('/available', [TaskController::class, 'getAvailableTasks']);
    Route::get('/available', [TaskController::class, 'getAvailableTasks']);
});
