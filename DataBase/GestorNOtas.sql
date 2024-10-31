-- Estructura de la base de datos `gestor_notas`
CREATE DATABASE IF NOT EXISTS `gestor_notas`;
USE `gestor_notas`;

-- Estructura de tabla para la tabla `failed_jobs`
CREATE TABLE `failed_jobs` (
    `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    `uuid` varchar(255) NOT NULL,
    `connection` text NOT NULL,
    `queue` text NOT NULL,
    `payload` longtext NOT NULL,
    `exception` longtext NOT NULL,
    `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
    PRIMARY KEY (`id`),
    UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Estructura de tabla para la tabla `migrations`
CREATE TABLE `migrations` (
    `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    `migration` varchar(255) NOT NULL,
    `batch` int(11) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Estructura de tabla para la tabla `password_reset_tokens`
CREATE TABLE `password_reset_tokens` (
    `email` varchar(255) NOT NULL,
    `token` varchar(255) NOT NULL,
    `created_at` timestamp NULL DEFAULT NULL,
    PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Estructura de tabla para la tabla `personal_access_tokens`
CREATE TABLE `personal_access_tokens` (
    `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    `tokenable_type` varchar(255) NOT NULL,
    `tokenable_id` bigint(20) UNSIGNED NOT NULL,
    `name` varchar(255) NOT NULL,
    `token` varchar(64) NOT NULL,
    `abilities` text DEFAULT NULL,
    `last_used_at` timestamp NULL DEFAULT NULL,
    `expires_at` timestamp NULL DEFAULT NULL,
    `created_at` timestamp NULL DEFAULT NULL,
    `updated_at` timestamp NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
    KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Estructura de tabla para la tabla `users`
CREATE TABLE `users` (
    `id_usuario` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    `username` varchar(50) NOT NULL,
    `nombre_completo` varchar(200) NOT NULL,
    `email` varchar(100) NOT NULL,
    `password` varchar(255) NOT NULL,
    `rol` enum('Maestro','Alumno','Administrador') NOT NULL,
    `created_at` timestamp NULL DEFAULT NULL,
    `updated_at` timestamp NULL DEFAULT NULL,
    PRIMARY KEY (`id_usuario`),
    UNIQUE KEY `users_username_unique` (`username`),
    UNIQUE KEY `users_nombre_completo_unique` (`nombre_completo`),
    UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Estructura de tabla para la tabla `grados`
CREATE TABLE `grados` (
    `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    `nombre_grado` varchar(255) NOT NULL,
    `descripcion` text,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Estructura de tabla para la tabla `clases`
CREATE TABLE `clases` (
    `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    `nombre_clase` varchar(255) NOT NULL,
    `descripcion` text,
    `grado_id` int(10) UNSIGNED NOT NULL,
    PRIMARY KEY (`id`),
    KEY `grado_id` (`grado_id`),
    CONSTRAINT `clases_grado_id_foreign` FOREIGN KEY (`grado_id`) REFERENCES `grados` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Estructura de tabla para la tabla `materias`
CREATE TABLE `materias` (
    `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    `nombre_materia` varchar(255) NOT NULL,
    `descripcion` text,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Estructura de tabla para la tabla `estudiantes`
CREATE TABLE `estudiantes` (
    `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    `nombre` varchar(255) NOT NULL,
    `apellido` varchar(255) NOT NULL,
    `email` varchar(255) NOT NULL,
    `grado_id` int(10) UNSIGNED NOT NULL,
    PRIMARY KEY (`id`),
    KEY `grado_id` (`grado_id`),
    CONSTRAINT `estudiantes_grado_id_foreign` FOREIGN KEY (`grado_id`) REFERENCES `grados` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Estructura de tabla para la tabla `calificaciones`
CREATE TABLE `calificaciones` (
    `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    `estudiante_id` int(10) UNSIGNED NOT NULL,
    `materia_id` int(10) UNSIGNED NOT NULL,
    `nota` decimal(5,2) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `estudiante_id` (`estudiante_id`),
    KEY `materia_id` (`materia_id`),
    CONSTRAINT `calificaciones_estudiante_id_foreign` FOREIGN KEY (`estudiante_id`) REFERENCES `estudiantes` (`id`) ON DELETE CASCADE,
    CONSTRAINT `calificaciones_materia_id_foreign` FOREIGN KEY (`materia_id`) REFERENCES `materias` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Estructura de tabla para la tabla `sub_notas`
CREATE TABLE `sub_notas` (
    `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    `calificacion_id` int(10) UNSIGNED NOT NULL,
    `sub_nota` decimal(5,2) NOT NULL,
    `descripcion` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `calificacion_id` (`calificacion_id`),
    CONSTRAINT `sub_notas_calificacion_id_foreign` FOREIGN KEY (`calificacion_id`) REFERENCES `calificaciones` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- AUTO_INCREMENT de las tablas volcadas
ALTER TABLE `grados`
    MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
ALTER TABLE `clases`
    MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
ALTER TABLE `materias`
    MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
ALTER TABLE `estudiantes`
    MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
ALTER TABLE `calificaciones`
    MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
ALTER TABLE `sub_notas`
    MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;