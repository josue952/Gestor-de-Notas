<?php

namespace App\Http\Controllers;

use App\Models\Estudiantes;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class EstudiantesController extends Controller
{
    // Crear un nuevo estudiante
    public function store(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                //el carnet servira como id, y es unico
                'carnet_estudiante' => 'required|integer|unique:estudiantes,carnet_estudiante',
                'usuario_id' => 'required|exists:users,id_usuario',
                'grado_id' => 'required|exists:grados,id_grado'
            ],
            [
                'carnet_estudiante.unique' => 'El carnet ya está en uso',
                'usuario_id.exists' => 'El usuario asignado no existe',
                'grado_id.exists' => 'El grado asignado no existe'
            ]
        );

        // Verificar el rol del usuario
        $usuario = User::find($request->usuario_id);
        if (!$usuario || $usuario->rol !== 'Alumno') {
            return response()->json([
                'error' => 'Solo los usuarios con el rol de "Alumno" pueden ser asignados como estudiantes.'
            ], 400);
        }
        
        if ($validator->fails()) {
            Log::error('Errores de validación al crear el estudiante:', $validator->errors()->toArray());
            return response()->json(['status' => 'validation_failed', 'errors' => $validator->errors()], 400);
        }

        // Crear el estudiante
        $estudiante = Estudiantes::create([
            'carnet_estudiante' => $request->carnet_estudiante,
            'usuario_id' => $request->usuario_id,
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
                $query->select('id_usuario', 'id_usuario', 'username', 'nombre_completo', 'email', 'rol');
            },
            'grado' => function ($query) {
                $query->select('id_grado', 'nombre'); // Cargar el nombre del grado
            }
        ])->findOrFail($carnet_estudiante);

        // Formatear la respuesta con datos específicos
        $data = [
            'carnet_estudiante' => $estudiante->carnet_estudiante,
            'usuario' => [
                'id_usuario' => $estudiante->usuario->id_usuario,
                'nombre_completo' => $estudiante->usuario->nombre_completo,
                'username' => $estudiante->usuario->username,
                'email' => $estudiante->usuario->email,
                'rol' => $estudiante->usuario->rol,
            ],
            'grado' => $estudiante->grado->nombre, // Mostrar el nombre del grado en lugar del ID
        ];

        return response()->json($data);
    }

    // Obtener usuarios con rol 'Alumno' que no están registrados como estudiantes
    public function obtenerAlumnosSinRegistrar()
    {
        // Obtener IDs de todos los estudiantes ya registrados
        $estudiantesRegistradosIds = Estudiantes::pluck('usuario_id')->toArray();

        // Filtrar usuarios con rol 'Alumno' que no estén en la lista de estudiantes registrados
        $alumnosSinRegistrar = User::where('rol', 'Alumno')
            ->whereNotIn('id_usuario', $estudiantesRegistradosIds)
            ->select('id_usuario', 'nombre_completo', 'email') // Selecciona los campos necesarios
            ->get();

        return response()->json($alumnosSinRegistrar);
    }

    // Actualizar los datos de un estudiante
    public function update(Request $request, $carnet_estudiante)
    {
        $estudiante = Estudiantes::findOrFail($carnet_estudiante);

        $validator = Validator::make(
            $request->all(),
            [
                'usuario_id' => 'required|exists:users,id_usuario',
                'grado_id' => 'required|exists:grados,id_grado' // Nueva validación para grado_id
            ],
            [
                'usuario_id.exists' => 'El usuario asignado no existe',
                'grado_id.exists' => 'El grado asignado no existe',
                //el grado debe ser un numero entero
                'grado_id.integer' => 'El grado asignado debe ser un número entero'
            ]
        );

        if ($validator->fails()) {
            Log::error('Errores de validación al editar el estudiante:', $validator->errors()->toArray());
            return response()->json(['status' => 'validation_failed', 'errors' => $validator->errors()], 400);
        }

        // Actualizar el estudiante
        $estudiante->update($request->only(['usuario_id', 'grado_id'])); // Incluir grado_id al actualizar

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
