<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Secciones;

class SeccionesController extends Controller
{
    // Obtener todos los grados
    public function get_secciones()
    {
        return response()->json(Secciones::all());
    }

    // Obtener una seccion por ID
    public function get_seccion($id)
    {
        $seccion = Secciones::find($id);

        if ($seccion) {
            return response()->json($seccion);
        } else {
            return response()->json(['message' => 'Sección no encontrada'], 404);
        }
    }
    
}
