<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Clases;
use App\Models\User;

class ClasesController extends Controller
{
    public function create_clase(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:100',
            'descripcion' => 'nullable|string',
            'maestro_id' => 'nullable|exists:users,id_usuario',
        ]);

        $clase = Clases::create($request->all());

        return response()->json(['message' => 'Clase creada exitosamente', 'clase' => $clase], 201);
    }

    public function get_clases()
    {
        return response()->json(Clases::all());
    }

    public function get_clase($id)
    {
        $clase = Clases::find($id);
        if (!$clase) {
            return response()->json(['message' => 'Clase no encontrada'], 404);
        }
        return response()->json($clase);
    }

    public function update_clase(Request $request, $id)
    {
        $clase = Clases::find($id);
        if (!$clase) {
            return response()->json(['message' => 'Clase no encontrada'], 404);
        }

        $request->validate([
            'nombre' => 'string|max:100',
            'descripcion' => 'nullable|string',
            'maestro_id' => 'nullable|exists:users,id_usuario',
        ]);

        $clase->update($request->all());

        return response()->json(['message' => 'Clase actualizada exitosamente', 'clase' => $clase]);
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
