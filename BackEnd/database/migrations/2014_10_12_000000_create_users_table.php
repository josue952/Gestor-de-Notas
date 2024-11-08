<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id('id_usuario');
            $table->string('username', 50)->unique();
            $table->string('nombre_completo', 200)->unique();
            $table->string('email', 100)->unique();
            $table->string('password');
            $table->enum('rol', ['Maestro', 'Alumno', 'Administrador']);
            $table->timestamps();  // created_at and updated_at
        });

        // Insertar valores predeterminados
        DB::table('users')->insert([
            [
                'username' => 'admin',
                'nombre_completo' => 'Admin Admin', // Combinado en nombre_completo
                'email' => 'admin@gmail.com',
                'password' => bcrypt('123456'), // Asegúrate de encriptar la contraseña
                'rol' => 'Administrador',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'username' => 'maestro1',
                'nombre_completo' => 'Juan Pérez', // Combinado en nombre_completo
                'email' => 'juan@gmail.com',
                'password' => bcrypt('123456'),
                'rol' => 'Maestro',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'username' => 'alumno1',
                'nombre_completo' => 'Ana Gómez', // Combinado en nombre_completo
                'email' => 'ana@example.com',
                'password' => bcrypt('123456'),
                'rol' => 'Alumno',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
