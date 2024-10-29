<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGradosTable extends Migration
{
    public function up()
    {
        Schema::create('grados', function (Blueprint $table) {
            $table->id('id_grado');
            $table->string('nombre', 100)->unique();
            $table->text('descripcion')->nullable();
            $table->unsignedTinyInteger('registros')->default(3); // Nueva columna para registros
            $table->timestamps();
        });

        // Insertar valores predeterminados
        DB::table('grados')->insert([
            [
                'nombre' => 'Primero',
                'descripcion' => 'Primer grado de educación básica',
                'registros' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Segundo',
                'descripcion' => 'Segundo grado de educación básica',
                'registros' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Tercero',
                'descripcion' => 'Tercer grado de educación básica',
                'registros' => 5,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Cuarto',
                'descripcion' => 'Cuarto grado de educación básica',
                'registros' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Quinto',
                'descripcion' => 'Quinto grado de educación básica',
                'registros' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Sexto',
                'descripcion' => 'Sexto grado de educación básica',
                'registros' => 5,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    public function down()
    {
        Schema::dropIfExists('grados');
    }
}
