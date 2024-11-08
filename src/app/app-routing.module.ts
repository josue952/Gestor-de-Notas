import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard'; // Importa la guardia de autenticación

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'materias',
    loadChildren: () => import('./materias/materias.module').then(m => m.MateriasPageModule),
    canActivate: [AuthGuard] // Protege esta ruta con AuthGuard
  },
  {
    path: 'grados',
    loadChildren: () => import('./grados/grados.module').then(m => m.GradosPageModule),
    canActivate: [AuthGuard] // Protege esta ruta con AuthGuard
  },
  {
    path: 'notas/:carnet_estudiante',
    loadChildren: () => import('./notas/notas.module').then( m => m.NotasPageModule),
    canActivate: [AuthGuard] // Protege esta ruta con AuthGuard
  },
  {
    path: 'usuarios',
    loadChildren: () => import('./usuarios/usuarios.module').then( m => m.UsuariosPageModule),
    canActivate: [AuthGuard] // Protege esta ruta con AuthGuard
  },
  {
    path: 'clases',
    loadChildren: () => import('./clases/clases.module').then( m => m.ClasesPageModule),
    canActivate: [AuthGuard] // Protege esta ruta con AuthGuard
  },
  {
    path: 'estudiantes',
    loadChildren: () => import('./estudiantes/estudiantes.module').then( m => m.EstudiantesPageModule),
    canActivate: [AuthGuard] // Protege esta ruta con AuthGuard
  },
  {
    path: 'sub-notas/:id_calificacion', // Asegúrate de que el nombre del parámetro sea correcto
    loadChildren: () => import('./notas/sub-notas/sub-notas.module').then(m => m.SubNotasPageModule),
    canActivate: [AuthGuard] // Protege esta ruta con AuthGuard
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
