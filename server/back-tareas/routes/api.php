<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\auth\AdminMiddleware;
use App\Http\Middleware\auth\DevMiddleware;
use App\Http\Middleware\auth\DevOrAdminMiddleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('/auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout'])->middleware(['auth:sanctum', DevOrAdminMiddleware::$alias]);
    Route::post('gen_recover_code', [AuthController::class, 'generateRecoverCode']);
    Route::post('check_recover_code', [AuthController::class, 'checkRecoverCode']);
    Route::post('change_password', [AuthController::class, 'changePassword']);
});

Route::prefix('/user')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [UserController::class, 'getAllUsers'])->middleware(AdminMiddleware::$alias);
    Route::get('/{id}', [UserController::class, 'getUser'])->middleware(DevOrAdminMiddleware::$alias);
    Route::get('dev', [UserController::class, 'getAllDevelopers'])->middleware(AdminMiddleware::$alias);
    Route::get('fullname', [UserController::class, 'getUsersByFullname'])->middleware(AdminMiddleware::$alias);

    Route::put('data', [UserController::class, 'editUserData'])->middleware(DevOrAdminMiddleware::$alias); // Lo suyo seria hacer una ruta para el perfil (todos), y otra para los datos (admin).
    Route::put('password', [UserController::class, 'editUserPassword'])->middleware(DevOrAdminMiddleware::$alias);
    Route::delete('/{id}', [UserController::class, 'deleteUser'])->middleware(AdminMiddleware::$alias);
    Route::post('restore', [UserController::class, 'restoreUser'])->middleware(AdminMiddleware::$alias);
    Route::post('', [UserController::class, 'createUser'])->middleware(AdminMiddleware::$alias);
    Route::get('/search/{searchInput}', [UserController::class, 'searchUser'])->middleware(DevOrAdminMiddleware::$alias);;

    Route::put('/roles/{id}', [UserController::class, 'updateUserRoles'])->middleware(AdminMiddleware::$alias);
    Route::get('/roles/{id}', [UserController::class, 'getUserRoles'])->middleware(DevOrAdminMiddleware::$alias);
    Route::post('/profile_pic/{userId}', [UserController::class, 'changeProfilePic'])->middleware(DevMiddleware::$alias);
    Route::post('/register', [UserController::class, 'createUser'])->middleware(AdminMiddleware::$alias);
});

Route::prefix('/role')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [RoleController::class, 'getAllRoles'])->middleware(DevOrAdminMiddleware::$alias);
});

Route::prefix('/task')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [TaskController::class, 'getAllTasks'])->middleware(AdminMiddleware::$alias);
    Route::get('/with-assigned-by', [TaskController::class, 'getAllWithAssignedBy'])->middleware(DevOrAdminMiddleware::$alias);
    Route::get('/with-assigned-to', [TaskController::class, 'getAllWithAssignedTo'])->middleware(DevOrAdminMiddleware::$alias);
    Route::get('/difficulties', [TaskController::class, 'getAllDifficulties'])->middleware(AdminMiddleware::$alias);
    Route::delete('/{id}', [TaskController::class, 'deleteTask'])->middleware(AdminMiddleware::$alias);
    Route::put('/{id}', [TaskController::class, 'editTask'])->middleware(AdminMiddleware::$alias);
    Route::post('/', [TaskController::class, 'createTask'])->middleware(AdminMiddleware::$alias);
    Route::post('/assign/{id}', [TaskController::class, 'assignTask'])->middleware(DevOrAdminMiddleware::$alias);;
    Route::post('/unassign/{id}', [TaskController::class, 'unassignTask'])->middleware(AdminMiddleware::$alias);
    Route::post('/release/{id}', [TaskController::class, 'unassignTask'])->middleware(DevMiddleware::$alias);

    Route::get('/assigned/{id}', [TaskController::class, 'getAssignedTasks'])->middleware(DevOrAdminMiddleware::$alias);;
    Route::get('/realized/{id}', [TaskController::class, 'getRealizedTasks'])->middleware(AdminMiddleware::$alias);
    Route::get('/available', [TaskController::class, 'getAvailableTasks'])->middleware(DevMiddleware::$alias);
});
