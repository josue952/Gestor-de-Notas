import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router'; // Cambia Route por Router
import { NotasService } from '../services/notas.service';
import { ClasesService } from '../services/clases.service';
import { MateriasService } from '../services/materias.service';
import { EstudiantesService } from '../services/estudiantes.service';
import { UsersService } from '../services/users.service';
import { GradosService } from '../services/grados.service';

interface Grado {
  id_grado: number;
  nombre: string;
  registros: number;
}

interface Clase {
  id_clase: number;
  nombre: string;
}

interface Materia {
  id_materia: number;
  nombre: string;
}

interface Usuario {
  id_usuario: number;
  nombre_completo: string;
}

interface Estudiantes {
  estudiante_id?: number;
  carnet_estudiante: number;
  grado_id: number;
  usuario_id: number;
  usuario?: Usuario;
  grado?: Grado;
}

interface Calificacion {
  id_calificacion?: number;
  estudiante_id: number;
  clase_id: number;
  clase?: Clase;
  materia_id: number;
  materia?: Materia;
  estudiante?: Estudiantes;
  maestro_id: number;
  nota_final: number;
  fecha_asignacion: string;
}

@Component({
  selector: 'app-notas',
  templateUrl: './notas.page.html',
  styleUrls: ['./notas.page.scss'],
})
export class NotasPage implements OnInit {
  carnet_estudiante: number | null = null;

  calificaciones: Calificacion[] = [];
  modalAbierto = false;
  paginatedCalificaciones: Calificacion[] = [];
  materias: Materia[] = [];
  clases: Clase[] = [];
  estudiantes: Estudiantes[] = [];
  usuarios: Usuario[] = [];
  grados: Grado[] = [];
  clasesDisponibles = false;
  filtroClase: string = '';
  filtroMateria: string = '';
  paginaActual: number = 1;
  notasPorPagina: number = 5;
  totalPaginas: number = 0;

  calificacionActual: Calificacion = {
    estudiante_id: 0,
    clase_id: 0,
    materia_id: 0,
    maestro_id: 0,
    nota_final: 0,
    fecha_asignacion: new Date().toISOString(),
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router, // Cambia Route por Router
    private notasService: NotasService,
    private materiasService: MateriasService,
    private clasesService: ClasesService,
    private estudiantesService: EstudiantesService,
    private usersService: UsersService,
    private gradosService: GradosService,
    private modalController: ModalController,
    private alertController: AlertController
  ) {}

  calificarEstudiante(calificacion: Calificacion) {
    // Busca el grado del estudiante
    const gradoEstudiante = this.grados.find(grado => grado.id_grado === calificacion.estudiante?.grado_id);
  
    // Crea un objeto con los datos que necesitas, incluyendo el nombre y los registros del grado
    const datosEstudiante = {
      nombre: calificacion.estudiante?.usuario?.nombre_completo,
      carnet: calificacion.estudiante_id,
      clase: calificacion.clase?.nombre,
      materia: calificacion.materia?.nombre,
      grado_id: calificacion.estudiante?.grado_id,
      grado_nombre: gradoEstudiante?.nombre,
      grado_registros: gradoEstudiante?.registros,
      fecha: calificacion.fecha_asignacion,
    };
  
    // Redirige a la ruta deseada y pasa los datos como estado
    this.router.navigate(['/sub-notas', calificacion.id_calificacion], {
      state: { datosEstudiante },
    });
  }

  aplicarFiltro() {
    this.paginaActual = 1; // Resetea a la primera página al aplicar filtro
  
    const calificacionesFiltradas = this.calificaciones.filter((calificacion) => {
      const coincideClase = this.filtroClase
        ? calificacion.clase?.id_clase === Number(this.filtroClase)
        : true;
  
      const coincideMateria = this.filtroMateria
        ? calificacion.materia?.id_materia === Number(this.filtroMateria)
        : true;
  
      return coincideClase && coincideMateria;
    });
  
    this.paginatedCalificaciones = this.paginarNotas(calificacionesFiltradas);
  }

  paginarNotas(calificaciones: any[]) {
    const totalPaginas = Math.ceil(calificaciones.length / this.notasPorPagina);
    this.totalPaginas = totalPaginas;

    const inicio = (this.paginaActual - 1) * this.notasPorPagina;
    return calificaciones.slice(inicio, inicio + this.notasPorPagina);
  }

