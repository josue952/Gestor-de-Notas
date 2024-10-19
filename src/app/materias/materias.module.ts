import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Asegúrate de importar FormsModule
import { IonicModule } from '@ionic/angular';
import { MateriasPage } from './materias.page';
import { RouterModule } from '@angular/router';

const routes = [
  {
    path: '',
    component: MateriasPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule, // Asegúrate de que FormsModule esté importado
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MateriasPage]
})
export class MateriasPageModule {}
