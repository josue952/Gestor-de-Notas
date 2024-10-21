<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Materias extends Model
{
    use HasFactory;

    // Define la tabla asociada al modelo (opcional si sigue la convención de nombres)
    protected $table = 'materias';

    // Define la clave primaria de la tabla
    protected $primaryKey = 'id_materia';

    // Define los atributos que se pueden asignar de forma masiva
    protected $fillable = [
        'nombre',
        'clase_id',
    ];

    /**
     * Relación con el modelo Clase.
     * Una materia pertenece a una clase.
     */
    public function clase()
    {
        return $this->belongsTo(Clases::class, 'clase_id', 'id_clase');
    }

}
