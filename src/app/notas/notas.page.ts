import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NotasService } from '../services/notas.service';

// Interfaces para las entidades relacionadas
interface Clase {
  id_clase: number;
  nombre: string;
}

// Interfaces para las entidades relacionadas
interface Materia {
  id_materia: number;
  nombre: string;
}

interface Calificacion {
  id_calificacion?: number;
  estudiante_id: number;
  clase_id: number;
  clase?: Clase; // Añade la clase como objeto
  materia_id: number;
  materia?: Materia; // Añade la materia como objeto
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
  
  calificaciones: Calificacion[] = [];
  modalAbierto = false;
  calificacionActual: Calificacion = {
    estudiante_id: 0,
    clase_id: 0,
    materia_id: 0,
    maestro_id: 0,
    nota_final: 0,
    fecha_asignacion: new Date().toISOString(),
  };

  constructor(
    private notasService: NotasService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.cargarCalificaciones();
    this.cerrarModal();
  }

  async cargarCalificaciones() {
    try {
      this.calificaciones = await this.notasService.obtenerCalificacionPorId(2); // Este método debe devolver un array
      console.log('Calificaciones cargadas:', this.calificaciones);
    } catch (error) {
      console.error('Error al cargar calificaciones:', error);
    }
  }

  abrirModal(calificacion?: Calificacion) {
    this.modalAbierto = true;
    if (calificacion) {
      // Carga los datos de la calificación seleccionada
      this.calificacionActual = { ...calificacion };
    } else {
      // Limpia el formulario para agregar una nueva calificación
      this.calificacionActual = {
        estudiante_id: 0,
        clase_id: 0,
        materia_id: 0,
        maestro_id: 0,
        nota_final: 0,
        fecha_asignacion: new Date().toISOString(),
      };
    }
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  async guardarCalificacion() {
    try {
      if (this.calificacionActual.id_calificacion) {
        await this.notasService.actualizarCalificacion(
          this.calificacionActual.id_calificacion,
          this.calificacionActual
        );
      } else {
        await this.notasService.crearCalificacion(this.calificacionActual);
      }
      this.cerrarModal();
      this.cargarCalificaciones();
    } catch (error) {
      console.error('Error al guardar la calificación:', error);
    }
  }

  async eliminarCalificacion(id?: number) {
    if (id === undefined) {
      console.error('El ID de la calificación no está definido');
      return; // O maneja el error de otra forma
    }
    try {
      await this.notasService.eliminarCalificacion(id);
      this.cargarCalificaciones();
    } catch (error) {
      console.error('Error al eliminar la calificación:', error);
    }
  }
}