  ngOnInit() {
    this.carnet_estudiante = Number(
      this.route.snapshot.paramMap.get('carnet_estudiante')
    );
    console.log('Carnet del estudiante:', this.carnet_estudiante);
    this.cargarCalificaciones();
    this.cargarMaterias();
    this.cargarClases();
    this.cargarEstudiantes();
    this.cargarUsuarios();
    this.cargarGrados();
  }

  cambiarPagina(pagina: number) {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaActual = pagina;
    this.actualizarPaginacion();
  }

  actualizarPaginacion() {
    const inicio = (this.paginaActual - 1) * this.notasPorPagina;
    this.paginatedCalificaciones = this.calificaciones.slice(
      inicio,
      inicio + this.notasPorPagina
    );
  }

  async cargarMaterias() {
    try {
      this.materias = await this.materiasService.getMaterias();
      console.log('Materias cargadas:', this.materias);
    } catch (error) {
      console.error('Error al cargar materias:', error);
    }
  }

  async cargarClases() {
    try {
      this.clases = await this.clasesService.getClases();
      console.log('Clases cargadas:', this.clases);
    } catch (error) {
      console.error('Error al cargar clases:', error);
    }
  }

  async cargarEstudiantes() {
    try {
      this.estudiantes = await this.estudiantesService.getEstudiantes();
      console.log('Estudiantes cargados:', this.estudiantes);
    } catch (error) {
      console.error('Error al cargar estudiantes:', error);
    }
  }

  async cargarUsuarios() {
    try {
      this.usuarios = await this.usersService.getUsers();
      console.log('Usuarios cargados:', this.usuarios);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  }

  async cargarGrados() {
    try {
      this.grados = await this.gradosService.getGrados();
      console.log('Grados cargados:', this.grados);
    } catch (error) {
      console.error('Error al cargar grados:', error);
    }
  }

  async cargarGrado(id: number) {
    try {
      this.grados = await this.gradosService.getGrado(id); 
      console.log('Grado cargado:', this.grados);
    } catch (error) {
      console.error('Error al cargar grado:', error);
    }
  }

  async onMateriaChange() {
    try {
      const materiaId = this.calificacionActual.materia_id;
      if (materiaId) {
        this.clases = await this.notasService.getClasesPorMateria(materiaId);
        this.clasesDisponibles = this.clases.length > 0;
      } else {
        this.clases = [];
        this.clasesDisponibles = false;
      }
    } catch (error) {
      console.error('Error al cargar clases:', error);
      this.clasesDisponibles = false;
    }
  }

  async cargarCalificaciones() {
    try {
      if (this.carnet_estudiante) {
        this.calificaciones = await this.notasService.getNota(
          this.carnet_estudiante
        );
        console.log('Calificaciones cargadas:', this.calificaciones);
        this.actualizarPaginacion(); // Agrega esta línea
      }
    } catch (error) {
      console.error('Error al cargar calificaciones:', error);
    }
  }

  abrirModal(calificacion?: Calificacion) {
    this.modalAbierto = true;
    if (calificacion) {
      this.calificacionActual = { ...calificacion };
      if (calificacion.materia_id) {
        this.onMateriaChange();
      }
    } else {
      this.calificacionActual = {
        estudiante_id: this.carnet_estudiante || 0,
        clase_id: 0,
        materia_id: 0,
        maestro_id: 0,
        nota_final: 0,
        fecha_asignacion: new Date().toISOString(),
      };
      this.clasesDisponibles = false;
    }
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  async guardarCalificacion() {
    try {
      if (this.calificacionActual.id_calificacion) {
        await this.notasService.updateNota(
          this.calificacionActual.id_calificacion,
          this.calificacionActual
        );
      } else {
        await this.notasService.createNota(this.calificacionActual);
      }
      this.cerrarModal();
      this.cargarCalificaciones();
    } catch (error) {
      console.error('Error al guardar la calificación:', error);
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

  async eliminarCalificacion(id?: number) {
    if (id === undefined) {
      console.error('El ID de la nota no está definida');
      return; // O maneja el error de otra forma
    }

    // Mostrar alerta de confirmación
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Está seguro de que desea eliminar esta nota?',
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
              await this.notasService.deleteNota(id);
              await this.cargarCalificaciones(); // Recargar la lista de estudiantes

              // Verifica si hay estudiantes en la página actual
              if (this.calificaciones.length === 0 && this.paginaActual > 0) {
                this.paginaActual--; // Decrementa la página actual si no hay estudiantes
                await this.actualizarPaginacion; // Actualiza la paginación
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
