import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router'; // Cambia Route por Router
import { NotasService } from '../../services/notas.service';
import { SubNotasService } from '../../services/sub-notas.service';
import { EstudiantesService } from '../../services/estudiantes.service';

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
  usuario_id: number;
  usuario?: Usuario;
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

interface SubNota {
  id_subnota: number;
  calificacion_id: number;
  subnota: number;
  calificacion?: Calificacion;
}

@Component({
  selector: 'app-sub-notas',
  templateUrl: './sub-notas.page.html',
  styleUrls: ['./sub-notas.page.scss'],
})
export class SubNotasPage implements OnInit {
  // Nueva propiedad para almacenar el array temporal de subnotas
  subNotasArray: number[] = [];
  inputsArray: number[] = []; // Controla la cantidad de inputs en el modal

  calificacion_id: number | null = null;
  nombreEstudiante: string | undefined;
  carnetEstudiante: number | undefined;
  claseCalificacion: string | undefined;
  materiaCalificacion: string | undefined;
  id_gradoCalificacion: number | undefined;
  nombre_gradoCalificacion: string | undefined;
  registros_gradoCalificacion: number | undefined;
  fechaCalificacion: string | undefined;

  subnota: SubNota[] = [];
  calificacion: Calificacion[] = [];
  estudiantes: Estudiantes[] = [];
  modalAbierto = false;
  paginatedSubNotas: SubNota[] = [];
  paginaActual: number = 1;
  subnotasPorPagina: number = 5;
  totalPaginas: number = 0;

  subNotaActual: SubNota = {
    id_subnota: 0,
    calificacion_id: 0,
    subnota: 0,
  };

  calificacionesExistentes: boolean = false; // Nueva propiedad
  notaFinal: number = 0; // Nueva propiedad para almacenar la nota final

  constructor(
    private route: ActivatedRoute,
    private router: Router, // Cambia Route por Router
    private subNotasService: SubNotasService,
    private notasService: NotasService,
    private estudiantesService: EstudiantesService,
    private modalController: ModalController,
    private alertController: AlertController
  ) {}

  aplicarFiltro() {
    this.paginaActual = 1; // Resetea a la primera página al aplicar filtro

    const subNotasFiltradas = this.subnota.filter((subnota) => {
      // Filtros
    });

    this.paginatedSubNotas = this.paginarSubNotas(subNotasFiltradas);
  }

  paginarSubNotas(calificaciones: any[]) {
    const totalPaginas = Math.ceil(
      calificaciones.length / this.subnotasPorPagina
    );
    this.totalPaginas = totalPaginas;

    const inicio = (this.paginaActual - 1) * this.subnotasPorPagina;
    return calificaciones.slice(inicio, inicio + this.subnotasPorPagina);
  }

  ngOnInit() {
    this.calificacion_id = Number(
      this.route.snapshot.paramMap.get('id_calificacion')
    );

    // Accede a los datos enviados
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      const datosEstudiante = navigation.extras.state['datosEstudiante'];
      console.log('Datos del estudiante:', datosEstudiante);

      // Asigna los datos del estudiante a las propiedades
      this.nombreEstudiante = datosEstudiante?.nombre;
      this.carnetEstudiante = datosEstudiante?.carnet;
      this.claseCalificacion = datosEstudiante?.clase;
      this.materiaCalificacion = datosEstudiante?.materia;
      this.id_gradoCalificacion = datosEstudiante?.grado_id;
      this.nombre_gradoCalificacion = datosEstudiante?.grado_nombre;
      this.registros_gradoCalificacion = datosEstudiante?.grado_registros;
      this.fechaCalificacion = datosEstudiante?.fecha;
    }

