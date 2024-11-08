<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    // Crear un nuevo usuario
    public function create_user(Request $request)
    {
        // Validación de los datos del formulario con mensajes personalizados
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:50|unique:users,username',
            'nombre_completo' => 'required|string|max:200|unique:users,nombre_completo', // Cambiado a nombre_completo
            'email' => 'required|string|email|max:100|unique:users,email',
            'password' => 'required|string|min:6',
            'rol' => 'required|in:Maestro,Alumno,Administrador',
        ], [
            'username.required' => 'El nombre de usuario es requerido',
            'username.unique' => 'El nombre de usuario ya está en uso',
            'nombre_completo.required' => 'El nombre completo es requerido',
            'nombre_completo.unique' => 'El nombre completo ya está en uso',
            'email.required' => 'El correo electrónico es requerido',
            'email.email' => 'El correo electrónico debe ser una dirección válida',
            'email.unique' => 'El correo electrónico ya está registrado',
            'password.required' => 'La contraseña es requerida',
            'password.min' => 'La contraseña debe tener al menos 6 caracteres',
            'rol.required' => 'El rol es requerido',
            'rol.in' => 'El rol debe ser Maestro, Alumno o Administrador',
        ]);

        if ($validator->fails()) {
            Log::error('Errores de validación al crear usuario:', $validator->errors()->toArray());
            return response()->json(['status' => 'validation_failed', 'errors' => $validator->errors()], 400);
        }

        // Crear el usuario
        $user = User::create([
            'username' => $request->username,
            'nombre_completo' => $request->nombre_completo, // Cambiado a nombre_completo
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'rol' => $request->rol,
        ]);

        return response()->json([
            'message' => 'Usuario registrado exitosamente',
            'user' => $user
        ], 201);
    }

    // Obtener todos los usuarios
    public function get_users()
    {
        return response()->json(User::all());
    }

    // Obtener un usuario por ID o correo electrónico
    public function get_user($idOrEmail)
    {
        $user = User::where('id_usuario', $idOrEmail)->orWhere('email', $idOrEmail)->first();

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        return response()->json($user);
    }

    // Actualizar un usuario por ID
    public function update_user(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $validator = Validator::make(
            $request->all(),
            [
                'username' => 'string|max:50|unique:users,username,' . $user->id_usuario . ',id_usuario',
                'nombre_completo' => 'string|max:200|unique:users,nombre_completo,' . $user->id_usuario . ',id_usuario',
                'email' => 'string|email|max:100|unique:users,email,' . $user->id_usuario . ',id_usuario',
                'password' => 'nullable|string|min:6',
                'rol' => 'in:Maestro,Alumno,Administrador',
            ],
            [
                'username.unique' => 'El nombre de usuario ya está en uso',
                'nombre_completo.unique' => 'El nombre completo ya está en uso', 
                'email.unique' => 'El correo electrónico ya está registrado',
                'email.email' => 'El correo electrónico debe ser una dirección válida',
                'password.min' => 'La contraseña debe tener al menos 6 caracteres',
                'rol.in' => 'El rol debe ser Maestro, Alumno o Administrador',
            ]
        );

        if ($validator->fails()) {
            Log::error('Errores de validación al crear el usuario:', $validator->errors()->toArray());
            return response()->json(['status' => 'validation_failed', 'errors' => $validator->errors()], 400);
        }

        $user->fill($request->only(['username', 'nombre_completo', 'email', 'rol'])); // Cambiado a nombre_completo

        // Solo actualiza la contraseña si se proporciona una nueva
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return response()->json(['message' => 'Usuario actualizado exitosamente', 'user' => $user]);
    }

    public function delete_user($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $user->delete();
        return response()->json(['message' => 'Usuario eliminado exitosamente']);
    }
}
