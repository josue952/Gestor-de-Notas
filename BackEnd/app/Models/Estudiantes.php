<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Estudiantes extends Model
{
    use HasFactory;

    // Definir la tabla asociada al modelo
    protected $table = 'estudiantes';

    // Definir la clave primaria personalizada
    protected $primaryKey = 'carnet_estudiante';

    // Desactivar incremento automático, ya que el carnet será ingresado manualmente
    public $incrementing = false;

    // Tipo de dato del carnet
    protected $keyType = 'int';

    // Atributos que se pueden asignar de manera masiva
    protected $fillable = ['carnet_estudiante', 'usuario_id', 'clase_id', 'grado']; // Incluir 'grado'

    // Relación con el modelo Usuario
    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    // Relación con el modelo Clase
    public function clase()
    {
        return $this->belongsTo(Clases::class, 'clase_id');
    }

    // Si 'grado' es un modelo relacionado, puedes definir una relación aquí
    public function grado()
    {
        return $this->belongsTo(Grados::class, 'grado_id');
    }
}