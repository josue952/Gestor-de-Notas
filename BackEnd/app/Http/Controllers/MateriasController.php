<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Materias;
use App\Models\Clases;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class MateriasController extends Controller
{
    // Crear una nueva materia
    public function create_materia(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'nombre' => 'required|string|max:100|unique:materias',
                'objetivo' => 'required|string|max:255',
            ],
            [
                'nombre.required' => 'El nombre de la materia es requerido',
                'nombre.string' => 'El nombre de la materia debe ser una cadena de texto',
                'nombre.max' => 'El nombre de la materia no debe exceder los 100 caracteres',
                'nombre.unique' => 'Ya existe una materia con el mismo nombre',
                'objetivo.required' => 'El objetivo de la materia es requerido',
                'objetivo.string' => 'El objetivo de la materia debe ser una cadena de texto',
                'objetivo.max' => 'El objetivo de la materia no debe exceder los 255 caracteres',
            ]
        );

        if ($validator->fails()) {
            Log::error('Errores de validación al crear la materia:', $validator->errors()->toArray());
            return response()->json(['status' => 'validation_failed', 'errors' => $validator->errors()], 400);
        }


        $materia = Materias::create([
            'nombre' => $request->nombre,
            'objetivo' => $request->objetivo,
        ]);

        return response()->json([
            'message' => 'Materia creada exitosamente',
            'materia' => $materia
        ], 201);
    }

    // Obtener todas las materias
    public function get_materias()
    {
        return response()->json(Materias::all());
    }

    // Obtener una materia por ID
    public function get_materia($id)
    {
        $materia = Materias::find($id);
        if (!$materia) {
            return response()->json(['message' => 'Materia no encontrada'], 404);
        }

        return response()->json($materia);
    }

    // Actualizar una materia
    public function update_materia(Request $request, $id)
    {
        $materia = Materias::find($id);
        if (!$materia) {
            return response()->json(['message' => 'Materia no encontrada'], 404);
        }

        $validator = Validator::make(
            $request->all(),
            [
                'nombre' => 'string|max:100|unique:materias,nombre,' . $materia->id_materia . ',id_materia',
                'objetivo' => 'string|max:255',
            ],
            [
                'nombre.string' => 'El nombre de la materia debe ser una cadena de texto',
                'nombre.max' => 'El nombre de la materia no debe exceder los 100 caracteres',
                'nombre.unique' => 'Ya existe una materia con el mismo nombre',
                'objetivo.string' => 'El objetivo de la materia debe ser una cadena de texto',
                'objetivo.max' => 'El objetivo de la materia no debe exceder los 255 caracteres',
            ]
        );

        if ($validator->fails()) {
            Log::error('Errores de validación al editar la materia:', $validator->errors()->toArray());
            return response()->json(['status' => 'validation_failed', 'errors' => $validator->errors()], 400);
        }

        $materia->update($request->only(['nombre', 'objetivo']));

        return response()->json([
            'message' => 'Materia actualizada exitosamente',
            'materia' => $materia
        ]);
    }

    // Eliminar una materia
    public function delete_materia($id)
    {
        $materia = Materias::find($id);
        if (!$materia) {
            return response()->json(['message' => 'Materia no encontrada'], 404);
        }

        $materia->delete();
        return response()->json(['message' => 'Materia eliminada exitosamente']);
    }
}
