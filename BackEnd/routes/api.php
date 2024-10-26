<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ClasesController;
use App\Http\Controllers\MateriasController;
use App\Http\Controllers\GradosController;
use App\Http\Controllers\EstudiantesController;
use App\Http\Controllers\CalificacionesController;
use App\Http\Controllers\SubNotasController;

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

// Rutas de grados
Route::group(['prefix' => 'grados'], function () {
    Route::post('/', [GradosController::class, 'create_grado']); // Crear grado
    Route::get('/', [GradosController::class, 'get_grados']); // Obtener todos los grados
    Route::get('/{id}', [GradosController::class, 'get_grado']); // Obtener grado por ID
    Route::put('/{id}', [GradosController::class, 'update_grado']); // Actualizar grado
    Route::delete('/{id}', [GradosController::class, 'delete_grado']); // Eliminar grado
});

// Rutas de estudiantes
Route::group(['prefix' => 'estudiantes'], function () {
    Route::post('/', [EstudiantesController::class, 'store']); // Crear estudiante
    Route::get('/', [EstudiantesController::class, 'index']); // Obtener todos los estudiantes
    Route::get('/{carnet_estudiante}', [EstudiantesController::class, 'show']); // Obtener estudiante por carnet
    Route::put('/{carnet_estudiante}', [EstudiantesController::class, 'update']); // Actualizar estudiante por carnet
    Route::delete('/{carnet_estudiante}', [EstudiantesController::class, 'destroy']); // Eliminar estudiante por carnet
});

// Rutas de calificaciones
Route::group(['prefix' => 'calificaciones'], function () {
    Route::post('/', [CalificacionesController::class, 'store']); // Crear una nueva calificación
    Route::get('/{id_calificacion}', [CalificacionesController::class, 'show']); // Obtener una calificación por su ID
    Route::put('/{id_calificacion}', [CalificacionesController::class, 'update']); // Actualizar una calificación por su ID
    Route::delete('/{id_calificacion}', [CalificacionesController::class, 'destroy']); // Eliminar una calificación por su ID
});

// Rutas de subnotas
Route::group(['prefix' => 'calificaciones/{calificacion_id}/subnotas'], function () {
    Route::post('/', [SubNotasController::class, 'store']); // Crear subnotas
    Route::get('/', [SubNotasController::class, 'show']); // Obtener todas las subnotas de una calificación
    Route::put('/', [SubNotasController::class, 'update']); // Actualizar subnotas
    Route::delete('/', [SubNotasController::class, 'destroy']); // Eliminar todas las subnotas de una calificación
    Route::delete('/{id_subnota}', [SubNotasController::class, 'deleteSubNota']); // Eliminar una subnota específica
});

