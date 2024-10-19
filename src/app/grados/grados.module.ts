import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GradosPage } from './grados.page'; // Asegúrate de que esta ruta sea correcta
import { GradosRoutingModule } from './grados-routing.module'; // Importa el módulo de enrutamiento

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GradosRoutingModule // Agrega el módulo de enrutamiento aquí
  ],
  declarations: [GradosPage]
})
export class GradosPageModule {}
