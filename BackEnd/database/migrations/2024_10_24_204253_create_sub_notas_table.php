<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sub_notas', function (Blueprint $table) {
            $table->id('id_subnota');
            $table->unsignedBigInteger('calificacion_id');
            $table->decimal('subnota', 5, 2);
            $table->timestamps();

            // Foreign key
            $table->foreign('calificacion_id')->references('id_calificacion')->on('calificaciones')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sub_notas');
    }
};