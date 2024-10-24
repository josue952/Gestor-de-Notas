<?php

namespace App\Http\Controllers;

use App\Models\Calificaciones;
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
        'registros' => 'required|numeric|min:3|max:5',
        'nota_final' => 'required|numeric|min:0|max:10',
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
    
    // Verificar si ya existe una calificación para el estudiante en la misma clase y materia
    $existingCalificacion = Calificaciones::where([
        ['estudiante_id', $request->estudiante_id],
        ['clase_id', $request->clase_id],
        ['materia_id', $request->materia_id]
    ])->first();

    if ($existingCalificacion) {
        return response()->json([
            'error' => 'Ya existe una calificación registrada para este estudiante en la misma clase y materia.'
        ], 400);
    }

    // Crear la calificación
    $calificacion = Calificaciones::create([
        'estudiante_id' => $request->estudiante_id,
        'clase_id' => $request->clase_id,
        'materia_id' => $request->materia_id,
        'maestro_id' => $request->maestro_id,
        'registros' => $request->registros,
        'nota_final' => $request->nota_final,
        'fecha_asignacion' => $request->fecha_asignacion,
    ]);

    return response()->json([
        'message' => 'Calificación creada exitosamente',
        'calificacion' => $calificacion
    ], 201);
}
    
    // Obtener una calificación por ID
    public function show($id_calificacion)
    {
        $calificacion = Calificaciones::findOrFail($id_calificacion);
        
        return response()->json($calificacion);
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
        'registros' => 'required|numeric|min:3|max:5',
        'nota_final' => 'required|numeric|min:0|max:10',//La calificacion final se calculara en la tabla SubirCalificaciones, por el momento se dejara asi
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

    // Verificar si ya existe una calificación para el estudiante en la misma clase y materia,
    // pero excluyendo la calificación actual que se está actualizando
    $existingCalificacion = Calificaciones::where('estudiante_id', $request->estudiante_id)
        ->where('clase_id', $request->clase_id)
        ->where('materia_id', $request->materia_id)
        ->where('id_calificacion', '!=', $id_calificacion) // Excluir la calificación actual
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
        'registros' => $request->registros,
        'nota_final' => $request->nota_final,//La calificacion final se calculara en la tabla SubirCalificaciones, por el momento se dejara asi
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
