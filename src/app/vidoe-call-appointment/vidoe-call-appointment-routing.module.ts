import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VidoeCallAppointmentPage } from './vidoe-call-appointment.page';

const routes: Routes = [
  {
    path: '',
    component: VidoeCallAppointmentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VidoeCallAppointmentPageRoutingModule {}
