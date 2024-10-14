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
            'nombre' => 'required|string|max:100',
            'apellido' => 'required|string|max:100',
            'email' => 'required|string|email|max:100|unique:users',
            'password' => 'required|string|min:6',
            'rol' => 'required|in:Maestro,Alumno',
        ]);

        // Si la validación falla, devolvemos los errores
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        // Crear al usuario en la base de datos con la contraseña encriptada
        $user = User::create([
            'username' => $request->username,
            'nombre' => $request->nombre,
            'apellido' => $request->apellido,
            'email' => $request->email,
            'password' => Hash::make($request->password), // Encripta la contraseña
            'rol' => $request->rol,
        ]);

        return response()->json([
            'message' => 'Usuario registrado exitosamente',
            'user' => $user
        ], 201);
    }
}
