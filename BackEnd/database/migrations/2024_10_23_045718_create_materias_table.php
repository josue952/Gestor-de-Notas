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
        Schema::create('materias', function (Blueprint $table) {
            $table->id('id_materia');
            $table->string('nombre', 100)->unique();
            $table->unsignedBigInteger('clase_id');
            $table->timestamps();

            // Clave foránea que hace referencia a la tabla 'clases'
            $table->foreign('clase_id')
                ->references('id_clase')
                ->on('clases')
                ->onDelete('cascade');
        });

        // Insertar valores predeterminados
        DB::table('materias')->insert([
            [
                'nombre' => 'Matemáticas',
                'clase_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Lenguaje',
                'clase_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Ciencias',
                'clase_id' => 3,
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
        Schema::dropIfExists('materias');
    }
};
