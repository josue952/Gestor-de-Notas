<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GradoMateria extends Model
{
    use HasFactory;

    protected $table = 'grado_materia';
    protected $primaryKey = 'id_GradoMateria';

    protected $fillable = [
        'id_grado',
        'id_materia',
    ];

    // Relación con Grado
    public function grado()
    {
        return $this->belongsTo(Grados::class, 'id_grado');
    }

    // Relación con Materia
    public function materia()
    {
        return $this->belongsTo(Materias::class, 'id_materia');
    }

}