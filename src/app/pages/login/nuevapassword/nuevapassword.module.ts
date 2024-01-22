import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NuevapasswordPageRoutingModule } from './nuevapassword-routing.module';

import { NuevapasswordPage } from './nuevapassword.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NuevapasswordPageRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [NuevapasswordPage]
})
export class NuevapasswordPageModule {}
