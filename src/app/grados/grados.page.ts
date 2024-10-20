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
    { nombre: 'Primero', descripcion: 'Primer grado' },
    { nombre: 'Segundo', descripcion: 'Segundo grado' }
  ];

  nuevoGrado: Grado = { nombre: '', descripcion: '' };
  gradoEditado: Grado = { nombre: '', descripcion: '' };
  gradoEditando: number | null = null;
  editando: boolean = false;

  constructor(private alertController: AlertController) {}

  agregarGrado() {
    if (this.editando && this.gradoEditando !== null) {
      this.grados[this.gradoEditando] = { ...this.gradoEditado };
      this.cancelarEdicion();
    } else {
      this.grados.push({ ...this.nuevoGrado });
      this.limpiarFormulario();
    }
  }

  abrirModalEdicion(grado: Grado, index: number) {
    this.gradoEditado = { ...grado };
    this.gradoEditando = index;
    this.editando = true;
  }

  async eliminarGrado(index: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar este grado?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.grados.splice(index, 1);
            this.cancelarEdicion();
          }
        }
      ]
    });

    await alert.present();
  }

  cancelarEdicion() {
    this.gradoEditado = { nombre: '', descripcion: '' };
    this.editando = false;
    this.gradoEditando = null;
  }

  limpiarFormulario() {
    this.nuevoGrado = { nombre: '', descripcion: '' };
    this.gradoEditado = { nombre: '', descripcion: '' };
  }
}
