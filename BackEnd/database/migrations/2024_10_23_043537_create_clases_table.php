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
        Schema::create('clases', function (Blueprint $table) {
            $table->id('id_clase');
            $table->string('nombre', 100)->unique();
            $table->text('descripcion')->nullable();
            $table->unsignedBigInteger('maestro_id')->nullable();
            $table->unsignedBigInteger('grado_id'); 
            $table->unsignedBigInteger('materia_id'); 
            $table->unsignedBigInteger('seccion_id'); 
            $table->timestamps();

            // Llave foránea con la tabla Usuarios (maestros)
            $table->foreign('maestro_id')->references('id_usuario')->on('users')->onDelete('SET NULL');
            // Llave foránea con la tabla Grados (grado de la clase)
            $table->foreign('grado_id')->references('id_grado')->on('grados')->onDelete('CASCADE');
            // Llave foránea con la tabla Materias
            $table->foreign('materia_id')->references('id_materia')->on('materias')->onDelete('CASCADE');
            // Llave foránea con la tabla Secciones
            $table->foreign('seccion_id')->references('id_seccion')->on('secciones')->onDelete('CASCADE');
        });

        // Insertar valores predeterminados
        DB::table('clases')->insert([
            [
                'nombre' => 'Matematica A',
                'descripcion' => 'Clase de matemáticas de la sección A',
                'maestro_id' => 2, // Juan Pérez
                'grado_id' => 1, // Primer grado
                'materia_id' => 1, // Ejemplo de ID de materia
                'seccion_id' => 1, // Ejemplo de ID de sección
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Matematica B',
                'descripcion' => 'Clase de matemáticas de la sección B',
                'maestro_id' => 2, // Juan Pérez
                'grado_id' => 1, // Primer grado
                'materia_id' => 1, // Ejemplo de ID de materia
                'seccion_id' => 2, // Ejemplo de ID de sección
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Lenguaje A', 
                'descripcion' => 'Clase de Lenguaje de la sección A',
                'maestro_id' => 2, // Juan Pérez
                'grado_id' => 1, // Primer grado
                'materia_id' => 2, // Ejemplo de ID de materia
                'seccion_id' => 1, // Ejemplo de ID de sección
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Lenguaje B',
                'descripcion' => 'Clase de Lenguaje de la sección B',
                'maestro_id' => 2, // Juan Pérez
                'grado_id' => 1, // Primer grado
                'materia_id' => 2, // Ejemplo de ID de materia
                'seccion_id' => 2, // Ejemplo de ID de sección
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('clases');
    }
};
