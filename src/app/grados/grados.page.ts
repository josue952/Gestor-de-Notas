import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { GradosService } from '../services/grados.service';

interface Grados {
  id_grado?: number;
  nombre: string;
  descripcion: string;
  registros: number;
}

@Component({
  selector: 'app-grados',
  templateUrl: './grados.page.html',
  styleUrls: ['./grados.page.scss'],
})
export class GradosPage implements OnInit {
  grados: Grados[] = [];
  paginatedGrados: Grados[] = [];
  modalAbierto = false;
  filtroTexto: string = '';
  filtroRegistro: string = '';
  gradoActual: Grados = {
    id_grado: 0,
    nombre: "",
    descripcion: "",
    registros: 0
  };

  paginaActual: number = 1;
  gradosPorPagina: number = 5;
  totalPaginas: number = 0;

  constructor(
    private gradosService: GradosService,
    private modalController: ModalController,
    private alertController: AlertController,
  ) {this.aplicarFiltro();}

  aplicarFiltro() {
    this.paginaActual = 1; // Resetea a la primera página al aplicar filtro
    const gradosFiltrados = this.grados.filter(grado => {
      const coincideNombre = grado.nombre.toLowerCase().includes(this.filtroTexto.toLowerCase());
      const coincideDescripcion = grado.descripcion.toLowerCase().includes(this.filtroTexto.toLowerCase());
      const coincideRegistros = this.filtroRegistro ? grado.registros === +this.filtroRegistro : true;
  
      return (coincideNombre || coincideDescripcion) && coincideRegistros;
    });
  
    this.paginatedGrados = this.paginarGrados(gradosFiltrados);
  }

  paginarGrados(grados: any[]) {
    const totalPaginas = Math.ceil(grados.length / this.gradosPorPagina);
    this.totalPaginas = totalPaginas;

    const inicio = (this.paginaActual - 1) * this.gradosPorPagina;
    return grados.slice(inicio, inicio + this.gradosPorPagina);
  }

  ngOnInit(): void {
    this.cargarGrados();
    this.cerrarModal();
  }

  async cargarGrados() {
    try {
      this.grados = await this.gradosService.getGrados();
      console.log('Grados cargados:', this.grados);
      this.totalPaginas = Math.ceil(this.grados.length / this.gradosPorPagina);
      this.actualizarPaginacion();
    } catch (error) {
      console.error('Error al cargar grados:', error);
      this.mostrarAlertaError('Error al cargar grados. Inténtelo de nuevo más tarde.');
    }
  }

  actualizarPaginacion() {
    const inicio = (this.paginaActual - 1) * this.gradosPorPagina;
    this.paginatedGrados = this.grados.slice(inicio, inicio + this.gradosPorPagina);
  }

  cambiarPagina(pagina: number) {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaActual = pagina;
    this.actualizarPaginacion();
  }

  abrirModal(grado?: Grados) {
    this.modalAbierto = true;
    if (grado) {
      this.gradoActual = grado;
    } else {
      this.gradoActual = {
        id_grado: 0,
        nombre: "",
        descripcion: "",
        registros: 0
      };
    }
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  async guardarGrado() {
    console.log('Grado guardado:', this.gradoActual);
    try {
      if (this.gradoActual.id_grado) {
        await this.gradosService.updateGrado(this.gradoActual.id_grado, this.gradoActual);
      } else {
        await this.gradosService.createGrado(this.gradoActual);
      }


      this.cerrarModal();
      await this.cargarGrados(); // Asegúrate de recargar la lista de grados
    } catch (error: any) {
      console.error('Error al procesar el grado:', error);
      let mensajeError = 'Por favor, revise los datos e intente nuevamente.';

      if (error?.status === 'validation_failed' && error.errors) {
        mensajeError = Object.values(error.errors).map((err: any) => err[0]).join(', ');
      }

      this.mostrarAlertaError('Error al procesar el grado. ' + mensajeError);
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

  async eliminarGrado(id?: number) {
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
          }
        },
        {
          text: 'Eliminar',
          handler: async () => {
            try {
              await this.gradosService.deleteGrado(id);
              await this.cargarGrados(); // Recargar la lista de grados
  
              // Verifica si hay grados en la página actual
              if (this.paginatedGrados.length === 0 && this.paginaActual > 1) {
                this.paginaActual--; // Decrementa la página actual si no hay grados
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
