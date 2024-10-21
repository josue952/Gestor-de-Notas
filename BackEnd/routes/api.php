<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ClasesController;
use App\Http\Controllers\MateriasController;

// Rutas de autenticación
Route::post('/login', [AuthController::class, 'login']);

// Rutas de usuarios
Route::group(['prefix' => 'users'], function () {
    Route::post('/', [UserController::class, 'create_user']); // Crear usuario
    Route::get('/', [UserController::class, 'get_users']); // Obtener todos los usuarios
    Route::get('/{id}', [UserController::class, 'get_user']); // Obtener usuario por ID y Email
    Route::put('/{id}', [UserController::class, 'update_user']); // Actualizar usuario
    Route::delete('/{id}', [UserController::class, 'delete_user']); // Eliminar usuario
});

// Rutas de clases
Route::group(['prefix' => 'clases'], function () {
    Route::post('/', [ClasesController::class, 'create_clase']); // Crear una clase
    Route::get('/', [ClasesController::class, 'get_clases']); // Obtener todas las clases
    Route::get('/{id}', [ClasesController::class, 'get_clase']); // Obtener una clase por ID
    Route::put('/{id}', [ClasesController::class, 'update_clase']); // Actualizar una clase
    Route::delete('/{id}', [ClasesController::class, 'delete_clase']); // Eliminar una clase
});

// Rutas de materias
Route::group(['prefix' => 'materias'], function () {
    Route::post('/', [MateriasController::class, 'create_materia']); // Crear materia
    Route::get('/', [MateriasController::class, 'get_materias']); // Obtener todas las materias
    Route::get('/{id}', [MateriasController::class, 'get_materia']); // Obtener materia por ID
    Route::put('/{id}', [MateriasController::class, 'update_materia']); // Actualizar materia
    Route::delete('/{id}', [MateriasController::class, 'delete_materia']); // Eliminar materia
});
