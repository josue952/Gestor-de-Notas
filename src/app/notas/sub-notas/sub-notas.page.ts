import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { NotasService } from '../../services/notas.service';
import { SubNotasService } from '../../services/sub-notas.service';
import { ClasesService } from '../../services/clases.service';
import { MateriasService } from '../../services/materias.service';
import { EstudiantesService } from '../../services/estudiantes.service';
import { UsersService } from '../../services/users.service';

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
  calificacion_id: number | null = null;

  subnota: SubNota[] = [];
  calificacion: Calificacion[] = [];
  materias: Materia[] = [];
  clases: Clase[] = [];
  estudiantes: Estudiantes[] = [];
  usuarios: Usuario[] = [];
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
    private subNotasService: SubNotasService,
    private notasService: NotasService,
    private materiasService: MateriasService,
    private clasesService: ClasesService,
    private estudiantesService: EstudiantesService,
    private usersService: UsersService,
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
    ); // Asegúrate de usar 'id_calificacion'
    console.log('ID de la calificación:', this.calificacion_id);
    this.cargarSubNotas(this.calificacion_id!);
    this.cargarMaterias();
    this.cargarClases();
    this.cargarEstudiantes();
    this.cargarUsuarios();
    this.cargarCalificacion(this.calificacion_id!);
  }

  async cargarMaterias() {
    try {
      this.materias = await this.materiasService.getMaterias(); // Método para obtener materias
      console.log('Materias cargadas:', this.materias);
    } catch (error) {
      console.error('Error al cargar materias:', error);
    }
  }

  async cargarClases() {
    try {
      this.clases = await this.clasesService.getClases(); // Método para obtener materias
      console.log('Clases cargadas:', this.clases);
    } catch (error) {
      console.error('Error al cargar clases:', error);
    }
  }

  async cargarEstudiantes() {
    try {
      this.estudiantes = await this.estudiantesService.getEstudiantes(); // Método para obtener materias
      console.log('Estudiantes cargados:', this.estudiantes);
    } catch (error) {
      console.error('Error al cargar estudiantes:', error);
    }
  }

  async cargarUsuarios() {
    try {
      this.usuarios = await this.usersService.getUsers(); // Método para obtener materias
      console.log('Usuarios cargados:', this.usuarios);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
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

  async cargarSubNotas(calificacionId: number) {
    try {
      this.subnota = await this.subNotasService.getSubNotas(calificacionId);
      console.log('Subnotas cargadas:', this.subnota);
      
      // Asegúrate de paginar después de cargar
      this.paginatedSubNotas = this.paginarSubNotas(this.subnota);
    } catch (error) {
      console.error('Error al cargar subnotas:', error);
    }
  }

  async cargarCalificacion(id: number) {
    try {
      this.calificacion = await this.notasService.getNotas(id);
      console.log('Calificacion cargada:', this.calificacion);
    } catch (error) {
      console.error('Error al cargar la califiacion:', error);
    }
  }

  abrirModal(subnota?: SubNota) {
    this.modalAbierto = true;
    if (subnota) {
      this.subNotaActual = { ...subnota };
    } else {
      this.subNotaActual = {
        id_subnota: 0,
        calificacion_id: 0,
        subnota: 0,
      };
    }
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  async guardarSubNota() {
    try {
      if (this.subNotaActual.id_subnota) {
        // Llama a `updateNota` cuando existe `id_subnota` para actualizar la sub-nota
        await this.subNotasService.updateNota(
          this.calificacion_id!,
          this.subNotaActual
        );
      } else {
        // Llama a `createSubNota` para crear una nueva sub-nota si `id_subnota` no existe
        await this.subNotasService.createSubNota(
          this.calificacion_id!,
          this.subNotaActual
        );
      }
      this.cerrarModal();
      this.cargarSubNotas(this.calificacion_id!);
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
              await this.cargarSubNotas(calificacionId); // Recarga las sub-notas después de eliminar
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
              await this.cargarSubNotas(calificacionId); // Recarga las sub-notas después de eliminar
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
