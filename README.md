# Gestor-de-Notas
Proyecto Final de DAM

# ClearNotes
## Descripción del Proyecto
"ClearNotes" representa la claridad y simplicidad con la que tanto maestros como alumnos podrán gestionar y consultar calificaciones académicas. El nombre transmite la idea de transparencia y organización en el manejo de notas y reportes educativos.

## Resumen del Proyecto
ClearNotes es una plataforma académica diseñada para la gestión de calificaciones y reportes escolares. Los maestros pueden crear clases, asignaturas y grados, ingresar notas y generar informes de rendimiento académico para cada estudiante. Los alumnos, por su parte, pueden consultar sus calificaciones de manera organizada y acceder a información relevante sobre su rendimiento en diversas materias. ClearNotes facilita la comunicación clara y eficiente entre estudiantes y maestros, ofreciendo una solución integral para la administración académica.

## Objetivos del Proyecto
- Proporcionar una plataforma intuitiva para que los maestros gestionen y registren las calificaciones de los estudiantes.
- Permitir la creación de grados, materias y grupos de estudiantes para una organización académica estructurada.
- Facilitar a los alumnos la consulta rápida y accesible de sus calificaciones en tiempo real.
- Ofrecer funciones de generación de informes de rendimiento académico para maestros y administradores.
- Mejorar la comunicación entre docentes y estudiantes a través de un sistema claro y accesible de seguimiento de notas.
- Garantizar la privacidad y seguridad de la información académica de maestros y alumnos.

## Problema o Necesidad a Resolver
En muchos entornos educativos, los maestros tienen dificultades para gestionar calificaciones de forma eficiente, y los estudiantes carecen de un sistema unificado y claro para consultar sus notas. Los métodos tradicionales de registro de calificaciones pueden ser confusos y difíciles de manejar, tanto para los maestros como para los alumnos. ClearNotes resuelve este problema ofreciendo una plataforma digital donde los docentes pueden organizar, ingresar y compartir calificaciones de manera estructurada, y los estudiantes pueden consultar sus notas académicas fácilmente. Esto mejora la transparencia, la organización y el seguimiento del progreso académico.

## Inicialización del Proyecto

1. **Crear un nuevo proyecto:**
   ```bash
   ionic start gestor-notas blank

2. **Navegar al directorio del proyecto:**
    ```bash
    cd gestor-notas

3. **Ejecutar el proyecto: Para iniciar la aplicación y abrirla en tu navegador, utiliza el siguiente comando:**
    ```bash
    ionic serve

## Manejo de Errores
    Si encuentras errores relacionados con dependencias, puedes intentar ejecutar:

    ```bash
    npm install
    ```
## Tablas Utilizadas en el Proyecto

1. **Usuarios**
   - Almacena la información de los usuarios (maestros y alumnos), incluyendo nombre de usuario, nombre, apellido, correo, contraseña y rol.

2. **Clases**
   - Almacena información sobre las clases disponibles, incluyendo el nombre y descripción de la clase, así como el maestro que la imparte.

3. **Materias**
   - Almacena información sobre las materias o asignaturas, incluyendo el nombre de la materia y a qué clase pertenece.

4. **Grados**
   - Almacena información sobre los grados académicos, incluyendo el nombre y descripción del grado.

5. **Estudiantes**
   - Almacena la información de los estudiantes, vinculados a los usuarios y al grado al que pertenecen.

6. **Calificaciones**
   - Almacena las calificaciones individuales de los estudiantes en cada materia, incluyendo la nota y la fecha en que se asignó.

