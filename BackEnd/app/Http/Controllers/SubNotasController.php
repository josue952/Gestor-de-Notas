<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SubNotas;
use App\Models\Calificaciones;
use App\Models\Grados;

class SubNotasController extends Controller
{
    // Crear subnotas basado en el número de "registros" permitido por el grado
    public function store(Request $request, $calificacion_id)
    {
        // Validar los datos de entrada
        $request->validate([
            'subnotas' => 'required|array', // Se espera un array de subnotas
            'subnotas.*' => 'required|numeric|min:0|max:10', // Cada subnota debe ser un número entre 0 y 10
        ]);

        // Verificar si ya existen subnotas asociadas a esta calificación
        $subnotasExistentes = SubNotas::where('calificacion_id', $calificacion_id)->exists();
        if ($subnotasExistentes) {
            return response()->json([
                'error' => 'Ya existen subnotas asociadas a esta calificación. No se pueden crear subnotas adicionales.'
            ], 400);
        }

        // Obtener la calificación y el grado asociado
        $calificacion = Calificaciones::findOrFail($calificacion_id);
        $grado = Grados::findOrFail($calificacion->clase->grado_id);

        // Verificar que el número de subnotas no exceda el valor de "registros" en la tabla Grados
        $numRegistrosPermitidos = (int) $grado->registros;
        $numSubNotas = count($request->subnotas);

        if ($numSubNotas > $numRegistrosPermitidos) {
            return response()->json([
                'error' => "Solo se permiten $numRegistrosPermitidos subnotas para este grado."
            ], 400);
        }

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
            'subnotas' => 'required|array',
            'subnotas.*' => 'required|numeric|min:0|max:10',
        ]);

        // Obtener la calificación y el grado asociado
        $calificacion = Calificaciones::findOrFail($calificacion_id);
        $grado = Grados::findOrFail($calificacion->clase->grado_id);

        // Verificar el número de subnotas permitidas
        $numRegistrosPermitidos = (int) $grado->registros;
        $numSubNotas = count($request->subnotas);

        if ($numSubNotas > $numRegistrosPermitidos) {
            return response()->json([
                'error' => "Solo se permiten $numRegistrosPermitidos subnotas para este grado."
            ], 400);
        }

        // Obtener subnotas existentes de la calificación
        $subnotasExistentes = SubNotas::where('calificacion_id', $calificacion_id)->get();

        // Actualizar las subnotas existentes y agregar las nuevas si es necesario
        foreach ($request->subnotas as $index => $subnota) {
            if (isset($subnotasExistentes[$index])) {
                // Actualizar subnota existente
                $subnotasExistentes[$index]->update(['subnota' => $subnota]);
            } else {
                // Crear una nueva subnota si excede las existentes
                SubNotas::create([
                    'calificacion_id' => $calificacion_id,
                    'subnota' => $subnota,
                ]);
            }
        }

        // Eliminar subnotas adicionales si hay más de las requeridas
        if ($subnotasExistentes->count() > $numSubNotas) {
            foreach ($subnotasExistentes->slice($numSubNotas) as $subnotaExtra) {
                $subnotaExtra->delete();
            }
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
    
    // Cambiar el valor de todas las subnotas de una calificación a 0
    public function destroy($calificacion_id)
    {
        // Verificar si existen subnotas asociadas
        $subnotas = SubNotas::where('calificacion_id', $calificacion_id)->get();

        if ($subnotas->isEmpty()) {
            return response()->json([
                'error' => 'No se encontraron subnotas asociadas a esta calificación.'
            ], 404);
        }

        // Cambiar el valor de todas las subnotas a 0
        SubNotas::where('calificacion_id', $calificacion_id)->update(['subnota' => 0]);

        // Actualizar la nota final a 0 en la tabla calificaciones
        $calificacion = Calificaciones::findOrFail($calificacion_id);
        $calificacion->nota_final = 0;
        $calificacion->save();

        return response()->json([
            'message' => 'Subnotas actualizadas a 0 correctamente.',
            'nota_final' => $calificacion->nota_final,
        ], 200);
    }

    // Cambiar el valor de una subnota específica a 0
    public function deleteSubNota($id_subnota)
    {
        // Obtener la subnota específica
        $subnota = SubNotas::findOrFail($id_subnota);

        // Cambiar el valor de la subnota a 0
        $subnota->subnota = 0;
        $subnota->save();

        // Recalcular la nota final
        $calificacion_id = $subnota->calificacion_id;
        $subnotas = SubNotas::where('calificacion_id', $calificacion_id)->get();
        $numSubNotas = count($subnotas);

        // Si hay subnotas, recalcular la nota final
        if ($numSubNotas > 0) {
            $notaFinal = array_sum($subnotas->pluck('subnota')->toArray()) / $numSubNotas;

            // Actualizar la nota final en la tabla calificaciones
            $calificacion = Calificaciones::findOrFail($calificacion_id);
            $calificacion->nota_final = $notaFinal;
            $calificacion->save();
        } else {
            // Si no hay subnotas, eliminar la nota final
            $calificacion = Calificaciones::findOrFail($calificacion_id);
            $calificacion->nota_final = null;
            $calificacion->save();
        }

        return response()->json([
            'message' => 'Subnota actualizada a 0 correctamente.',
            'nota_final' => $calificacion->nota_final,
        ], 200);
    }
}
