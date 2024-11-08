<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    // Especifica la tabla y la clave primaria si no son las predeterminadas
    protected $table = 'users';
    protected $primaryKey = 'id_usuario';

    // Los campos que se pueden asignar masivamente
    protected $fillable = [
        'username', 'nombre_completo', 'email', 'password', 'rol', // Cambiado a nombre_completo
    ];

    // Oculta los campos que no quieres exponer en la respuesta JSON
    protected $hidden = [
        'password', 'remember_token',
    ];

    // Automáticamente añade `created_at` y `updated_at`
    public $timestamps = true;
}