    console.log('ID de la calificación:', this.calificacion_id);
    console.log('ID del grado:', this.id_gradoCalificacion);
    console.log('Nombre del grado:', this.nombre_gradoCalificacion);
    console.log('Registros del grado:', this.registros_gradoCalificacion);
    this.cargarSubNotas();
    this.cargarCalificacion(this.calificacion_id!);
  }

  cambiarPagina(pagina: number) {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaActual = pagina;
    this.actualizarPaginacion();
  }

  actualizarPaginacion() {
    const inicio = (this.paginaActual - 1) * this.subnotasPorPagina;
    this.paginatedSubNotas = this.subnota.slice(
      inicio,
      inicio + this.subnotasPorPagina
    );
  }

  async cargarSubNotas() {
    try {
      if (this.calificacion_id) {
        const response = await this.subNotasService.getSubNotas(
          this.calificacion_id
        );
        if (response && response.subnotas && Array.isArray(response.subnotas)) {
          this.subnota = response.subnotas; // Asigna el array de sub-notas al estado
          console.log('SubNotas cargadas:', this.subnota);

          // Actualiza la propiedad que verifica si hay calificaciones existentes
          this.calificacionesExistentes = this.subnota.length > 0; // Establece en true si hay al menos una calificación

          // Calcular la nota final
          this.notaFinal = this.calcularNotaFinal(); // Agrega esta línea
        } else {
          console.error('getSubNotas no retornó un array válido:', response);
        }
        this.actualizarPaginacion(); // Actualiza la paginación
      }
    } catch (error) {
      console.error('Error al cargar SubNotas:', error);
    }
  }

  async cargarCalificacion(id: number) {
    try {
      const calificacionActual = await this.notasService.getNotas(id);
      console.log('Calificación cargada:', calificacionActual);
    } catch (error) {
      console.error('Error al cargar la calificación:', error);
    }
  }

  abrirModal(subnota?: SubNota) {
    // Siempre permite abrir el modal para editar
    this.modalAbierto = true;

    if (subnota) {
      // Cargar datos de la subnota seleccionada
      this.subNotaActual = { ...subnota };
      this.subNotasArray = this.subnota.map((sn) => sn.subnota); // Cargar las subnotas en el array directamente
      this.inputsArray = Array(this.registros_gradoCalificacion).fill(0); // Asegúrate de que los inputs estén preparados
    } else {
      // Inicializa el modal para agregar nueva nota
      if (!this.calificacionesExistentes) {
        // Solo inicializa si no existen calificaciones
        this.subNotaActual = { id_subnota: 0, calificacion_id: 0, subnota: 0 };
        this.inputsArray = Array(this.registros_gradoCalificacion).fill(0);
        this.subNotasArray = new Array(this.registros_gradoCalificacion).fill(
          null
        );
      } else {
        // Si hay calificaciones, puedes deshabilitar la adición pero permitir la edición
        this.subNotaActual = { id_subnota: 0, calificacion_id: 0, subnota: 0 };
      }
    }
  }

  abrirEditarModal() {
    this.modalAbierto = true;
  
    // Si hay subnotas existentes, carga las subnotas en el modal para editarlas
    if (this.calificacionesExistentes) {
      this.subNotasArray = this.subnota.map((sn) => sn.subnota); // Cargar todas las subnotas en el array para edición
      this.inputsArray = Array(this.registros_gradoCalificacion).fill(0); // Prepara los inputs
    } else {
      // Si no hay subnotas, inicializa el modal como vacío
      this.subNotaActual = { id_subnota: 0, calificacion_id: 0, subnota: 0 };
      this.inputsArray = Array(this.registros_gradoCalificacion).fill(0);
      this.subNotasArray = new Array(this.registros_gradoCalificacion).fill(null);
    }
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  calcularNotaFinal(): number {
    const totalSubNotas = this.subnota.reduce((sum, subNota) => sum + subNota.subnota, 0);
    const cantidadSubNotas = this.subnota.length;
  
    return cantidadSubNotas > 0 ? totalSubNotas / this.registros_gradoCalificacion! : 0; // Retorna 0 si no hay subnotas
  }

  // Método para verificar que al menos un input tiene un valor
  isAtLeastOneInputFilled(): boolean {
    return this.subNotasArray.some(
      (nota) => nota !== null && nota !== undefined && nota !== 0
    );
  }

  async guardarSubNota() {
    try {
      // Convierte todas las notas a float
      const notasAEnviar = this.subNotasArray.map((nota) => {
        if (typeof nota === 'string') {
          const parsedNota = parseFloat(nota);
          return isNaN(parsedNota) ? null : parsedNota; // Maneja el caso donde la conversión falla
        } else if (typeof nota === 'number') {
          return nota; // Ya es un número, no necesita conversión
        } else {
          return null; // Si no es ni string ni number
        }
      });

      // Filtra notas nulas o no válidas
      const validNotas = notasAEnviar.filter((nota) => nota !== null);

      // Aquí ya tienes el arreglo validNotas que quieres enviar.
      if (this.subNotaActual.id_subnota) {
        // Actualizar solo la subnota correspondiente
        // Supongo que el ID está en subNotaActual y que quieres actualizar
        const indexToUpdate = this.subNotaActual.id_subnota - 1; // Ajusta el índice según cómo estés manejando IDs

        // Actualiza solo la nota que se está editando
        if (indexToUpdate >= 0 && indexToUpdate < validNotas.length) {
          validNotas[indexToUpdate] = this.subNotaActual.subnota; // Actualiza solo la nota que se está editando
        }
      }

      // Envía las notas en el formato correcto
      await this.subNotasService.updateNota(this.calificacion_id!, {
        subnotas: validNotas, // Enviar el formato correcto
      });

      this.cerrarModal();
      this.cargarSubNotas();
    } catch (error) {
      console.error('Error al guardar la calificación:', error);
      console.log('Nota a guardar:', this.subNotasArray);

      // Mensaje de error por defecto
      let mensajeError = 'Por favor, intente nuevamente más tarde';

      // Verifica si el error tiene la estructura esperada
      if (error && error && typeof error === 'string') {
        mensajeError = error; // Asigna directamente el mensaje de error
      } else if (error === 'validation_failed' && error) {
        mensajeError = Object.values(error)
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

  // Método para eliminar todas las sub-notas de una calificación
  async eliminarTodasSubNotas(calificacionId?: number) {
    if (calificacionId === undefined) {
      console.error('El ID de la calificación no está definido');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmación',
      message:
        '¿Está seguro de que desea eliminar todas las notas de esta calificación?',
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
              await this.subNotasService.deleteSubNotas(calificacionId);
              await this.cargarSubNotas(); // Recarga las sub-notas después de eliminar
            } catch (error) {
              console.error('Error al eliminar todas las sub-notas:', error);
            }
          },
        },
      ],
    });

    await alert.present();
  }

  // Método para eliminar una sub-nota específica de una calificación
  async eliminarSubNotaEspecifica(subNotaId?: number) {
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
              // Llama al servicio para eliminar la sub-nota
              await this.subNotasService.deleteSubNota(
                subNotaId!,
                this.calificacion_id!
              );

              console.log('Sub-nota eliminada:', subNotaId);
              console.log('Calificación actual:', this.calificacion_id);
              await this.cargarSubNotas(); // Recarga las sub-notas después de eliminar
            } catch (error) {
              console.error('Error al eliminar la sub-nota:', error);
              this.mostrarAlertaError(
                'No se pudo eliminar la sub-nota. Intente nuevamente.'
              );
            }
          },
        },
      ],
    });

    await alert.present();
  }
}
