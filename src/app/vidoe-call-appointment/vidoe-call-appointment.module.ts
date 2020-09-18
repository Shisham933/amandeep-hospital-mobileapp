import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VidoeCallAppointmentPageRoutingModule } from './vidoe-call-appointment-routing.module';

import { VidoeCallAppointmentPage } from './vidoe-call-appointment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VidoeCallAppointmentPageRoutingModule
  ],
  declarations: [VidoeCallAppointmentPage]
})
export class VidoeCallAppointmentPageModule {}
