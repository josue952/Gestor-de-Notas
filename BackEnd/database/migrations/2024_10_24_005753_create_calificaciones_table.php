<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('calificaciones', function (Blueprint $table) {
            $table->id('id_calificacion');
            $table->unsignedInteger('estudiante_id');
            $table->unsignedBigInteger('clase_id');
            $table->unsignedBigInteger('materia_id');
            $table->unsignedBigInteger('maestro_id')->nullable();
            $table->decimal('nota_final', 5, 2)->nullable()->default(0); // Campo nullable con default 0
            $table->date('fecha_asignacion');
            $table->timestamps();

            $table->foreign('estudiante_id')->references('carnet_estudiante')->on('estudiantes')->onDelete('cascade');
            $table->foreign('clase_id')->references('id_clase')->on('clases')->onDelete('cascade');
            $table->foreign('materia_id')->references('id_materia')->on('materias')->onDelete('cascade');
            $table->foreign('maestro_id')->references('id_usuario')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('calificaciones');
    }
};
