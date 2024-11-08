import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotasPage } from './notas.page';

const routes: Routes = [
  {
    path: '',
    component: NotasPage
  },
  {
    path: 'sub-notas/:id_calificacion',
    loadChildren: () => import('./sub-notas/sub-notas.module').then(m => m.SubNotasPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotasPageRoutingModule {}
