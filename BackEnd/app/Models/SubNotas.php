<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubNotas extends Model
{
    use HasFactory;

    protected $table = 'sub_notas';
    protected $primaryKey = 'id_subnota'; // Especifica la clave primaria correcta

    protected $fillable = [
        'calificacion_id',
        'subnota',
    ];

    // Relación con el modelo Calificaciones
    public function calificacion()
    {
        return $this->belongsTo(Calificaciones::class, 'calificacion_id', 'id_calificacion');
    }
}
