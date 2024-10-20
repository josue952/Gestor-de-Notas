<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User; // Asegúrate de tener el modelo User
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function create_user(Request $request)
    {
        // Validación de los datos del formulario
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:50|unique:users',
            'nombre' => 'required|string|max:100|unique:users',
            'apellido' => 'required|string|max:100|unique:users',
            'email' => 'required|string|email|max:100|unique:users',
            'password' => 'required|string|min:6',
            'rol' => 'required|in:Maestro,Alumno,Administrador',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

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

    public function get_users()
    {
        return response()->json(User::all());
    }

    public function get_user($idOrEmail)
{
    // Intentar encontrar al usuario por ID
    $user = User::find($idOrEmail);

    // Si no se encontró por ID, intentar buscar por correo electrónico
    if (!$user) {
        $user = User::where('email', $idOrEmail)->first();
    }

    // Verificar si se encontró al usuario
    if (!$user) {
        return response()->json(['message' => 'Usuario no encontrado'], 404);
    }

    return response()->json($user);
}

    public function update_user(Request $request, $id)
{
    // Encuentra el usuario por id_usuario
    $user = User::find($id);
    if (!$user) {
        return response()->json(['message' => 'Usuario no encontrado'], 404);
    }

    // Validación
    $validator = Validator::make($request->all(), [
        'username' => 'string|max:50|unique:users,username,' . $user->id_usuario . ',id_usuario',
        'nombre' => 'string|max:100',
        'apellido' => 'string|max:100',
        'email' => 'string|email|max:100|unique:users,email,' . $user->id_usuario . ',id_usuario',
        'password' => 'string|min:6',
        'rol' => 'in:Maestro,Alumno',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 400);
    }

    // Actualizar campos
    $user->update($request->only(['username', 'nombre', 'apellido', 'email', 'rol']));

    // Actualiza la contraseña si se proporciona
    if ($request->password) {
        $user->password = Hash::make($request->password);
        $user->save();
    }

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
