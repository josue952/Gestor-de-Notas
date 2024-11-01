<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

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
            $table->unsignedBigInteger('grado_id'); // Nueva columna para referencia al grado
            $table->timestamps();

            $table->primary('carnet_estudiante'); // Define como clave primaria

            // Llave foránea referenciando a la tabla Usuarios
            $table->foreign('usuario_id')->references('id_usuario')->on('users')->onDelete('cascade');

            // Llave foránea referenciando a la tabla Clases

            // Llave foránea referenciando a la tabla Grados
            $table->foreign('grado_id')->references('id_grado')->on('grados')->onDelete('cascade');
        });

        // Insertar valores predeterminados
        DB::table('estudiantes')->insert([
            [
                'carnet_estudiante' => 20190001,
                'usuario_id' => 3,
                'grado_id' => 1, 
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
