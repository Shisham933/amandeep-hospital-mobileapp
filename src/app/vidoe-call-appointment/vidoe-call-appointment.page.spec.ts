import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VidoeCallAppointmentPage } from './vidoe-call-appointment.page';

describe('VidoeCallAppointmentPage', () => {
  let component: VidoeCallAppointmentPage;
  let fixture: ComponentFixture<VidoeCallAppointmentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VidoeCallAppointmentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VidoeCallAppointmentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
