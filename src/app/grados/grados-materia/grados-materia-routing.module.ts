import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GradosMateriaPage } from './grados-materia.page';

const routes: Routes = [
  {
    path: '',
    component: GradosMateriaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GradosMateriaPageRoutingModule {}
