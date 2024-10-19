import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GradosPage } from './grados.page'; // Asegúrate de que esta ruta sea correcta

const routes: Routes = [
  {
    path: '',
    component: GradosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GradosRoutingModule {}
