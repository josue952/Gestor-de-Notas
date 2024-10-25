<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SubNotas;
use App\Models\Calificaciones;

class SubNotasController extends Controller
{
    // Crear subnotas basado en el número de "registros"
    public function store(Request $request, $calificacion_id)
    {
        // Validar los datos de entrada
        $request->validate([
            'subnotas' => 'required|array', // Se espera un array de subnotas
            'subnotas.*' => 'required|numeric|min:0|max:10', // Cada subnota debe ser un número entre 0 y 10
        ]);

        // Obtener la calificación asociada
        $calificacion = Calificaciones::findOrFail($calificacion_id);

        // Verificar que el número de subnotas no exceda el valor de "registros" en la tabla calificaciones
        $numRegistrosPermitidos = (int)$calificacion->registros;
        $numSubNotas = count($request->subnotas);

        if ($numSubNotas > $numRegistrosPermitidos) {
            return response()->json([
                'error' => "Solo se permiten $numRegistrosPermitidos subnotas para esta calificación."
            ], 400);
        }

        // Eliminar subnotas anteriores si existen
        SubNotas::where('calificacion_id', $calificacion_id)->delete();

        // Insertar las nuevas subnotas
        foreach ($request->subnotas as $subnota) {
            SubNotas::create([
                'calificacion_id' => $calificacion_id,
                'subnota' => $subnota,
            ]);
        }

        // Calcular la nueva nota final
        $notaFinal = array_sum($request->subnotas) / $numSubNotas;

        // Actualizar la nota final en la tabla calificaciones
        $calificacion->nota_final = $notaFinal;
        $calificacion->save();

        return response()->json([
            'message' => 'Subnotas y nota final actualizadas correctamente.',
            'nota_final' => $notaFinal,
        ], 200);
    }

    // Obtener las subnotas de una calificación
    public function show($calificacion_id)
    {
        $subnotas = SubNotas::where('calificacion_id', $calificacion_id)->get();

        return response()->json($subnotas, 200);
    }

    // Actualizar las subnotas de una calificación
    public function update(Request $request, $calificacion_id)
    {
        // Validar los datos de entrada
        $request->validate([
            'subnotas' => 'required|array', // Se espera un array de subnotas
            'subnotas.*' => 'required|numeric|min:0|max:10', // Cada subnota debe ser un número entre 0 y 10
        ]);

        // Obtener la calificación asociada
        $calificacion = Calificaciones::findOrFail($calificacion_id);

        // Verificar que el número de subnotas no exceda el valor de "registros" en la tabla calificaciones
        $numRegistrosPermitidos = (int)$calificacion->registros;
        $numSubNotas = count($request->subnotas);

        if ($numSubNotas > $numRegistrosPermitidos) {
            return response()->json([
                'error' => "Solo se permiten $numRegistrosPermitidos subnotas para esta calificación."
            ], 400);
        }

        // Eliminar subnotas anteriores si existen
        SubNotas::where('calificacion_id', $calificacion_id)->delete();

        // Insertar las nuevas subnotas
        foreach ($request->subnotas as $subnota) {
            SubNotas::create([
                'calificacion_id' => $calificacion_id,
                'subnota' => $subnota,
            ]);
        }

        // Calcular la nueva nota final
        $notaFinal = array_sum($request->subnotas) / $numSubNotas;

        // Actualizar la nota final en la tabla calificaciones
        $calificacion->nota_final = $notaFinal;
        $calificacion->save();

        return response()->json([
            'message' => 'Subnotas y nota final actualizadas correctamente.',
            'nota_final' => $notaFinal,
        ], 200);
    }

    // Eliminar las subnotas de una calificación
    public function destroy($calificacion_id)
    {
        // Verificar si existen subnotas asociadas a la calificación
        $subnotas = SubNotas::where('calificacion_id', $calificacion_id)->get();

        if ($subnotas->isEmpty()) {
            return response()->json([
                'error' => 'No se encontraron subnotas asociadas a esta calificación.'
            ], 404);
        }

        // Eliminar las subnotas
        SubNotas::where('calificacion_id', $calificacion_id)->delete();

        // Actualizar la nota final en la tabla calificaciones
        $calificacion = Calificaciones::findOrFail($calificacion_id);
        $calificacion->nota_final = null;
        $calificacion->save();

        return response()->json([
            'message' => 'Subnotas eliminadas correctamente.',
        ], 200);
    }

    // Eliminar una subnota específica
    public function deleteSubNota($id_subnota)
    {
        $subnota = SubNotas::findOrFail($id_subnota);
        $calificacion_id = $subnota->calificacion_id;

        // Eliminar la subnota
        $subnota->delete();

        // Recalcular la nota final
        $subnotas = SubNotas::where('calificacion_id', $calificacion_id)->get();
        $numSubNotas = count($subnotas);

        if ($numSubNotas > 0) {
            $notaFinal = array_sum($subnotas->pluck('subnota')->toArray()) / $numSubNotas;

            // Actualizar la nota final en la tabla calificaciones
            $calificacion = Calificaciones::findOrFail($calificacion_id);
            $calificacion->nota_final = $notaFinal;
            $calificacion->save();
        } else {
            // Si no hay subnotas, eliminar la nota final de la calificación
            $calificacion = Calificaciones::findOrFail($calificacion_id);
            $calificacion->nota_final = null;
            $calificacion->save();
        }

        return response()->json([
            'message' => 'Subnota eliminada correctamente.',
            'nota_final' => $calificacion->nota_final,
        ], 200);
    }
}
