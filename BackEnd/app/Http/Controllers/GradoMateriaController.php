<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\GradoMateria;
use App\Models\Grados; // Asegúrate de importar el modelo Grados
use App\Models\Materias; // Asegúrate de importar el modelo Materias
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class GradoMateriaController extends Controller
{
    // Crear una nueva relación grado-materia
    public function store(Request $request, $id_grado)
    {
        // Convertir id_grado a entero
        $id_grado = (int) $id_grado;

        // Asegúrate de que $id_grado tiene un valor
        if (empty($id_grado)) {
            return response()->json(['error' => 'El id_grado no puede estar vacío'], 400);
        }

        // Verificar si ya existe la relación grado-materia
        $exists = GradoMateria::where('id_grado', $id_grado)
            ->where('id_materia', $request->id_materia)
            ->exists();

        if ($exists) {
            return response()->json(['error' => 'Esta materia ya está asignada a este grado.'], 400);
        }

        // Validación de los datos de entrada con mensajes personalizados
        $validator = Validator::make($request->all(), [
            'id_materia' => 'required|exists:materias,id_materia',
        ], [
            'id_materia.required' => 'El ID de la materia es requerido.',
            'id_materia.exists' => 'La materia seleccionada no existe.',
        ]);

        if ($validator->fails()) {
            Log::error('Errores de validación al crear relación grado-materia:', $validator->errors()->toArray());
            return response()->json(['status' => 'validation_failed', 'errors' => $validator->errors()], 400);
        }

        // Crear la nueva relación grado-materia
        $gradoMateria = GradoMateria::create([
            'id_grado' => $id_grado,
            'id_materia' => $request->id_materia,
        ]);

        return response()->json($gradoMateria, 201);
    }

    // Obtener todas los GradosMaterias
    public function index()
    {
        $gradoMateria = GradoMateria::with([
            'grado' => function ($query) {
                $query->select('id_grado', 'nombre');
            },
            'materia' => function ($query) {
                $query->select('id_materia', 'nombre');
            }
        ])->get();

        // Mapear datos específicos para la respuesta JSON
        $gradoMateria = $gradoMateria->map(function ($gradoMateria) {
            return [
                'id_GradoMateria' => $gradoMateria->id_GradoMateria,
                'grado' => $gradoMateria->grado->nombre,
                'materia' => $gradoMateria->materia->nombre,
            ];
        });

        return response()->json($gradoMateria);
    }

    // Mostrar todas las materias de un grado específico
    public function show($id_grado)
    {
        // Obtener todas las materias asociadas al grado específico, incluyendo el grado
        $gradoMaterias = GradoMateria::with(['materia:id_materia,nombre', 'grado:id_grado,nombre'])
            ->where('id_grado', $id_grado)
            ->get();

        // Verificar si se encontraron materias
        if ($gradoMaterias->isEmpty()) {
            return response()->json(['message' => 'No se encontraron materias para este grado.'], 404);
        }

        // Mapear los resultados para la respuesta JSON
        $result = $gradoMaterias->map(function ($gradoMateria) {
            return [
                'id_GradoMateria' => $gradoMateria->id_GradoMateria,
                'grado' => $gradoMateria->grado->nombre ?? 'Grado no encontrado',
                'materia' => $gradoMateria->materia->nombre ?? 'Materia no encontrada',
            ];
        });

        return response()->json($result);
    }

    // Actualizar una relación grado-materia
    public function update(Request $request, $id)
    {
        // Validar los datos de entrada
        $request->validate([
            'id_grado' => 'required|exists:grados,id_grado',
            'id_materia' => 'required|exists:materias,id_materia'
        ]);

        $gradoMateria = GradoMateria::findOrFail($id);

        // Verificar si ya existe la relación grado-materia con los nuevos valores
        $exists = GradoMateria::where('id_grado', $request->id_grado)
            ->where('id_materia', $request->id_materia)
            ->where('id_GradoMateria', '!=', $id) // Asegúrate de no contar el registro actual
            ->exists();

        if ($exists) {
            return response()->json(['error' => 'Esta materia ya está asignada a este grado.'], 400);
        }

        // Actualizar la relación grado-materia
        $gradoMateria->update([
            'id_grado' => $request->id_grado,
            'id_materia' => $request->id_materia,
        ]);

        return response()->json($gradoMateria);
    }

    // Eliminar una relación grado-materia
    public function destroy($id)
    {
        $gradoMateria = GradoMateria::findOrFail($id);
        $gradoMateria->delete();

        return response()->json(['message' => 'Relación eliminada con éxito']);
    }
}
