<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Grados extends Model
{
    use HasFactory;

    // Define la tabla asociada al modelo (opcional si sigue la convención de nombres)
    protected $table = 'grados';

    // Define la clave primaria de la tabla
    protected $primaryKey = 'id_grado';

    // Define los atributos que se pueden asignar de forma masiva
    protected $fillable = [
        'nombre',
        'descripcion',
        'registros'
    ];
}
