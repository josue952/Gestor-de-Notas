import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GradosPage } from './grados.page'; // Asegúrate de que esta ruta sea correcta

const routes: Routes = [
  {
    path: '',
    component: GradosPage
  },
  {
    path: 'grados-materia/:id_grado', // Ruta con parámetro para el ID del grado
    loadChildren: () => import('./grados-materia/grados-materia.module').then(m => m.GradosMateriaPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GradosRoutingModule {}
