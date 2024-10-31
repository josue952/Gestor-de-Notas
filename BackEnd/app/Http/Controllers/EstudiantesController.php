<?php

namespace App\Http\Controllers;

use App\Models\Estudiantes;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Clases;
use Illuminate\Support\Facades\Log;

class EstudiantesController extends Controller
{
    // Crear un nuevo estudiante
    public function store(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'carnet_estudiante' => 'required|integer',
                'usuario_id' => 'required|exists:users,id_usuario',
                'clase_id' => 'required|exists:clases,id_clase',
                'grado_id' => 'required|exists:grados,id_grado'
            ],
            [
                'usuario_id.exists' => 'El usuario asignado no existe.',
                'clase_id.exists' => 'La clase asignada no existe.',
                'grado_id.exists' => 'El grado asignado no existe.'
            ]
        );

        if ($validator->fails()) {
            Log::error('Errores de validación al crear el estudiante:', $validator->errors()->toArray());
            return response()->json(['status' => 'validation_failed', 'errors' => $validator->errors()], 400);
        }

        // Verificar el rol del usuario
        $usuario = User::find($request->usuario_id);
        if (!$usuario || $usuario->rol !== 'Alumno') {
            return response()->json([
                'error' => 'Solo los usuarios con el rol de "Alumno" pueden ser asignados como estudiantes.'
            ], 400);
        }

        $existingEnrollment = Estudiantes::where('usuario_id', $request->usuario_id)
            ->whereHas('clase', function ($query) use ($request) {
                $query->where('id_clase', $request->clase_id);
            })
            ->exists();

        if ($existingEnrollment) {
            return response()->json([
                'error' => 'El estudiante ya está registrado en esta clase y sección.'
            ], 400);
        }

        // Crear el estudiante
        $estudiante = Estudiantes::create([
            'carnet_estudiante' => $request->carnet_estudiante,
            'usuario_id' => $request->usuario_id,
            'clase_id' => $request->clase_id,
            'grado_id' => $request->grado_id,
        ]);

        return response()->json([
            'message' => 'Estudiante creado exitosamente',
            'estudiante' => $estudiante
        ], 201);
    }

    // Obtener todos los estudiantes
    public function index()
    {
        $estudiantes = Estudiantes::with([
            'usuario' => function ($query) {
                $query->select('id_usuario', 'username', 'nombre_completo', 'email', 'rol');
            },
            'clase' => function ($query) {
                $query->select('id_clase', 'nombre');
            },
            'grado' => function ($query) {
                $query->select('id_grado', 'nombre'); // Cargar el nombre del grado
            }
        ])->get();

        // Mapear datos específicos para la respuesta JSON
        $estudiantes = $estudiantes->map(function ($estudiante) {
            return [
                'carnet_estudiante' => $estudiante->carnet_estudiante,
                'usuario' => [
                    'nombre_completo' => $estudiante->usuario->nombre_completo,
                    'username' => $estudiante->usuario->username,
                    'email' => $estudiante->usuario->email,
                    'rol' => $estudiante->usuario->rol,
                ],
                'clase' => $estudiante->clase->nombre,
                'grado' => [
                    'id_grado' => $estudiante->grado->id_grado,
                    'nombre' => $estudiante->grado->nombre
                ]
            ];
        });

        return response()->json($estudiantes);
    }

    // Obtener un estudiante por su carnet
    public function show($carnet_estudiante)
    {
        $estudiante = Estudiantes::with([
            'usuario' => function ($query) {
                $query->select('id_usuario', 'username', 'nombre_completo', 'email', 'rol');
            },
            'clase' => function ($query) {
                $query->select('id_clase', 'nombre');
            },
            'grado' => function ($query) {
                $query->select('id_grado', 'nombre'); // Cargar el nombre del grado
            }
        ])->findOrFail($carnet_estudiante);

        // Formatear la respuesta con datos específicos
        $data = [
            'carnet_estudiante' => $estudiante->carnet_estudiante,
            'usuario' => [
                'nombre_completo' => $estudiante->usuario->nombre_completo,
                'username' => $estudiante->usuario->username,
                'email' => $estudiante->usuario->email,
                'rol' => $estudiante->usuario->rol,
            ],
            'clase' => $estudiante->clase->nombre,
            'grado' => $estudiante->grado->nombre, // Mostrar el nombre del grado en lugar del ID
        ];

        return response()->json($data);
    }

    // Actualizar los datos de un estudiante
    public function update(Request $request, $carnet_estudiante)
    {
        $estudiante = Estudiantes::findOrFail($carnet_estudiante);

        $validator = Validator::make(
            $request->all(),
            [
                'usuario_id' => 'required|exists:users,id_usuario',
                'clase_id' => 'required|exists:clases,id_clase',
                'grado_id' => 'required|exists:grados,id_grado' // Nueva validación para grado_id
            ],
            [
                'usuario_id.exists' => 'El usuario asignado no existe.',
                'clase_id.exists' => 'La clase asignada no existe.',
                'grado_id.exists' => 'El grado asignado no existe.' // Mensaje de error para grado_id
            ]
        );

        if ($validator->fails()) {
            Log::error('Errores de validación al editar el estudiante:', $validator->errors()->toArray());
            return response()->json(['status' => 'validation_failed', 'errors' => $validator->errors()], 400);
        }

        // Validar que el usuario asignado tenga el rol de "Alumno"
        $usuario = User::find($request->usuario_id);
        if (!$usuario || $usuario->rol !== 'Alumno') {
            return response()->json([
                'error' => 'Solo los usuarios con el rol de "Alumno" pueden ser asignados como estudiantes.'
            ], 400);
        }

        // Verificar que no se está tratando de asignar la misma clase
        if ($estudiante->clase_id == $request->clase_id) {
            return response()->json([
                'error' => 'El estudiante ya está asignado a esta clase.'
            ], 400);
        }

        // Actualizar el estudiante
        $estudiante->update($request->only(['usuario_id', 'clase_id', 'grado_id'])); // Incluir grado_id al actualizar

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
