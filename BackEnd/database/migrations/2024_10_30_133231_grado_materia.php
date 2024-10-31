<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('grado_materia', function (Blueprint $table) {
            $table->id('id_GradoMateria');
            $table->unsignedBigInteger('id_grado');
            $table->unsignedBigInteger('id_materia');

            // Agregar timestamps
            $table->timestamps();

            // Definir llaves foráneas y restricciones de integridad referencial
            $table->foreign('id_grado')->references('id_grado')->on('grados')->onDelete('cascade');
            $table->foreign('id_materia')->references('id_materia')->on('materias')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('grado_materia');
    }
};
