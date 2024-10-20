<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;

// Rutas de autenticación
Route::post('/login', [AuthController::class, 'login']);

// Rutas de usuarios
Route::group(['prefix' => 'users'], function () {
    Route::post('/', [UserController::class, 'create_user']); // Crear usuario
    Route::get('/', [UserController::class, 'get_users']); // Obtener todos los usuarios
    Route::get('/{id}', [UserController::class, 'get_user']); // Obtener usuario por ID
    Route::put('/{id}', [UserController::class, 'update_user']); // Actualizar usuario
    Route::delete('/{id}', [UserController::class, 'delete_user']); // Eliminar usuario
});

// Aquí puedes agregar otras agrupaciones para notas, grados, materias, etc.
