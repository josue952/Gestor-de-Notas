<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Clases;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class ClasesController extends Controller
{
    // Crear una nueva clase
    public function create_clase(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'nombre' => 'required|string|max:100|unique:clases',
                'descripcion' => 'nullable|string',
                'maestro_id' => 'nullable|exists:users,id_usuario',
                'grado_id' => 'required|exists:grados,id_grado', // Validamos que el grado exista
            ],
            [
                'nombre.required' => 'El campo nombre es requerido',
                'nombre.string' => 'El campo nombre debe ser una cadena de texto',
                'nombre.max' => 'El campo nombre debe tener máximo 100 caracteres',
                'nombre.unique' => 'El nombre de la clase ya está en uso',
                'descripcion.string' => 'El campo descripción debe ser una cadena de texto',
                'maestro_id.exists' => 'El maestro seleccionado no existe',
                'grado_id.required' => 'El campo grado_id es requerido',
                'grado_id.exists' => 'El grado seleccionado no existe',
            ]
        );

        if ($validator->fails()) {
            Log::error('Errores de validación al crear la clase:', $validator->errors()->toArray());
            return response()->json(['status' => 'validation_failed', 'errors' => $validator->errors()], 400);
        }

        // Validamos que el usuario con maestro_id tenga el rol de "Maestro"
        if ($request->maestro_id) {
            $maestro = User::find($request->maestro_id);
            if (!$maestro || $maestro->rol !== 'Maestro') {
                return response()->json([
                    'error' => 'Solo los usuarios con el rol de "Maestro" pueden ser asignados como maestros a una clase.'
                ], 400);
            }
        }

        $clase = Clases::create([
            'nombre' => $request->nombre,
            'descripcion' => $request->descripcion,
            'maestro_id' => $request->maestro_id,
            'grado_id' => $request->grado_id,
        ]);

        return response()->json([
            'message' => 'Clase creada exitosamente',
            'clase' => $clase
        ], 201);
    }

    // Obtener todas las clases con maestros (solo con rol de Maestro) y grados asociados
    public function get_clases()
    {
        $clases = Clases::with([
            'maestro' => function ($query) {
                // Selecciona tanto el nombre como el apellido en una sola consulta
                $query->select('id_usuario', 'nombre_completo')
                    ->where('rol', 'Maestro'); // Filtra solo maestros
            },
            'grado:id_grado,nombre' // Incluye solo los campos necesarios de grados
        ])->get();

        return response()->json($clases);
    }

    // Obtener una clase por ID con maestro (solo con rol de Maestro) y grado asociado
    public function get_clase($id)
    {
        $clase = Clases::with([
            'maestro' => function ($query) {
                // Selecciona tanto el nombre como el apellido en una sola consulta
                $query->select('id_usuario', 'nombre_completo')
                    ->where('rol', 'Maestro'); // Filtra solo maestros
            },
            'grado:id_grado,nombre' // Incluye solo los campos necesarios de grados
        ])->find($id);

        if (!$clase) {
            return response()->json(['message' => 'Clase no encontrada'], 404);
        }

        return response()->json($clase);
    }

    // Actualizar una clase
    public function update_clase(Request $request, $id)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'nombre' => 'sometimes|required|string|max:100|unique:clases,nombre,' . $id . ',id_clase',
                'descripcion' => 'nullable|string',
                'maestro_id' => 'nullable|exists:users,id_usuario',
                'grado_id' => 'required|exists:grados,id_grado', // Validamos que el grado exista
            ],
            [
                'nombre.required' => 'El campo nombre es requerido',
                'nombre.string' => 'El campo nombre debe ser una cadena de texto',
                'nombre.max' => 'El campo nombre debe tener máximo 100 caracteres',
                'nombre.unique' => 'El nombre de la clase ya está en uso',
                'descripcion.string' => 'El campo descripción debe ser una cadena de texto',
                'maestro_id.exists' => 'El maestro seleccionado no existe',
                'grado_id.required' => 'El campo grado_id es requerido',
                'grado_id.exists' => 'El grado seleccionado no existe',
            ]
        );

        if ($validator->fails()) {
            Log::error('Errores de validación al crear la clase:', $validator->errors()->toArray());
            return response()->json(['status' => 'validation_failed', 'errors' => $validator->errors()], 400);
        }

        $clase = Clases::find($id);

        if (!$clase) {
            return response()->json(['error' => 'Clase no encontrada'], 404);
        }

        // Validamos que el usuario con maestro_id tenga el rol de "Maestro"
        if ($request->maestro_id) {
            $maestro = User::find($request->maestro_id);
            if (!$maestro || $maestro->rol !== 'Maestro') {
                return response()->json([
                    'error' => 'Solo los usuarios con el rol de "Maestro" pueden ser asignados como maestros a una clase.'
                ], 400);
            }
        }

        $clase->update($request->only(['nombre', 'descripcion', 'maestro_id', 'grado_id']));

        return response()->json([
            'message' => 'Clase actualizada exitosamente',
            'clase' => $clase
        ], 200);
    }

    public function delete_clase($id)
    {
        $clase = Clases::find($id);
        if (!$clase) {
            return response()->json(['message' => 'Clase no encontrada'], 404);
        }

        $clase->delete();
        return response()->json(['message' => 'Clase eliminada exitosamente']);
    }
}
