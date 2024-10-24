<?php

namespace App\Http\Controllers;

use App\Models\Estudiantes;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EstudiantesController extends Controller
{

    // Crear un nuevo estudiante
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'carnet_estudiante' => 'required|integer|unique:estudiantes,carnet_estudiante',
            'usuario_id' => 'required|exists:users,id_usuario',
            'clase_id' => 'required|exists:clases,id_clase'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        // Verificar si ya existe un estudiante con el mismo usuario_id
        $existingStudent = Estudiantes::where('usuario_id', $request->usuario_id)->first();
        if ($existingStudent) {
            return response()->json([
                'error' => 'Ya existe un estudiante registrado con este usuario.'
            ], 400);
        }

        // Validar que el usuario asignado tenga el rol de "Alumno"
        $usuario = User::find($request->usuario_id);
        if (!$usuario || $usuario->rol !== 'Alumno') {
            return response()->json([
                'error' => 'Solo los usuarios con el rol de "Alumno" pueden ser asignados como estudiantes.'
            ], 400);
        }

        $estudiante = Estudiantes::create([
            'carnet_estudiante' => $request->carnet_estudiante,
            'usuario_id' => $request->usuario_id,
            'clase_id' => $request->clase_id,
        ]);

        return response()->json([
            'message' => 'Estudiante creado exitosamente',
            'estudiante' => $estudiante
        ], 201);
    }

    // Obtener todos los estudiantes
    public function index()
    {
        $estudiantes = Estudiantes::with('usuario', 'clase')->get();
        return response()->json($estudiantes);
    }

    // Obtener un estudiante por su carnet
    public function show($carnet_estudiante)
    {
        $estudiante = Estudiantes::with('usuario', 'clase')->findOrFail($carnet_estudiante);
        return response()->json($estudiante);
    }

    // Actualizar los datos de un estudiante
    public function update(Request $request, $carnet_estudiante)
    {
        $estudiante = Estudiantes::findOrFail($carnet_estudiante);

        $validator = Validator::make($request->all(), [
            'usuario_id' => 'required|exists:users,id_usuario',
            'clase_id' => 'required|exists:clases,id_clase'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        // Validar que no exista otro estudiante con el mismo usuario_id
        $existingStudent = Estudiantes::where('usuario_id', $request->usuario_id)
            ->where('carnet_estudiante', '!=', $carnet_estudiante)
            ->first();
        if ($existingStudent) {
            return response()->json([
                'error' => 'Ya existe otro estudiante registrado con este usuario.'
            ], 400);
        }

        // Validar que el usuario asignado tenga el rol de "Alumno"
        $usuario = User::find($request->usuario_id);
        if (!$usuario || $usuario->rol !== 'Alumno') {
            return response()->json([
                'error' => 'Solo los usuarios con el rol de "Alumno" pueden ser asignados como estudiantes.'
            ], 400);
        }

        // Actualizar el estudiante
        $estudiante->update($request->only(['usuario_id', 'clase_id']));

        return response()->json([
            'message' => 'Estudiante actualizado exitosamente',
            'estudiante' => $estudiante
        ]);
    }

    // Eliminar un estudiante
    public function destroy($carnet_estudiante)
    {
        $estudiante = Estudiantes::findOrFail($carnet_estudiante);
        $estudiante->delete();

        return response()->json(['message' => 'Estudiante eliminado exitosamente'], 204);
    }
}
