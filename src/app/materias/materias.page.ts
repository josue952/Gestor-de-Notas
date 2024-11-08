import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { MateriasService } from '../services/materias.service';

interface Materias {
  id_materia?: number;
  nombre: string;
  objetivo: string;
}

@Component({
  selector: 'app-materias',
  templateUrl: './materias.page.html',
  styleUrls: ['./materias.page.scss'],
})
export class MateriasPage implements OnInit {
  materias: Materias[] = [];
  paginatedMaterias: Materias[] = [];
  modalAbierto = false;
  filtroTexto: string = '';
  filtroMateria: string = '';
  materiaActual: Materias = {
    id_materia: 0,
    nombre: '',
    objetivo: '',
  };

  paginaActual: number = 1;
  materiasPorPagina: number = 5;
  totalPaginas: number = 0;

  constructor(
    private materiasService: MateriasService,
    private modalController: ModalController,
    private alertController: AlertController
  ) {
    this.aplicarFiltro();
  }

  aplicarFiltro() {
    this.paginaActual = 1; // Resetea a la primera página al aplicar filtro
    
    const materiasFiltrados = this.materias.filter((materia) => {
      const coincideNombre = materia.nombre.toLowerCase().includes(this.filtroTexto.toLowerCase());
      const coincideFiltroMateria = !this.filtroMateria || materia.id_materia === +this.filtroMateria; 
  
      return (coincideNombre) && coincideFiltroMateria;
    });
  
    this.paginatedMaterias = this.paginarMaterias(materiasFiltrados);
  }

  paginarMaterias(materias: any[]) {
    const totalPaginas = Math.ceil(materias.length / this.materiasPorPagina);
    this.totalPaginas = totalPaginas;

    const inicio = (this.paginaActual - 1) * this.materiasPorPagina;
    return materias.slice(inicio, inicio + this.materiasPorPagina);
  }

  ngOnInit(): void {
    this.cargarMaterias();
    this.cerrarModal();
  }

  async cargarMaterias() {
    try {
      this.materias = await this.materiasService.getMaterias();
      console.log('Materias cargadas:', this.materias);
      this.totalPaginas = Math.ceil(this.materias.length / this.materiasPorPagina);
      this.actualizarPaginacion();
    } catch (error) {
      console.error('Error al cargar materias:', error);
      this.mostrarAlertaError('Error al cargar materias. Inténtelo de nuevo más tarde.');
    }
  }

  actualizarPaginacion() {
    const inicio = (this.paginaActual - 1) * this.materiasPorPagina;
    this.paginatedMaterias = this.materias.slice(inicio, inicio + this.materiasPorPagina);
  }

  cambiarPagina(pagina: number) {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaActual = pagina;
    this.actualizarPaginacion();
  }

  abrirModal(materia?: Materias) {
    this.modalAbierto = true;
    if (materia) {
      this.materiaActual = materia;
    } else {
      this.materiaActual = {
        id_materia: 0,
        nombre: '',
        objetivo: '',
      };
    }
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  async guardarMateria() {
    console.log('Materia guardada:', this.materiaActual);
    try {
  
      if (this.materiaActual.id_materia) {
        await this.materiasService.updateMateria(this.materiaActual.id_materia, this.materiaActual);
      } else {
        await this.materiasService.createMateria(this.materiaActual);
      }
  
      this.cerrarModal();
      await this.cargarMaterias(); // Asegúrate de recargar la lista de materias
    } catch (error: any) {
      console.error('Error al procesar la materia:', error);
      let mensajeError = 'Por favor, revise los datos e intente nuevamente.';
  
      if (error?.status === 'validation_failed' && error.errors) {
        mensajeError = Object.values(error.errors).map((err: any) => err[0]).join(', ');
      }
  
      this.mostrarAlertaError('Error al procesar la materia. ' + mensajeError);
    }
  }

  async mostrarAlertaError(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  async eliminarMateria(id?: number) {
    if (id === undefined) {
      console.error('El ID de la materia no está definido');
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
          }
        },
        {
          text: 'Eliminar',
          handler: async () => {
            try {
              await this.materiasService.deleteMateria(id);
              await this.cargarMaterias(); // Recargar la lista de materias
  
              // Verifica si hay materias en la página actual
              if (this.paginatedMaterias.length === 0 && this.paginaActual > 1) {
                this.paginaActual--; // Decrementa la página actual si no hay materias
                await this.actualizarPaginacion(); // Actualiza la paginación
              }
            } catch (error) {
              console.error('Error al eliminar grado:', error);
            }
          }
        }
      ]
    });
  
    await alert.present();
  }
}
