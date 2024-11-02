  import { Component, OnInit } from '@angular/core';
  import { ModalController } from '@ionic/angular';
  import { ActivatedRoute } from '@angular/router';
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
    carnet_estudiante: number | null = null;

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
      private route: ActivatedRoute,
      private notasService: NotasService,
      private modalController: ModalController
    ) {}
    
    ngOnInit() {
      this.carnet_estudiante = Number(this.route.snapshot.paramMap.get('carnet_estudiante'));
      console.log('Carnet del estudiante:', this.carnet_estudiante);
      this.cargarCalificaciones();
    }

    async cargarCalificaciones() {
      try {
        if (this.carnet_estudiante) {
          // Aquí puedes pasar el carnet_estudiante a tu servicio para cargar las calificaciones
          this.calificaciones = await this.notasService.getNota(this.carnet_estudiante);
          console.log('Calificaciones cargadas:', this.calificaciones);
        }
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
        // Limpia el formulario para agregar una nueva calificación y configura el estudiante_id
        this.calificacionActual = {
          estudiante_id: this.carnet_estudiante || 0,  // Establece el carnet del estudiante
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

    async eliminarCalificacion(id?: number) {
      if (id === undefined) {
        console.error('El ID de la calificación no está definido');
        return; // O maneja el error de otra forma
      }
      try {
        await this.notasService.deleteNota(id);
        this.cargarCalificaciones();
      } catch (error) {
        console.error('Error al eliminar la calificación:', error);
      }
    }
  }
