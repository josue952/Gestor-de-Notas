<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User; // Asegúrate de tener el modelo User
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
            'nombre' => 'required|string|max:100',
            'apellido' => 'required|string|max:100',
            'email' => 'required|string|email|max:100|unique:users,email',
            'password' => 'required|string|min:6',
            'rol' => 'required|in:Maestro,Alumno,Administrador',
        ], [
            //Validaciones personalizadas
            'username.required' => 'El nombre de usuario es obligatorio',
            'username.unique' => 'El nombre de usuario ya está en uso',
            'nombre.required' => 'El nombre es obligatorio',
            'apellido.required' => 'El apellido es obligatorio',
            'email.required' => 'El correo electrónico es obligatorio',
            'email.unique' => 'El correo electrónico ya está registrado',
            'email.email' => 'El correo electrónico debe ser una dirección válida',
            'password.required' => 'La contraseña es obligatoria',
            'password.min' => 'La contraseña debe tener al menos 6 caracteres',
            'rol.required' => 'El rol es obligatorio',
            'rol.in' => 'El rol debe ser Maestro, Alumno o Administrador',
        ]);

        // Validación de combinación única de nombre y apellido
        if (
            User::where('nombre', $request->nombre)
                ->where('apellido', $request->apellido)
                ->exists()
        ) {
            $validator->errors()->add('nombre', 'La combinación de nombre y apellido ya está registrada.');
        }

        if ($validator->fails()) {
            Log::error('Errores de validación al crear usuario:', $validator->errors()->toArray());
            return response()->json(['status' => 'validation_failed', 'errors' => $validator->errors()], 400);
        }

        // Crear el usuario
        $user = User::create([
            'username' => $request->username,
            'nombre' => $request->nombre,
            'apellido' => $request->apellido,
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
                'nombre' => 'string|max:100',
                'apellido' => 'string|max:100',
                'email' => 'string|email|max:100|unique:users,email,' . $user->id_usuario . ',id_usuario',
                'password' => 'nullable|string|min:6',
                'rol' => 'in:Maestro,Alumno,Administrador',
            ],
            [
                //Validaciones personalizadas
                'username.unique' => 'El nombre de usuario ya está en uso',
                'email.unique' => 'El correo electrónico ya está registrado',
                'email.email' => 'El correo electrónico debe ser una dirección válida',
                'password.min' => 'La contraseña debe tener al menos 6 caracteres',
                'rol.in' => 'El rol debe ser Maestro, Alumno o Administrador',
            ]
        );

        if ($validator->fails()) {
            Log::error('Errores de validación al editar el usuario:', $validator->errors()->toArray());
            return response()->json(['status' => 'validation_failed', 'errors' => $validator->errors()], 400);
        }

        $user->fill($request->only(['username', 'nombre', 'apellido', 'email', 'rol']));

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
