<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Materias;
use App\Models\Clases;
use Illuminate\Support\Facades\Validator;

class MateriasController extends Controller
{
    // Crear una nueva materia
    public function create_materia(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:100|unique:materias',
            'objetivo' => 'required|string|max:255',
        ]);

        // Validar si ya existe una materia con el mismo nombre
        $materia_existente = Materias::where('nombre', $request->nombre)->first();
        if ($materia_existente) {
            return response()->json(['message' => 'Ya existe una materia con el mismo nombre'], 400);
        }
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
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

        $validator = Validator::make($request->all(), [
            'nombre' => 'string|max:100|unique:materias,nombre,' . $materia->id_materia . ',id_materia',
            'objetivo' => 'string|max:255',
        ]);

        // Validar si ya existe una materia con el mismo nombre
        $materia_existente = Materias::where('nombre', $request->nombre)->first();
        if ($materia_existente && $materia_existente->id_materia != $materia->id_materia) {
            return response()->json(['message' => 'Ya existe una materia con el mismo nombre'], 400);
        }

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
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
