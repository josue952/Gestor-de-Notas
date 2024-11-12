<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    // Método para el login
    public function login(Request $request)
    {
        // Validar la entrada del formulario
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Intentar encontrar el usuario por su email
        $user = User::where('email', $request->email)->first();

        // Verificar si el usuario existe y la contraseña es correcta
        if ($user && Hash::check($request->password, $user->password)) {
            
            // Validar el rol del usuario antes de generar el token
            if ($user->rol === 'Alumno') {
                // Si el rol es "Alumno", impedir acceso y retornar un error
                return response()->json([
                    'message' => 'Los usuarios no tienen permitido accesar al sistema por el momento, vuelva más tarde.'
                ], 403);
            }

            // Si el rol es "Administrador" o "Maestro", crear el token de autenticación
            $token = $user->createToken('auth_token')->plainTextToken;

            // Devolver la respuesta con el token y el rol del usuario
            return response()->json([
                'message' => 'Login successful',
                'token' => $token,
                'role' => $user->rol // Enviar el rol para guardar en el front-end
            ], 200);
        } else {
            // Respuesta de error para credenciales inválidas
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }
    }
}
