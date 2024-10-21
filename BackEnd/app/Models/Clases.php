<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Clases extends Model
{
    use HasFactory;

    // Define la tabla asociada al modelo (opcional si sigue la convención de nombres)
    protected $table = 'clases';

    // Define la clave primaria de la tabla
    protected $primaryKey = 'id_clase';

    // Define los atributos que se pueden asignar de forma masiva
    protected $fillable = [
        'nombre',
        'descripcion',
        'maestro_id',
    ];

    /**
     * Relación con el modelo User (Usuarios).
     * Una clase pertenece a un maestro.
     */
    public function maestro()
    {
        return $this->belongsTo(User::class, 'maestro_id', 'id_usuario');
    }
}
