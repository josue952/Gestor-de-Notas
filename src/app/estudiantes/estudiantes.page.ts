import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { EstudiantesService } from '../services/estudiantes.service';
import { ClasesService } from '../services/clases.service';
import { UsersService } from '../services/users.service';
import { GradosService } from '../services/grados.service';

interface Usuarios {
  id_usuario?: number;
  username: string;
  nombre_completo: string;
  email: string;
  rol: string;
}

interface Clases {
  id_clase?: number;
  nombre: string;
}

interface Grados {
  id_grado?: number;
  nombre: string;
}

interface Estudiantes {
  estudiante_id?: number;
  carnet_estudiante: number;
  usuario_id: number;
  clase_id: number;
  grado_id: number;
  usuario?: Usuarios;
  clase?: Clases;
  grado?: Grados; // Añade esta línea
}

@Component({
  selector: 'app-estudiantes',
  templateUrl: './estudiantes.page.html',
  styleUrls: ['./estudiantes.page.scss'],
})
export class EstudiantesPage implements OnInit {
  estudiantes: Estudiantes[] = [];
  clases: Clases[] = [];
  alumnos: Usuarios[] = [];
  grados: Grados[] = [];
  paginatedEstudiantes: Estudiantes[] = [];
  filtroTexto: string = '';
  filtroEstado: string = 'todos';
  modalAbierto = false;
  estudianteActual: Estudiantes = {
    carnet_estudiante: 0,
    usuario_id: 0,
    clase_id: 0,
    grado_id: 0,
  };

  paginaActual: number = 1;
  estudiantesPorPagina: number = 5;
  totalPaginas: number = 0;

  constructor(
    private estudiantesService: EstudiantesService,
    private UsersService: UsersService,
    private clasesService: ClasesService,
    private gradosService: GradosService,
    private modalController: ModalController,
    private alertController: AlertController
  ) {
    this.aplicarFiltro();
  }

  aplicarFiltro() {
    let estudiantesFiltrados: Estudiantes[] = [];

    if (this.filtroEstado === 'todos') {
      estudiantesFiltrados = this.estudiantes;
    } else if (this.filtroEstado === 'registrados') {
      estudiantesFiltrados = this.estudiantes.filter((estudiante) =>
        this.alumnos.some(
          (alumno) => alumno.id_usuario === estudiante.usuario_id
        )
      );
    } else if (this.filtroEstado === 'no-registrados') {
      estudiantesFiltrados = this.estudiantes.filter(
        (estudiante) =>
          !this.alumnos.some(
            (alumno) => alumno.id_usuario === estudiante.usuario_id
          )
      );
    }

    // Filtrado por texto adicional en el nombre del estudiante si es necesario
    if (this.filtroTexto) {
      estudiantesFiltrados = estudiantesFiltrados.filter((estudiante) =>
        estudiante.usuario?.nombre_completo
          .toLowerCase()
          .includes(this.filtroTexto.toLowerCase())
      );
    }

    this.paginatedEstudiantes = this.paginarEstudiantes(estudiantesFiltrados);
  }

  paginarEstudiantes(estudiantes: any[]) {
    const totalPaginas = Math.ceil(
      estudiantes.length / this.estudiantesPorPagina
    );
    this.totalPaginas = totalPaginas;

    const inicio = (this.paginaActual - 1) * this.estudiantesPorPagina;
    return estudiantes.slice(inicio, inicio + this.estudiantesPorPagina);
  }

  ngOnInit(): void {
    this.cargarEstudiantes();
    this.cargarClases();
    this.cargarAlumnos();
    this.cargarGrados();
    this.cerrarModal();
  }

  async cargarEstudiantes() {
    try {
      this.estudiantes = await this.estudiantesService.getEstudiantes();
      console.log('Estudiantes cargados:', this.estudiantes);
      this.totalPaginas = Math.ceil(
        this.estudiantes.length / this.estudiantesPorPagina
      );
      this.actualizarPaginacion();
    } catch (error) {
      console.error('Error al cargar los estudiantes:', error);
      this.mostrarAlertaError(
        'Error al cargar los estudiantes. Inténtelo de nuevo más tarde.'
      );
    }
  }

