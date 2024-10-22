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
}
