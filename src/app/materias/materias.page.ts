import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

interface Materia {
  nombre: string;
  descripcion: string;
}

@Component({
  selector: 'app-materias',
  templateUrl: './materias.page.html',
  styleUrls: ['./materias.page.scss'],
})
export class MateriasPage {
  materias: Materia[] = []; // Lista de materias
  nombre: string = ''; // Variable para el nombre de la materia
  descripcion: string = ''; // Variable para la descripción de la materia
  editando: boolean = false; // Controla si estamos en modo edición
  materiaEditando: number | null = null; // Índice de la materia que se está editando

  constructor(private alertController: AlertController) {}

  agregarMateria() {
    if (this.editando && this.materiaEditando !== null) {
      // Actualizar la materia existente
      this.materias[this.materiaEditando] = { nombre: this.nombre, descripcion: this.descripcion };
      this.cancelarEdicion(); // Finaliza la edición
    } else {
      // Agregar una nueva materia
      if (this.nombre && this.descripcion) {
        this.materias.push({ nombre: this.nombre, descripcion: this.descripcion });
        this.limpiarFormulario(); // Reinicia el formulario después de agregar
      }
    }
  }

  editarMateria(materia: Materia, index: number) {
    // Llenar el formulario con los datos de la materia seleccionada
    this.nombre = materia.nombre;
    this.descripcion = materia.descripcion;
    this.materiaEditando = index;
    this.editando = true;
  }

  actualizarMateria() {
    // Este método puede ser opcional si ya se usa agregarMateria para editar.
    this.agregarMateria();
  }

  async eliminarMateria(index: number) {
    // Mostrar alerta de confirmación para eliminar la materia
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar esta materia?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Eliminación cancelada');
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            // Eliminar la materia si se confirma
            this.materias.splice(index, 1);
            this.cancelarEdicion(); // Cancelar la edición en caso de que se esté editando
            console.log('Materia eliminada');
          }
        }
      ]
    });

    await alert.present();
  }

  cancelarEdicion() {
    // Limpiar el formulario y cancelar la edición
    this.nombre = '';
    this.descripcion = '';
    this.editando = false;
    this.materiaEditando = null;
  }

  limpiarFormulario() {
    // Restablecer el formulario para agregar nuevas materias
    this.nombre = '';
    this.descripcion = '';
  }
}
