import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { IonicModule } from '@ionic/angular';
import { MateriasPage } from './materias.page';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

const routes = [
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
    SharedModule
  ],
  declarations: [MateriasPage]
})
export class MateriasPageModule {}
