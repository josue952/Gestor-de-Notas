-- Iniciar la transacción
START TRANSACTION;

-- Base de datos
USE gestor_notas;

-- Actualización de tabla `users`
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
    `id_usuario` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    `username` varchar(50) NOT NULL UNIQUE,
    `nombre` varchar(100) NOT NULL UNIQUE,
    `apellido` varchar(100) NOT NULL UNIQUE,
    `email` varchar(100) NOT NULL UNIQUE,
    `password` varchar(255) NOT NULL,
    `rol` ENUM('Maestro', 'Alumno', 'Administrador') NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Actualización de tabla `Grados`
DROP TABLE IF EXISTS `Grados`;
CREATE TABLE `Grados` (
    `id_grado` INT AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(100) NOT NULL UNIQUE,
    `descripcion` TEXT,
    `registros` ENUM('3', '4', '5') NOT NULL,  -- Número de subNotas permitidas
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Actualización de tabla `Clases`
DROP TABLE IF EXISTS `Clases`;
CREATE TABLE `Clases` (
    `id_clase` INT AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(100) NOT NULL UNIQUE,
    `descripcion` TEXT,
    `maestro_id` INT,
    `grado_id` INT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`maestro_id`) REFERENCES `users`(`id_usuario`) ON DELETE SET NULL,
    FOREIGN KEY (`grado_id`) REFERENCES `Grados`(`id_grado`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Actualización de tabla `Materias`
DROP TABLE IF EXISTS `Materias`;
CREATE TABLE `Materias` (
    `id_materia` INT AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(100) NOT NULL UNIQUE,
    `clase_id` INT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`clase_id`) REFERENCES `Clases`(`id_clase`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Actualización de tabla `Estudiantes`
DROP TABLE IF EXISTS `Estudiantes`;
CREATE TABLE `Estudiantes` (
    `carnet_estudiante` INT NOT NULL,
    `usuario_id` INT,
    `clase_id` INT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`carnet_estudiante`),
    FOREIGN KEY (`usuario_id`) REFERENCES `users`(`id_usuario`) ON DELETE CASCADE,
    FOREIGN KEY (`clase_id`) REFERENCES `Clases`(`id_clase`) ON DELETE CASCADE,
    UNIQUE (`carnet_estudiante`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Actualización de tabla `Calificaciones`
DROP TABLE IF EXISTS `Calificaciones`;
CREATE TABLE `Calificaciones` (
    `id_calificacion` INT AUTO_INCREMENT PRIMARY KEY,
    `estudiante_id` INT,
    `clase_id` INT,
    `materia_id` INT,
    `maestro_id` INT,
    `nota_final` DECIMAL(5, 2) DEFAULT 0,
    `fecha_asignacion` DATE NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`estudiante_id`) REFERENCES `Estudiantes`(`carnet_estudiante`) ON DELETE CASCADE,
    FOREIGN KEY (`clase_id`) REFERENCES `Clases`(`id_clase`) ON DELETE CASCADE,
    FOREIGN KEY (`materia_id`) REFERENCES `Materias`(`id_materia`) ON DELETE CASCADE,
    FOREIGN KEY (`maestro_id`) REFERENCES `users`(`id_usuario`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Actualización de tabla `SubNotas`
DROP TABLE IF EXISTS `SubNotas`;
CREATE TABLE `SubNotas` (
    `id_subnota` INT AUTO_INCREMENT PRIMARY KEY,
    `calificacion_id` INT,
    `subnota` DECIMAL(5, 2) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`calificacion_id`) REFERENCES `Calificaciones`(`id_calificacion`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Confirmación de la transacción
COMMIT;
