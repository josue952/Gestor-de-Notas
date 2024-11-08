import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular'; // Importar IonicModule
import { LogoutComponent } from '../components/logout/logout.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';


@NgModule({
  declarations: [LogoutComponent, SidebarComponent],
  imports: [
    CommonModule,
    IonicModule // Asegúrate de incluir esto
  ],
  exports: [LogoutComponent, SidebarComponent]
})
export class SharedModule {}
