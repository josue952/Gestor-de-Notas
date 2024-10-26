CREATE DATABASE gestor_notas;
USE gestor_notas;

-- Tabla Usuarios
CREATE TABLE users (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    apellido VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('Maestro', 'Alumno', 'Administrador') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Tabla Grados
CREATE TABLE Grados (
    id_grado INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    registros ENUM('3', '4', '5') NOT NULL, -- Número de subNotas permitidas ahora en Grados
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla Clases
CREATE TABLE Clases (
    id_clase INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    maestro_id INT,
    grado_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (maestro_id) REFERENCES Usuarios(id_usuario) ON DELETE SET NULL,
    FOREIGN KEY (grado_id) REFERENCES Grados(id_grado) ON DELETE CASCADE
);

-- Tabla Materias
CREATE TABLE Materias (
    id_materia INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    clase_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (clase_id) REFERENCES Clases(id_clase) ON DELETE CASCADE
);

-- Tabla Estudiantes
CREATE TABLE Estudiantes (
    carnet_estudiante INT NOT NULL,
    usuario_id INT,
    clase_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (carnet_estudiante),
    FOREIGN KEY (usuario_id) REFERENCES users(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (clase_id) REFERENCES Clases(id_clase) ON DELETE CASCADE,
    UNIQUE(carnet_estudiante)
);

-- Tabla Calificaciones (sin la columna "registros")
CREATE TABLE Calificaciones (
    id_calificacion INT AUTO_INCREMENT PRIMARY KEY,
    estudiante_id INT,
    clase_id INT,
    materia_id INT,
    maestro_id INT,
    nota_final DECIMAL(5, 2) DEFAULT 0,
    fecha_asignacion DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (estudiante_id) REFERENCES Estudiantes(carnet_estudiante) ON DELETE CASCADE,
    FOREIGN KEY (clase_id) REFERENCES Clases(id_clase) ON DELETE CASCADE,
    FOREIGN KEY (materia_id) REFERENCES Materias(id_materia) ON DELETE CASCADE,
    FOREIGN KEY (maestro_id) REFERENCES users(id_usuario) ON DELETE SET NULL
);

-- Tabla SubNotas
CREATE TABLE SubNotas (
    id_subnota INT AUTO_INCREMENT PRIMARY KEY,
    calificacion_id INT,
    subnota DECIMAL(5, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (calificacion_id) REFERENCES Calificaciones(id_calificacion) ON DELETE CASCADE
);





