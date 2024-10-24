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

CREATE TABLE Estudiantes (
    carnet_estudiante INT NOT NULL, -- Se elimina AUTO_INCREMENT para que el ID sea manual
    usuario_id INT,
    clase_id INT, -- Ahora hace referencia a la tabla Clases
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (carnet_estudiante), -- El ID sigue siendo la clave primaria
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (clase_id) REFERENCES Clases(id_clase) ON DELETE CASCADE,
    UNIQUE(carnet_estudiante) -- El ID del estudiante debe ser único
);

-- Tabla calificaciones actualizada
CREATE TABLE Calificaciones (
    id_calificacion INT AUTO_INCREMENT PRIMARY KEY,
    estudiante_id INT, -- Referencia al estudiante
    clase_id INT, -- Referencia a la clase/sección donde el estudiante está cursando la materia
    materia_id INT, -- Referencia a la materia
    maestro_id INT, -- Referencia al maestro que subió la calificación
    registros ENUM('3', '4', '5') NOT NULL, -- Número de subNotas permitidas
    nota_final DECIMAL(5, 2) DEFAULT 0, -- La nota final que se obtiene de las subNotas
    fecha_asignacion DATE NOT NULL, -- Fecha en la que se asignó la calificación
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación
    FOREIGN KEY (estudiante_id) REFERENCES Estudiantes(carnet_estudiante) ON DELETE CASCADE, -- Relación con Estudiantes
    FOREIGN KEY (clase_id) REFERENCES Clases(id_clase) ON DELETE CASCADE, -- Relación con Clases (sección donde cursa la materia)
    FOREIGN KEY (materia_id) REFERENCES Materias(id_materia) ON DELETE CASCADE, -- Relación con Materias
    FOREIGN KEY (maestro_id) REFERENCES Users(id_usuario) ON DELETE SET NULL -- Relación con el Maestro (usuario con rol "Maestro")
);

-- Tabla SubNotas para almacenar las subdivisiones de las notas
CREATE TABLE SubNotas (
    id_subnota INT AUTO_INCREMENT PRIMARY KEY,
    calificacion_id INT, -- Referencia a la calificación
    subnota DECIMAL(5, 2) NOT NULL, -- Valor de la subNota
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación de la subNota
    FOREIGN KEY (calificacion_id) REFERENCES Calificaciones(id_calificacion) ON DELETE CASCADE -- Relación con Calificaciones
);





