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
            $table->text('objetivo'); // Agregar columna 'objetivo'
            $table->timestamps();
        });

        // Insertar valores predeterminados
        DB::table('materias')->insert([
            [
                'nombre' => 'Matemáticas',
                'objetivo' => 'Desarrollar habilidades analíticas y de resolución de problemas.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Lenguaje',
                'objetivo' => 'Mejorar las habilidades de comunicación y expresión escrita y oral.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Ciencias',
                'objetivo' => 'Fomentar el conocimiento científico y la curiosidad sobre el mundo natural.',
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
