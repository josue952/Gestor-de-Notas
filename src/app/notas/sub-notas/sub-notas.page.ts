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
        // Asegúrate de que la respuesta contiene la estructura que esperas
        if (response && response.subnotas && Array.isArray(response.subnotas)) {
          this.subnota = response.subnotas; // Asigna el array de sub-notas al estado
          console.log('SubNotas cargadas:', this.subnota);
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
    this.modalAbierto = true;

    // Si ya existen subnotas, inicializa los inputs con esos valores
    if (subnota) {
      this.subNotaActual = { ...subnota };
      this.subNotasArray = [subnota.subnota]; // Asumiendo que `subnota.subnota` is a single number
    } else {
      this.subNotaActual = {
        id_subnota: 0,
        calificacion_id: 0,
        subnota: 0,
      };
      // Genera el array vacío basado en `registros_gradoCalificacion` (número de inputs)
      this.inputsArray = Array(this.registros_gradoCalificacion).fill(0);
      this.subNotasArray = new Array(this.registros_gradoCalificacion).fill(null);
    }
  }

  cerrarModal() {
    this.modalAbierto = false;
  }
  
  // Método para verificar que al menos un input tiene un valor
  isAtLeastOneInputFilled(): boolean {
    return this.subNotasArray.some((nota) => nota !== null && nota !== undefined && nota !== 0);
  }
  
  // Modifica el método de guardar subnota
  async guardarSubNota() {
    try {
      // Filtra los valores vacíos para enviar solo las subnotas que tienen valor
      const subnotas = this.subNotasArray.filter(nota => nota !== null && nota !== undefined && nota !== 0);
      if (this.subNotaActual.id_subnota) {
        // Llama a `updateNota` con el array de subnotas si existe `id_subnota`
        await this.subNotasService.updateNota(this.calificacion_id!, { ...this.subNotaActual, subnotas });
      } else {
        // Llama a `createSubNota` con el array de subnotas si es una nueva nota
        console.log('ID calificación:', this.calificacion_id);
        await this.subNotasService.createSubNota(this.calificacion_id!, { subnotas });
      }
      this.cerrarModal();
      this.cargarSubNotas();
    } catch (error) {
      console.error('Error al guardar la calificacion:', error);
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
        '¿Está seguro de que desea eliminar todas las sub-notas de esta calificación?',
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
  async eliminarSubNotaEspecifica(calificacionId?: number, subNotaId?: number) {
    if (calificacionId === undefined || subNotaId === undefined) {
      console.error(
        'El ID de la calificación o de la sub-nota no está definido'
      );
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Está seguro de que desea eliminar esta sub-nota?',
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
              await this.subNotasService.deleteSubNota(
                calificacionId,
                subNotaId
              );
              await this.cargarSubNotas(); // Recarga las sub-notas después de eliminar
            } catch (error) {
              console.error('Error al eliminar la sub-nota:', error);
            }
          },
        },
      ],
    });

    await alert.present();
  }
}
