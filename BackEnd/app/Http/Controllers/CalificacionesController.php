<?php

namespace App\Http\Controllers;

use App\Models\Calificaciones;
use App\Models\Clases;
use Illuminate\Http\Request;
use App\Models\User;
use Validator;

class CalificacionesController extends Controller
{
    // Crear una nueva calificación
    public function store(Request $request)
    {
        // Validar las entradas
        $validator = Validator::make($request->all(), [
            'estudiante_id' => 'required|exists:estudiantes,carnet_estudiante',
            'clase_id' => 'required|exists:clases,id_clase',
            'materia_id' => 'required|exists:materias,id_materia',
            'maestro_id' => 'required|exists:users,id_usuario',
            'nota_final' => 'nullable|numeric|min:0|max:10', // Cambiar a nullable
            'fecha_asignacion' => 'required|date',
        ]);

        // Verificar si el validador falla
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        // Validar que el maestro asignado tenga el rol de "Maestro"
        $maestro = User::find($request->maestro_id);
        if (!$maestro || $maestro->rol !== 'Maestro') {
            return response()->json([
                'error' => 'Solo los usuarios con el rol de "Maestro" pueden ser asignados como maestros.'
            ], 400);
        }

        // Obtener el grado asociado a la clase seleccionada
        $clase = Clases::find($request->clase_id);
        $gradoId = $clase->grado_id;

        // Verificar si ya existe una calificación para el estudiante en la misma materia y grado
        $existingCalificacion = Calificaciones::whereHas('clase', function ($query) use ($gradoId, $request) {
            $query->where('grado_id', $gradoId)
                ->where('materia_id', $request->materia_id);
        })->where('estudiante_id', $request->estudiante_id)->first();

        if ($existingCalificacion) {
            return response()->json([
                'error' => 'El estudiante ya tiene una calificación registrada para esta materia en el mismo grado.'
            ], 400);
        }

        // Crear la calificación
        $calificacion = Calificaciones::create([
            'estudiante_id' => $request->estudiante_id,
            'clase_id' => $request->clase_id,
            'materia_id' => $request->materia_id,
            'maestro_id' => $request->maestro_id,
            'nota_final' => $request->nota_final ?? 0, // Si no se proporciona, usa el valor predeterminado 0
            'fecha_asignacion' => $request->fecha_asignacion,
        ]);

        return response()->json([
            'message' => 'Calificación creada exitosamente',
            'calificacion' => $calificacion
        ], 201);
    }

    // Obtener todas las calificaciones de un alumno por ID de estudiante
    public function obtenerCalificacionesPorEstudiante($carnet_estudiante)
    {
        // Obtener todas las calificaciones del estudiante, incluyendo nombre de clase, materia, estudiante y maestro
        $calificaciones = Calificaciones::where('estudiante_id', $carnet_estudiante)
            ->with([
                'clase:id_clase,nombre',
                'materia:id_materia,nombre',
                'estudiante.usuario:id_usuario,nombre_completo', // Obtener el nombre completo del estudiante desde la relación usuario
                'maestro:id_usuario,nombre_completo' // Obtener el nombre completo del maestro
            ])
            ->get();

        return response()->json($calificaciones);
    }

    // Obtener una calificación por ID
    public function show($id_calificacion)
    {
        // Obtener la calificación por ID, incluyendo nombre de clase, materia, estudiante y maestro
        $calificacion = Calificaciones::with([
            'clase:id_clase,nombre',
            'materia:id_materia,nombre',
            'estudiante.usuario:id_usuario,nombre_completo', // Obtener el nombre completo del estudiante desde la relación usuario
            'maestro:id_usuario,nombre_completo' // Obtener el nombre completo del maestro
        ])->findOrFail($id_calificacion);

        return response()->json($calificacion);
    }

    //Obtener todas las clases segun el id de la materia
    public function obtenerClasesPorMateria($materia_id)
    {
        // Obtener todas las clases de la materia seleccionada
        $clases = Clases::where('materia_id', $materia_id)->get();

        return response()->json($clases);
    }

    // Actualizar una calificación
    public function update(Request $request, $id_calificacion)
    {
        $calificacion = Calificaciones::findOrFail($id_calificacion);

        $validator = Validator::make($request->all(), [
            'estudiante_id' => 'required|exists:estudiantes,carnet_estudiante',
            'clase_id' => 'required|exists:clases,id_clase',
            'materia_id' => 'required|exists:materias,id_materia',
            'maestro_id' => 'required|exists:users,id_usuario',
            'nota_final' => 'nullable|numeric|min:0|max:10', // Cambiar a nullable
            'fecha_asignacion' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        // Validar que el maestro asignado tenga el rol de "Maestro"
        $maestro = User::find($request->maestro_id);
        if (!$maestro || $maestro->rol !== 'Maestro') {
            return response()->json([
                'error' => 'Solo los usuarios con el rol de "Maestro" pueden ser asignados como maestros.'
            ], 400);
        }

        // Verificar si ya existe una calificación para el estudiante en la misma clase y materia, excluyendo la actual
        $existingCalificacion = Calificaciones::where('estudiante_id', $request->estudiante_id)
            ->where('clase_id', $request->clase_id)
            ->where('materia_id', $request->materia_id)
            ->where('id_calificacion', '!=', $id_calificacion)
            ->first();

        if ($existingCalificacion) {
            return response()->json([
                'error' => 'Ya existe una calificación registrada para este estudiante en la misma clase y materia.'
            ], 400);
        }

        // Actualizar la calificación
        $calificacion->update([
            'estudiante_id' => $request->estudiante_id,
            'clase_id' => $request->clase_id,
            'materia_id' => $request->materia_id,
            'maestro_id' => $request->maestro_id,
            'nota_final' => $request->nota_final ?? $calificacion->nota_final, // Usar valor actual si no se proporciona
            'fecha_asignacion' => $request->fecha_asignacion
        ]);

        return response()->json(['message' => 'Calificación actualizada correctamente.'], 200);
    }

    // Eliminar una calificación
    public function destroy($id_calificacion)
    {
        $calificacion = Calificaciones::findOrFail($id_calificacion);
        $calificacion->delete();

        return response()->json(['message' => 'Calificación eliminada exitosamente']);
    }
}
