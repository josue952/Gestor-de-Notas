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
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('materias');
    }
};
