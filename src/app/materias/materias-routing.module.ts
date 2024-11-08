import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { IonicModule } from '@ionic/angular';
import { MateriasPage } from './materias.page';

const routes: Routes = [
  {
    path: '',
    component: MateriasPage
  }

];

@NgModule({
  imports: [
    CommonModule,
    FormsModule, 
    IonicModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class MateriasPageRoutingModule {}
