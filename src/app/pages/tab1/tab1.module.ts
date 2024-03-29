import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';


import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';


import { Tab1PageRoutingModule } from './tab1-routing.module';
import { ModulesModule } from 'src/app/modules/modules.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab1PageRoutingModule,
    ModulesModule
  ],
  declarations: [Tab1Page, BarcodeScanningModalComponent]
})
export class Tab1PageModule {}
