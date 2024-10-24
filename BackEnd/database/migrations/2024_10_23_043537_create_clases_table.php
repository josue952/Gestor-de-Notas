<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('clases', function (Blueprint $table) {
            $table->id('id_clase');
            $table->string('nombre', 100)->unique();
            $table->text('descripcion')->nullable();
            $table->unsignedBigInteger('maestro_id')->nullable(); // Relación con Usuarios (Maestros)
            $table->unsignedBigInteger('grado_id'); // Relación con Grados (Nuevo campo)
            $table->timestamps();

            // Llave foránea con la tabla Usuarios (maestros)
            $table->foreign('maestro_id')->references('id_usuario')->on('users')->onDelete('SET NULL');
            // Llave foránea con la tabla Grados (grado de la clase)
            $table->foreign('grado_id')->references('id_grado')->on('grados')->onDelete('CASCADE');
        });

        // Insertar valores predeterminados
        DB::table('clases')->insert([
            [
                'nombre' => 'Matemáticas',
                'descripcion' => 'Clase de matemáticas',
                'maestro_id' => 2, // Juan Pérez
                'grado_id' => 1, // Primer grado
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Lenguaje',
                'descripcion' => 'Clase de lenguaje',
                'maestro_id' => 2, // Juan Pérez
                'grado_id' => 1, // Primer grado
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Ciencias',
                'descripcion' => 'Clase de ciencias',
                'maestro_id' => 2, // Juan Pérez
                'grado_id' => 1, // Primer grado
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }

    public function down()
    {
        Schema::dropIfExists('clases');
    }

};
