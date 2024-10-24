<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Calificaciones extends Model
{
    use HasFactory;

    protected $table = 'calificaciones';
    protected $primaryKey = 'id_calificacion';

    protected $fillable = [
        'estudiante_id', 
        'clase_id', 
        'materia_id', 
        'maestro_id', 
        'registros', 
        'nota_final', 
        'fecha_asignacion'
    ];

    // Relación con Estudiante
    public function estudiante()
    {
        return $this->belongsTo(Estudiantes::class, 'estudiante_id', 'carnet_estudiante');
    }

    // Relación con Clase
    public function clase()
    {
        return $this->belongsTo(Clases::class, 'clase_id', 'id_clase');
    }

    // Relación con Materia
    public function materia()
    {
        return $this->belongsTo(Materias::class, 'materia_id', 'id_materia');
    }

    // Relación con Maestro
    public function maestro()
    {
        return $this->belongsTo(User::class, 'maestro_id', 'id_usuario');
    }
}
