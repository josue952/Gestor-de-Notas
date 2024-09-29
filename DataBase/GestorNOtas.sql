CREATE DATABASE gestor_notas;
USE gestor_notas;

-- Tabla Usuarios
CREATE TABLE users (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('Maestro', 'Alumno') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla Clases
CREATE TABLE Clases (
    id_clase INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    maestro_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (maestro_id) REFERENCES Usuarios(id_usuario) ON DELETE SET NULL
);

-- Tabla Materias
CREATE TABLE Materias (
    id_materia INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    clase_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (clase_id) REFERENCES Clases(id_clase) ON DELETE CASCADE
);

-- Tabla Grados
CREATE TABLE Grados (
    id_grado INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla Estudiantes
CREATE TABLE Estudiantes (
    id_estudiantes INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    grado_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (grado_id) REFERENCES Grados(id_grado) ON DELETE CASCADE
);

-- Tabla calificaciones
CREATE TABLE Calificaciones (
    id_calificacion INT AUTO_INCREMENT PRIMARY KEY,
    estudiante_id INT,
    materia_id INT,
    nota DECIMAL(5, 2) NOT NULL,
    fecha_asignacion DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (estudiante_id) REFERENCES Estudiantes(id_estudiantes) ON DELETE CASCADE,
    FOREIGN KEY (materia_id) REFERENCES Materias(id_materia) ON DELETE CASCADE
);





