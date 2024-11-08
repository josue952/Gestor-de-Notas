import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { GradosMateriasService } from '../../services/grados-materias.service';
import { GradosService } from 'src/app/services/grados.service';
import { MateriasService } from 'src/app/services/materias.service';

interface Grados {
  id_grado?: number;
  nombre: string;
}

interface Materias {
  id_materia?: number;
  nombre: string;
}

interface GradoMateria {
  id_grado?: number;
  id_materia?: number;
  grado?: Grados;
  materia?: Materias;
}

@Component({
  selector: 'app-grados-materia',
  templateUrl: './grados-materia.page.html',
  styleUrls: ['./grados-materia.page.scss'],
})
export class GradosMateriaPage implements OnInit {
  id_grado: string | null = null;

  materias: Materias[] = [];
  gradosMaterias: GradoMateria[] = [];
  paginatedGradosMaterias: GradoMateria[] = [];
  modalAbierto = false;
  gradoMateriaActual: GradoMateria = {
    id_grado: 0,
    id_materia: 0,
    grado: { nombre: '' },
    materia: { nombre: '' },
  };

  paginaActual: number = 1;
  gradosPorPagina: number = 5;
  totalPaginas: number = 0;

  constructor(
    private route: ActivatedRoute,
    private gradosMateriaService: GradosMateriasService,
    private gradosService: GradosService,
    private materiasService: MateriasService,
    private modalController: ModalController,
    private alertController: AlertController
  ) {}

  paginarGradosMaterias(gradosMaterias: any[]) {
    const totalPaginas = Math.ceil(
      gradosMaterias.length / this.gradosPorPagina
    );
    this.totalPaginas = totalPaginas;

    const inicio = (this.paginaActual - 1) * this.gradosPorPagina;
    return gradosMaterias.slice(inicio, inicio + this.gradosPorPagina);
  }

  ngOnInit() {
    // Captura el ID del grado desde la URL
    this.id_grado = this.route.snapshot.paramMap.get('id_grado');
    console.log('ID del Grado:', this.id_grado);
  
    // Asegúrate de que id_grado no sea null antes de pasarlo como argumento
    if (this.id_grado) {
      this.cargarGradosMateria(); // Cambia esto
    }
  
    this.cerrarModal();
  }

  // Método para cargar todos los grados
  async cargarGradosMaterias() {
    try {
      this.gradosMaterias = await this.gradosMateriaService.getGradoMaterias(
        +this.id_grado!
    );
      console.log('Grados Materias:', this.gradosMaterias);
      this.totalPaginas = Math.ceil(
        this.gradosMaterias.length / this.gradosPorPagina
      );
      this.actualizarPaginacion();
    } catch (error) {
      console.error('Error al cargar grados:', error);
      this.mostrarAlertaError(
        'No hay datos para mostrar. Inténtelo de nuevo más tarde.'
      );
    }
  }

  // Método para cargar todos los grados
  async cargarGradosMateria() {
    try {
      this.gradosMaterias = await this.gradosMateriaService.getGradoMateria(
        +this.id_grado!
    );
      console.log('Grados Materia:', this.gradosMaterias);
      this.totalPaginas = Math.ceil(
        this.gradosMaterias.length / this.gradosPorPagina
      );
      this.actualizarPaginacion();
    } catch (error) {
      console.error('Error al cargar grados:', error);
      this.mostrarAlertaError(
        'No hay datos para mostrar. Inténtelo de nuevo más tarde.'
      );
    }
  }
  

  actualizarPaginacion() {
    const inicio = (this.paginaActual - 1) * this.gradosPorPagina;
    this.paginatedGradosMaterias = this.gradosMaterias.slice(
      inicio,
      inicio + this.gradosPorPagina
    );
  }

  cambiarPagina(pagina: number) {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaActual = pagina;
    this.actualizarPaginacion();
  }

  abrirModal(gradoMateria?: GradoMateria) {
    this.modalAbierto = true;
    if (gradoMateria) {
      // Si existe gradoMateria, asigna el grado actual para edición
      this.gradoMateriaActual = gradoMateria;
    } else {
      // Preselecciona el grado actual y permite la edición solo del campo "materia"
      this.gradoMateriaActual = {
        id_grado: +this.id_grado!,
        grado: { nombre: '' },
        materia: { nombre: '' },
      };
      // Carga el nombre del grado actual
      this.cargarNombreDelGrado(+this.id_grado!);
    }
    // Carga todas las materias al abrir el modal
    this.cargarMaterias();
  }

  // Método para cargar el nombre del grado
  async cargarNombreDelGrado(id: number) {
    try {
      const grado = await this.gradosService.getGrado(id); // Asegúrate de tener un método en el servicio que obtenga un grado por ID
      this.gradoMateriaActual.grado = grado; // Asigna el grado al objeto actual
    } catch (error) {
      console.error('Error al cargar el nombre del grado:', error);
    }
  }

  //cargar todas las materias
  async cargarMaterias() {
    try {
      this.materias = await this.materiasService.getMaterias();
      console.log('Materias cargadas:', this.materias);
    } catch (error) {
      console.error('Error al cargar materias:', error);
    }
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  async guardarGradoMateria() {
    console.log('Grado-Materia guardado:', this.gradoMateriaActual);
    try {
      // Solo se puede crear un GradoMateria, no actualizar
      const response = await this.gradosMateriaService.createGradoMateria(
        +this.id_grado!,
        this.gradoMateriaActual
      );

      this.cerrarModal();
      await this.cargarGradosMateria();
    } catch (error: any) {
      console.error('Error al procesar la materia en el grado:', error);

      // Cambia aquí para manejar el mensaje de error correcto
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
        'Error al procesar la materia en el grado. ' + mensajeError
      );
    }

    console.log('Grado-Materia guardado:', this.gradoMateriaActual);
  }

  async mostrarAlertaError(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async eliminarGradoMateria(id?: number) {
    if (id === undefined) {
      console.error('El ID del grado no está definido');
      return; // O maneja el error de otra forma
    }

    // Mostrar alerta de confirmación
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Está seguro de que desea eliminar este grado?',
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
              await this.gradosMateriaService.deleteGradoMaterias(
                +this.id_grado!,
                id
              );
              await this.cargarGradosMaterias(); // Recarga la lista de grados

              // Verifica si hay grados en la página actual
              if (
                this.paginatedGradosMaterias.length === 0 &&
                this.paginaActual > 1
              ) {
                this.paginaActual--; // Decrementa la página actual si no hay grados
                await this.actualizarPaginacion(); // Actualiza la paginación
              }
            } catch (error) {
              console.error('Error al eliminar GradoMateria:', error);
            }
          },
        },
      ],
    });

    await alert.present();
  }
}
