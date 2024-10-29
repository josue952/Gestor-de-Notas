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
        Schema::create('estudiantes', function (Blueprint $table) {
            $table->unsignedInteger('carnet_estudiante')->unique(); // Cambiado a unsignedInteger
            $table->unsignedBigInteger('usuario_id'); // Llave foránea a la tabla Usuarios
            $table->unsignedBigInteger('clase_id'); // Llave foránea a la tabla Clases
            $table->timestamps();

            $table->primary('carnet_estudiante'); // Define como clave primaria

            // Llave foránea referenciando a la tabla Usuarios
            $table->foreign('usuario_id')->references('id_usuario')->on('users')->onDelete('cascade');

            // Llave foránea referenciando a la tabla Clases
            $table->foreign('clase_id')->references('id_clase')->on('clases')->onDelete('cascade');
        });

        // Insertar valores predeterminados
        DB::table('estudiantes')->insert([
            [
                'carnet_estudiante' => 20190001,
                'usuario_id' => 3, // Ana Gómez
                'clase_id' => 1, // Primer grado
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('estudiantes');
    }
};
