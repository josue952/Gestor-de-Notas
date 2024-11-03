  import { Component, OnInit } from '@angular/core';
  import { ModalController, AlertController } from '@ionic/angular';
  import { EstudiantesService } from '../services/estudiantes.service';
  import { UsersService } from '../services/users.service';
  import { GradosService } from '../services/grados.service';

  interface Usuarios {
    id_usuario?: number;
    username: string;
    nombre_completo: string;
    email: string;
    rol: string;
  }

  interface Grados {
    id_grado?: number;
    nombre: string;
  }

  interface Estudiantes {
    estudiante_id?: number;
    carnet_estudiante: number;
    usuario_id: number;
    grado_id: number;
    usuario?: Usuarios;
    grado?: Grados;
  }

  @Component({
    selector: 'app-estudiantes',
    templateUrl: './estudiantes.page.html',
    styleUrls: ['./estudiantes.page.scss'],
  })
  export class EstudiantesPage implements OnInit {
    estudiantes: Estudiantes[] = [];
    alumnos: Usuarios[] = [];
    grados: Grados[] = [];
    estudiantesNoRegistrados: Usuarios[] = []; // Almacena estudiantes no registrados
    paginatedEstudiantes: Estudiantes[] = [];
    filtroTexto: string = '';
    filtroGrado: string = 'todos';
    modalAbierto = false;
    estudianteActual: Estudiantes = {
      carnet_estudiante: 0,
      usuario_id: 0,
      grado_id: 0,
    };

    paginaActual: number = 1;
    estudiantesPorPagina: number = 5;
    totalPaginas: number = 0;

    constructor(
      private estudiantesService: EstudiantesService,
      private UsersService: UsersService,
      private gradosService: GradosService,
      private modalController: ModalController,
      private alertController: AlertController
    ) {
      this.aplicarFiltro();
    }

    aplicarFiltro() {
      let estudiantesFiltrados: Estudiantes[] = [];

      // Filtrado por grado si es necesario
      if (this.filtroGrado !== 'todos') {
        estudiantesFiltrados = this.estudiantes.filter(
          (estudiante) => estudiante.grado?.nombre === this.filtroGrado
        );
      } else {
        estudiantesFiltrados = this.estudiantes;
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


    async cargarEstudiantesNoRegistrados() {
      try {
        this.estudiantesNoRegistrados =
          await this.estudiantesService.getEstudiantesNoRegistrados();
        console.log(
          'Estudiantes no registrados cargados:',
          this.estudiantesNoRegistrados
        );
      } catch (error) {
        console.error('Error al cargar estudiantes no registrados:', error);
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

    // Obtener un estudiante por ID
    async cargarEstudiante() {
      try {
        const carnet_estudiante = this.estudianteActual.carnet_estudiante;
        const estudiante = await this.estudiantesService.getEstudiante(carnet_estudiante);
        
        this.estudianteActual = estudiante;  
        this.actualizarPaginacion();  
      } catch (error) {
        console.error('Error al cargar el estudiante específico:', error);
        this.mostrarAlertaError('Error al cargar el estudiante específico. Inténtelo de nuevo más tarde.');
      }
    }

    carnetTemporal: string = ''; // Variable temporal para el carnet
    isEditMode: boolean = false; // Variable para saber si estamos en modo edición

    async abrirModal(estudiante?: Estudiantes) {
      this.modalAbierto = true;
  
      if (estudiante) {
        this.isEditMode = true; // Establece que estamos en modo edición
        this.estudianteActual = { ...estudiante };
        this.carnetTemporal = this.estudianteActual.carnet_estudiante.toString(); // Inicializa el carnetTemporal
        await this.cargarEstudiante();
      } else {
        // Limpiar los datos para modo agregar
        this.isEditMode = false; // Establece que estamos en modo agregar
        this.estudianteActual = {
          carnet_estudiante: 0,
          usuario_id: 0,
          grado_id: 0,
        };
        this.carnetTemporal = ''; // Limpia el carnet temporal
        // Cargar estudiantes no registrados para modo creación
        await this.cargarEstudiantesNoRegistrados();
      }
    }

    cerrarModal() {
      this.modalAbierto = false;
    }

    async guardarEstudiante() {
      // Asigna el valor de carnetTemporal a estudianteActual antes de guardar
      this.estudianteActual.carnet_estudiante = parseInt(this.carnetTemporal, 10);
    
      try {
        if (this.isEditMode) {
          await this.estudiantesService.updateEstudiante(
            this.estudianteActual.carnet_estudiante,
            this.estudianteActual
          );
        } else {
          console.log('Creando nuevo estudiante');
          await this.estudiantesService.createEstudiante(this.estudianteActual);
        }
    
        this.cerrarModal();
        await this.cargarEstudiantes(); // Recargar la lista de estudiantes
      } catch (error: any) {
        console.error('Error al guardar el estudiante:', error);
    
        // Mensaje de error por defecto
        let mensajeError = 'Por favor, intente nuevamente más tarde';
    
        // Verifica si el error tiene la estructura esperada
        if (error && error.error && typeof error.error === 'string') {
          mensajeError = error.error; // Asigna directamente el mensaje de error
        } else if (error?.status === 'validation_failed' && error.errors) {
          mensajeError = Object.values(error.errors)
            .map((err: any) => err[0])
            .join(', ');
        }
    
        this.mostrarAlertaError(
          'Error al guardar el estudiante. ' + mensajeError
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
