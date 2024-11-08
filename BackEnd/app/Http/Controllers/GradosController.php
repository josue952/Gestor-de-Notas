<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Grados;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class GradosController extends Controller
{
    // Crear un nuevo grado
    public function create_grado(Request $request)
    {
        // Validación de los datos
        $validator = Validator::make(
            $request->all(),
            [
                'nombre' => 'required|string|max:100|unique:grados',
                'descripcion' => 'nullable|string',
                'registros' => 'required|integer|min:0', // Validación para el campo 'registros'
            ],
            [
                'nombre.required' => 'El campo nombre es requerido',
                'nombre.string' => 'El campo nombre debe ser una cadena de texto',
                'nombre.max' => 'El campo nombre debe tener máximo 100 caracteres',
                'nombre.unique' => 'El nombre del grado ya está en uso',
                'descripcion.string' => 'El campo descripción debe ser una cadena de texto',
                'registros.required' => 'El campo registros es requerido',
                'registros.integer' => 'El campo registros debe ser un número entero',
                'registros.min' => 'El campo registros debe ser mínimo 0',
            ]
        );

        if ($validator->fails()) {
            Log::error('Errores de validación al crear el grado:', $validator->errors()->toArray());
            return response()->json(['status' => 'validation_failed', 'errors' => $validator->errors()], 400);
        }

        $grado = Grados::create([
            'nombre' => $request->nombre,
            'descripcion' => $request->descripcion,
            'registros' => $request->registros,
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

        $validator = Validator::make(
            $request->all(),
            [
                'nombre' => 'string|max:100|unique:grados,nombre,' . $grado->id_grado . ',id_grado',
                'descripcion' => 'nullable|string',
                'registros' => 'integer|min:0', // Validación para el campo 'registros'
            ],
            [
                'nombre.string' => 'El campo nombre debe ser una cadena de texto',
                'nombre.max' => 'El campo nombre debe tener máximo 100 caracteres',
                'nombre.unique' => 'El nombre del grado ya está en uso',
                'descripcion.string' => 'El campo descripción debe ser una cadena de texto',
                'registros.integer' => 'El campo registros debe ser un número entero',
                'registros.min' => 'El campo registros debe ser mínimo 0',
            ]
        );

        if ($validator->fails()) {
            Log::error('Errores de validación al editar el grado:', $validator->errors()->toArray());
            return response()->json(['status' => 'validation_failed', 'errors' => $validator->errors()], 400);
        }

        $grado->update($request->only(['nombre', 'descripcion', 'registros']));

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
