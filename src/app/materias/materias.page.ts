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
  materias: Materia[] = []; 
  nombre: string = ''; 
  descripcion: string = ''; 
  editando: boolean = false; 
  materiaEditando: number | null = null; 

  constructor(private alertController: AlertController) {}

  agregarMateria() {
    if (this.editando && this.materiaEditando !== null) {
      this.materias[this.materiaEditando] = { nombre: this.nombre, descripcion: this.descripcion };
      this.cancelarEdicion();
    } else {
      if (this.nombre && this.descripcion) {
        this.materias.push({ nombre: this.nombre, descripcion: this.descripcion });
        this.limpiarFormulario();
      }
    }
  }

  abrirModalEdicion(materia: Materia, index: number) {
    this.nombre = materia.nombre;
    this.descripcion = materia.descripcion;
    this.materiaEditando = index;
    this.editando = true;
  }

  async eliminarMateria(index: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar esta materia?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', handler: () => this.materias.splice(index, 1) }
      ]
    });
    await alert.present();
  }

  cancelarEdicion() {
    this.nombre = '';
    this.descripcion = '';
    this.editando = false;
    this.materiaEditando = null;
  }

  limpiarFormulario() {
    this.nombre = '';
    this.descripcion = '';
  }
}
