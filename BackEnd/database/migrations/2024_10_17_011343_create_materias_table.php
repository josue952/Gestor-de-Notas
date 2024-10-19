<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMateriasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('materias', function (Blueprint $table) {
            $table->id('id_materia');
            $table->string('nombre', 100);
            $table->unsignedBigInteger('clase_id'); // Asegúrate de que este tipo coincide con el tipo de id_clase
            $table->timestamps();

            $table->foreign('clase_id')->references('id_clase')->on('clases')->onDelete('cascade'); // Definir explícitamente la clave foránea
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('materias');
    }
}
