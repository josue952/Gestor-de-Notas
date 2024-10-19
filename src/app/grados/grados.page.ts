import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

interface Grado {
  nombre: string;
  descripcion: string;
}

@Component({
  selector: 'app-grados',
  templateUrl: './grados.page.html',
  styleUrls: ['./grados.page.scss'],
})
export class GradosPage {
  grados: Grado[] = [
    // Ejemplo de estructura de grados
    { nombre: 'Primero', descripcion: 'Primer grado' },
    { nombre: 'Segundo', descripcion: 'Segundo grado' }
  ]; // Lista de grados

  nuevoGrado: Grado = { nombre: '', descripcion: '' }; // Para crear nuevos grados
  gradoEditado: Grado = { nombre: '', descripcion: '' }; // Para editar grados
  gradoEditando: number | null = null; // Índice del grado que se está editando
  editando: boolean = false; // Controla si estamos en modo edición

  constructor(private alertController: AlertController) {}

  agregarGrado() {
    if (this.editando && this.gradoEditando !== null) {
      // Actualizar el grado existente
      this.grados[this.gradoEditando] = { ...this.gradoEditado };
      this.cancelarEdicion(); // Finaliza la edición
    } else {
      // Agregar un nuevo grado
      this.grados.push({ ...this.nuevoGrado });
      this.limpiarFormulario(); // Reinicia el formulario después de agregar
    }
  }

  editarGrado(grado: Grado, index: number) {
    // Llenar el formulario con los datos del grado seleccionado
    this.gradoEditado = { ...grado };
    this.gradoEditando = index;
    this.editando = true;
  }

  async eliminarGrado(index: number) {
    // Mostrar alerta de confirmación para eliminar el grado
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar este grado?',
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
            // Eliminar el grado si se confirma
            this.grados.splice(index, 1);
            this.cancelarEdicion(); // Cancelar la edición en caso de que se esté editando
            console.log('Grado eliminado');
          }
        }
      ]
    });

    await alert.present();
  }

  cancelarEdicion() {
    // Limpiar el formulario y cancelar la edición
    this.gradoEditado = { nombre: '', descripcion: '' };
    this.editando = false;
    this.gradoEditando = null;
  }

  limpiarFormulario() {
    // Restablecer el formulario para agregar nuevos grados
    this.nuevoGrado = { nombre: '', descripcion: '' };
    this.gradoEditado = { nombre: '', descripcion: '' };
  }
}
