import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfesorPageRoutingModule } from './profesor-routing.module';

import { ProfesorPage } from './profesor.page';
import { ModulesModule } from 'src/app/modules/modules.module';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfesorPageRoutingModule,
    ModulesModule,
    ReactiveFormsModule,
    FormsModule,
    QRCodeModule
  ],
  declarations: [ProfesorPage]
})
export class ProfesorPageModule {}