  //cargar a todos los usuarios que sean alumnos
  async cargarAlumnos() {
    try {
      const usuarios = await this.UsersService.getUsers();
      this.alumnos = usuarios.filter(
        (usuario: any) => usuario.rol === 'Alumno'
      );
      console.log('Alumnos cargados:', this.alumnos); // Verifica aquí
    } catch (error) {
      console.error('Error al cargar alumnos:', error);
    }
  }

  //cargar a un alumno
  async cargarAlumno(id: number) {
    try {
      const alumno = await this.UsersService.getUser(id);
      return alumno;
    } catch (error) {
      console.error('Error al cargar alumno:', error);
    }
  }

  //cargar a todas las clases
  async cargarClases() {
    try {
      this.clases = await this.clasesService.getClases();
      console.log('Clases cargados:', this.clases);
    } catch (error) {
      console.error('Error al cargar clases:', error);
    }
  }

  //cargar a una clase
  async cargarClase(id: number) {
    try {
      const clase = await this.clasesService.getClase(id);
      return clase;
    } catch (error) {
      console.error('Error al cargar la clase:', error);
    }
  }

  //cargar a todos los grados
  async cargarGrados() {
    try {
      this.grados = await this.gradosService.getGrados();
      console.log('Grados cargados:', this.grados);
    } catch (error) {
      console.error('Error al cargar grados:', error);
    }
  }

  //cargar a un grado
  async cargarGrado(id: number) {
    try {
      const grado = await this.gradosService.getGrado(id);
      return grado;
    } catch (error) {
      console.error('Error al cargar el grado:', error);
    }
  }

  actualizarPaginacion() {
    const inicio = (this.paginaActual - 1) * this.estudiantesPorPagina;
    this.paginatedEstudiantes = this.estudiantes.slice(
      inicio,
      inicio + this.estudiantesPorPagina
    );
  }

  cambiarPagina(pagina: number) {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaActual = pagina;
    this.actualizarPaginacion();
  }

  abrirModal(clase?: Estudiantes) {
    this.modalAbierto = true;
    if (clase) {
      this.estudianteActual = clase;
    } else {
      this.estudianteActual = {
        carnet_estudiante: 0,
        usuario_id: 0,
        clase_id: 0,
        grado_id: 0,
      };
    }
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  async guardarEstudiante() {
    console.log('Estudiante a guardar:', this.estudianteActual);
    try {
      // Convertir carnet_estudiante, usuario_id, y clase_id a números
      this.estudianteActual.carnet_estudiante = parseInt(
        this.estudianteActual.carnet_estudiante.toString(),
        10
      );
      this.estudianteActual.usuario_id = Number(
        this.estudianteActual.usuario_id
      );
      this.estudianteActual.clase_id = Number(this.estudianteActual.clase_id);

      if (this.estudianteActual.estudiante_id) {
        await this.estudiantesService.updateEstudiante(
          this.estudianteActual.estudiante_id,
          this.estudianteActual
        );
      } else {
        await this.estudiantesService.createEstudiante(this.estudianteActual);
      }

      this.cerrarModal();
      await this.cargarEstudiantes(); // Recargar la lista de estudiantes
    } catch (error: any) {
      console.error('Error al procesar el estudiante:', error);
      let mensajeError = 'Por favor, revise los datos e intente nuevamente.';

      if (error?.status === 'validation_failed' && error.errors) {
        mensajeError = Object.values(error.errors)
          .map((err: any) => err[0])
          .join(', ');
      }

      this.mostrarAlertaError(
        'Error al procesar al estudiante. ' + mensajeError
      );
    }
  }

  async mostrarAlertaError(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async eliminarEstudiante(id?: number) {
    if (id === undefined) {
      console.error('El ID del estudiante no está definido');
      return; // O maneja el error de otra forma
    }

    // Mostrar alerta de confirmación
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Está seguro de que desea eliminar este estudiante?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Eliminación cancelada');
          },
        },
        {
          text: 'Eliminar',
          handler: async () => {
            try {
              await this.estudiantesService.deleteEstudiante(id);
              await this.cargarEstudiantes(); // Recargar la lista de estudiantes

              // Verifica si hay estudiantes en la página actual
              if (
                this.paginatedEstudiantes.length === 0 &&
                this.paginaActual > 1
              ) {
                this.paginaActual--; // Decrementa la página actual si no hay estudiantes
                await this.actualizarPaginacion(); // Actualiza la paginación
              }
            } catch (error) {
              console.error('Error al eliminar el estudiante:', error);
            }
          },
        },
      ],
    });

    await alert.present();
  }
}
