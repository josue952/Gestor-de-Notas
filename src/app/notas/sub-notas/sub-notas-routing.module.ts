import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubNotasPage } from './sub-notas.page';

const routes: Routes = [
  {
    path: '',
    component: SubNotasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubNotasPageRoutingModule {}
