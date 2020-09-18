import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HttpService } from '../http.service';
import { UtilityService } from '../utility.service';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';

@Component({
  selector: 'app-confirm-appointment',
  templateUrl: './confirm-appointment.page.html',
  styleUrls: ['./confirm-appointment.page.scss'],
})
export class ConfirmAppointmentPage implements OnInit {
  location_name: any;
  data: any;
  location_id: any;
  doctor_id: any;
  schedule_id: any;
  date: any;
  time: any;
  user: any;
  book_for: string = 'self';
  book_type;

  constructor(private statusBar: StatusBar, private launchNavigator: LaunchNavigator, private route: ActivatedRoute, private location: Location, private router: Router, private http: HttpService, private utility: UtilityService) {
    this.statusBar.backgroundColorByHexString('#ffffff');
    this.route.queryParams.subscribe((params) => {
      this.location_name = this.router.getCurrentNavigation().extras.state.location_name;
      this.data = this.router.getCurrentNavigation().extras.state.data;
      this.location_id = this.data.location_id;
      this.doctor_id = this.data.doctor_id;
      this.date = this.router.getCurrentNavigation().extras.state.date;
      this.time = this.router.getCurrentNavigation().extras.state.time;
      this.schedule_id = this.router.getCurrentNavigation().extras.state.schedule_id;
      this.book_type = this.router.getCurrentNavigation().extras.state.book_type;
      if (this.router.getCurrentNavigation().extras.state.patient != undefined) {
        this.book_for = 'relative';
        this.user = this.router.getCurrentNavigation().extras.state.patient;
      } else {
        this.user = JSON.parse(localStorage.getItem('user_details'));
      }

    });
  }

  ngOnInit() {
  }

  goBack() {
    this.location.back();
  }

  chooseSelf() {
    this.book_for = 'self';
    this.user = JSON.parse(localStorage.getItem('user_details'));
  }

  addPatient() {
    let navigationExtras: NavigationExtras = {
      state: {
        location_name: this.location_name,
        data: this.data,
        date: this.date,
        time: this.time,
        schedule_id: this.schedule_id
      },
    };
    this.router.navigate(['/add-patient'], navigationExtras);
  }

  showMap() {

    this.launchNavigator.navigate(this.location_name)
      .then(
      );
  }

  confirmAppointment() {
    //debugger
    if (this.book_type == 'OPD') {
      this.utility.showLoading();
      let user = JSON.parse(localStorage.getItem('user_details'))
      let params = {
        "speciality_id": this.data.speciality_id,
        "doctor_id": this.doctor_id,
        "date": this.date,
        "location_id": this.location_id,
        "fee": "500",
        "schedule_id": this.schedule_id,
        "book_for": this.book_for,
        "patient_id": this.user.id,
        "created_by": user.id
      }
      this.http.confirmAppointment("confirmAppointment", params).subscribe(
        (res: any) => {
          if (res.success || res.message == 'Appointment booked successfully') {
            this.utility.showMessageAlert("Appointment booked!", "Appointment booked successfully.")
            this.router.navigateByUrl("/home");
          } else if (res.success == false || res.message == 'Slot is already booked.') {
            this.utility.showMessageAlert("Slot not available!", "This slot is already booked.Please choose another time slot.")
            let navigationExtras: NavigationExtras = {
              state: {
                location_name: this.location_name,
                data: this.data
              },
            };
            this.router.navigateByUrl("/select-timeslot", navigationExtras);
          } else {
            this.utility.showMessageAlert("Appointment not booked!", "Plese try again.")

          }
          this.utility.hideLoading();
        }, err => {
          this.utility.hideLoading();
          this.utility.showMessageAlert("Network error!", "Please check your network connection.")
        })
    }
    if(this.book_type == 'videocall'){
      this.utility.showLoading();
      let user = JSON.parse(localStorage.getItem('user_details'))
      let params = {
        "speciality_id": this.data.speciality_id,
        "doctor_id": this.doctor_id,
        "date": this.date,
        "location_id": this.location_id,
        "fee": "500",
        "schedule_id": this.schedule_id,
        "book_for": this.book_for,
        "patient_id": this.user.id,
        "created_by": user.id
      }
      this.http.confirmAppointment("confirmVideoAppointment", params).subscribe(
        (res: any) => {
          if (res.success || res.message == 'Appointment booked successfully') {
            this.utility.showMessageAlert("Appointment booked!", "Appointment booked successfully.")
            this.router.navigateByUrl("/home");
          } else if (res.success == false || res.message == 'Slot is already booked.') {
            this.utility.showMessageAlert("Slot not available!", "This slot is already booked.Please choose another time slot.")
            let navigationExtras: NavigationExtras = {
              state: {
                location_name: this.location_name,
                data: this.data
              },
            };
            this.router.navigateByUrl("/select-timeslot", navigationExtras);
          } else {
            this.utility.showMessageAlert("Appointment not booked!", "Plese try again.")
          }
          this.utility.hideLoading();
        }, err => {
          this.utility.hideLoading();
          this.utility.showMessageAlert("Network error!", "Please check your network connection.")
        })
    }

  }

}
