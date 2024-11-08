import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SubNotasPageRoutingModule } from './sub-notas-routing.module';
import { SubNotasPage } from './sub-notas.page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubNotasPageRoutingModule,
    SharedModule
  ],
  declarations: [SubNotasPage]
})
export class SubNotasPageModule {}
