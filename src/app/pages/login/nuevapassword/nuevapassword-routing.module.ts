import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NuevapasswordPage } from './nuevapassword.page';

const routes: Routes = [
  {
    path: '',
    component: NuevapasswordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NuevapasswordPageRoutingModule {}
