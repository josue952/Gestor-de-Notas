<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Clases extends Model
{
    use HasFactory;

    protected $table = 'clases';

    protected $primaryKey = 'id_clase';

    protected $fillable = [
        'nombre',
        'descripcion',
        'maestro_id',
        'grado_id',
        'materia_id',
        'seccion_id'
    ];

    // Relación con el modelo Grado: Una clase pertenece a un grado
    public function grado()
    {
        return $this->belongsTo(Grados::class, 'grado_id', 'id_grado');
    }

    // Relación con el modelo User (Maestro): Una clase tiene un maestro
    public function maestro()
    {
        return $this->belongsTo(User::class, 'maestro_id', 'id_usuario');
    }

    // Relación con el modelo Materia: Una clase pertenece a una materia
    public function materia()
    {
        return $this->belongsTo(Materias::class, 'materia_id', 'id_materia');
    }

    // Relación con el modelo Seccion: Una clase pertenece a una sección
    public function seccion()
    {
        return $this->belongsTo(Secciones::class, 'seccion_id', 'id_seccion');
    }
}
