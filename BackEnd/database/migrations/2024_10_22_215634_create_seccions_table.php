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
    public function up(): void
    {
        Schema::create('secciones', function (Blueprint $table) {
            $table->id('id_seccion');
            $table->enum('seccion', ['A', 'B', 'C', 'D']); // Solo permite los valores A, B, C y D
            $table->timestamps();
        });

        // Insertar valores predefinidos en la tabla secciones
        DB::table('secciones')->insert([
            ['seccion' => 'A', 'created_at' => now(), 'updated_at' => now()],
            ['seccion' => 'B', 'created_at' => now(), 'updated_at' => now()],
            ['seccion' => 'C', 'created_at' => now(), 'updated_at' => now()],
            ['seccion' => 'D', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('secciones');
    }
};
