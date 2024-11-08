import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { ClasesService } from '../services/clases.service';
import { UsersService } from '../services/users.service';
import { GradosService } from '../services/grados.service';
import { MateriasService } from '../services/materias.service';
import { SeccionesService } from '../services/secciones.service';

interface Maestro {
  id_usuario: number;
  nombre_completo: string;
}

interface Grado {
  id_grado: number;
  nombre: string;
}

interface Materia{
  id_materia: number;
  nombre: string;
}

interface Seccion{
  id_seccion: number;
  seccion: string;
}

interface Clases {
  id_clase?: number;
  nombre: string;
  descripcion: string;
  maestro_id?: number; 
  grado_id?: number; 
  materia_id?: number;
  seccion_id?: number;
  maestro?: Maestro;
  grado?: Grado;
  materia?: Materia;
  seccion?: Seccion;
}

@Component({
  selector: 'app-clases',
  templateUrl: './clases.page.html',
  styleUrls: ['./clases.page.scss'],
})
export class ClasesPage implements OnInit {
  clases: Clases[] = [];
  paginatedClases: Clases[] = [];
  maestros: any[] = []; 
  grados: any[] = [];
  materias: any[] = []; 
  secciones: any[] = [];
  modalAbierto = false;
  filtroTexto: string = '';
  filtroGrado: string = '';
  claseActual: Clases = {
    id_clase: 0,
    nombre: '',
    descripcion: '',
    maestro_id: 0,
    grado_id: 0,
    seccion_id: 0,
    materia_id: 0,
  };

  paginaActual: number = 1;
  clasesPorPagina: number = 5;
  totalPaginas: number = 0;

  constructor(
    private clasesService: ClasesService,
    private UsersService: UsersService,
    private gradosService: GradosService,
    private materiasService: MateriasService,
    private seccionesService: SeccionesService,
    private modalController: ModalController,
    private alertController: AlertController
  ) {
    this.aplicarFiltro();
  }

  aplicarFiltro() {
    this.paginaActual = 1; // Resetea a la primera página al aplicar filtro
    const clasesFiltrados = this.clases.filter((clase) => {
      const coincideNombre = clase.nombre.toLowerCase().includes(this.filtroTexto.toLowerCase());
      const coincideDescripcion = clase.descripcion.toLowerCase().includes(this.filtroTexto.toLowerCase());
      const coincideGrado = this.filtroGrado ? clase.grado_id === +this.filtroGrado : true;
  
      return (coincideNombre || coincideDescripcion) && coincideGrado;
    });
  
    this.paginatedClases = this.paginarClases(clasesFiltrados);
  }

  paginarClases(clases: any[]) {
    const totalPaginas = Math.ceil(clases.length / this.clasesPorPagina);
    this.totalPaginas = totalPaginas;

    const inicio = (this.paginaActual - 1) * this.clasesPorPagina;
    return clases.slice(inicio, inicio + this.clasesPorPagina);
  }

  ngOnInit(): void {
    this.cargarClases();
    this.cargarMaestros();
    this.cargarGrados();
    this.cargarMaterias();
    this.cargarSecciones();
    this.cerrarModal();
  }

  async cargarClases() {
    try {
      this.clases = await this.clasesService.getClases();
      console.log('Clases cargados:', this.clases);
      this.totalPaginas = Math.ceil(this.clases.length / this.clasesPorPagina);
      this.actualizarPaginacion();
    } catch (error) {
      console.error('Error al cargar clases:', error);
      this.mostrarAlertaError('Error al cargar clases. Inténtelo de nuevo más tarde.');
    }
  }

  //cargar a todos los maestros
  async cargarMaestros() {
    try {
      const usuarios = await this.UsersService.getUsers();
      this.maestros = usuarios.filter((usuario: any) => usuario.rol === 'Maestro');
    } catch (error) {
      console.error('Error al cargar maestros:', error);
    }
  }

  //Cargar a un maestro
  async cargarMaestro(id: number) {
    try {
      const maestro = await this.UsersService.getUser(id);
      return maestro;
    } catch (error) {
      console.error('Error al cargar maestro:', error);
    }
  }

  //cargar a todos los grados
  async cargarGrados() {
    try {
      this.grados = await this.gradosService.getGrados();
    } catch (error) {
      console.error('Error al cargar grados:', error);
    }
  }

  //Cargar un grado
  async cargarGrado(id: number) {
    try {
      const grado = await this.gradosService.getGrado(id);
      return grado;
    } catch (error) {
      console.error('Error al cargar grado:', error);
    }
  }

  //cargar a todas las materias
  async cargarMaterias() {
    try {
      this.materias = await this.materiasService.getMaterias();
    } catch (error) {
      console.error('Error al cargar materias:', error);
    }
  }

  //Cargar todas las secciones
  async cargarSecciones() {
    try {
      this.secciones = await this.seccionesService.getSecciones();
    } catch (error) {
      console.error('Error al cargar secciones:', error);
    }
  }

  actualizarPaginacion() {
    const inicio = (this.paginaActual - 1) * this.clasesPorPagina;
    this.paginatedClases = this.clases.slice(inicio, inicio + this.clasesPorPagina);
  }

  cambiarPagina(pagina: number) {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaActual = pagina;
    this.actualizarPaginacion();
  }

  abrirModal(clase?: Clases) {
    this.modalAbierto = true;
    if (clase) {
      this.claseActual = clase;
    } else {
      this.claseActual = {
        id_clase: 0,
        nombre: '',
        descripcion: '',
        maestro_id: 0,
        grado_id: 0,
        seccion_id: 0,
        materia_id: 0,
      };
    }
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  async guardarClase() {
    console.log('Clase guardada:', this.claseActual);
    try {
      // Validar que los IDs sean números
      this.claseActual.maestro_id = Number(this.claseActual.maestro_id);
      this.claseActual.grado_id = Number(this.claseActual.grado_id);
  
      if (this.claseActual.id_clase) {
        await this.clasesService.updateClase(this.claseActual.id_clase, this.claseActual);
      } else {
        await this.clasesService.createClase(this.claseActual);
      }
  
      this.cerrarModal();
      await this.cargarClases(); // Asegúrate de recargar la lista de clases
    } catch (error: any) {
      console.error('Error al procesar la clase:', error);
      let mensajeError = 'Por favor, revise los datos e intente nuevamente.';
  
      if (error?.status === 'validation_failed' && error.errors) {
        mensajeError = Object.values(error.errors).map((err: any) => err[0]).join(', ');
      }
  
      this.mostrarAlertaError('Error al procesar la clase. ' + mensajeError);
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

  async eliminarClase(id?: number) {
    if (id === undefined) {
      console.error('El ID de la clase no está definido');
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
              await this.clasesService.deleteClase(id);
              await this.cargarClases(); // Recargar la lista de clases
  
              // Verifica si hay clases en la página actual
              if (this.paginatedClases.length === 0 && this.paginaActual > 1) {
                this.paginaActual--; // Decrementa la página actual si no hay clases
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
