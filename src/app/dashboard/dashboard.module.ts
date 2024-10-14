import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';
import { DashboardPage } from './dashboard.page';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { LogoutComponent } from '../components/logout/logout.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardPageRoutingModule,
    
  ],
  declarations: [DashboardPage, SidebarComponent, LogoutComponent]
})
export class DashboardPageModule {}
