<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Grados;
use Illuminate\Support\Facades\Validator;

class GradosController extends Controller
{
    // Crear un nuevo grado
    public function create_grado(Request $request)
    {
        // Validación de los datos
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:100|unique:grados',
            'descripcion' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $grado = Grados::create([
            'nombre' => $request->nombre,
            'descripcion' => $request->descripcion,
        ]);

        return response()->json([
            'message' => 'Grado creado exitosamente',
            'grado' => $grado
        ], 201);
    }

    // Obtener todos los grados
    public function get_grados()
    {
        return response()->json(Grados::all());
    }

    // Obtener un grado por ID
    public function get_grado($id)
    {
        $grado = Grados::find($id);
        if (!$grado) {
            return response()->json(['message' => 'Grado no encontrado'], 404);
        }

        return response()->json($grado);
    }

    // Actualizar un grado
    public function update_grado(Request $request, $id)
    {
        $grado = Grados::find($id);
        if (!$grado) {
            return response()->json(['message' => 'Grado no encontrado'], 404);
        }

        $validator = Validator::make($request->all(), [
            'nombre' => 'string|max:100|unique:grados,nombre,' . $grado->id_grado . ',id_grado',
            'descripcion' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $grado->update($request->only(['nombre', 'descripcion']));

        return response()->json(['message' => 'Grado actualizado exitosamente', 'grado' => $grado]);
    }

    // Eliminar un grado
    public function delete_grado($id)
    {
        $grado = Grados::find($id);
        if (!$grado) {
            return response()->json(['message' => 'Grado no encontrado'], 404);
        }

        $grado->delete();
        return response()->json(['message' => 'Grado eliminado exitosamente']);
    }
}
