import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { LoadingController, ModalController, AlertController, ToastController } from "@ionic/angular";
import { Location } from '@angular/common';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HttpService } from '../http.service';
import { UtilityService } from '../utility.service';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';
import { CardPaymentPage } from '../card-payment/card-payment.page';


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
  speciality_id:any;
  date: any;
  time: any;
  user: any;
  book_for: string;
  book_type;
  show_patient_details: boolean = false;
  show_patient_form: boolean = false;
  name: any;
  mobile_no: any;
  age: any;
  speciality_name: string;
  choose_self: boolean = false;
  choose_relative: boolean = false;
  booking_options: any = [{
    title: "SELF",
    isChecked: false
  }, {
    title: "RELATIVE",
    isChecked: false
  }]

  constructor(private statusBar: StatusBar, public modalController: ModalController, private alertController: AlertController, private launchNavigator: LaunchNavigator, private route: ActivatedRoute, private location: Location, private router: Router, private http: HttpService, private utility: UtilityService) {
    this.statusBar.backgroundColorByHexString('#ffffff');
    this.route.queryParams.subscribe((params) => {
      this.speciality_id = this.router.getCurrentNavigation().extras.state.speciality_id;
      this.location_name = this.router.getCurrentNavigation().extras.state.location_name;
      this.data = this.router.getCurrentNavigation().extras.state.data;
      this.location_id = this.data.location_id;
      this.doctor_id = this.data.doctor_id;
      this.date = this.router.getCurrentNavigation().extras.state.date;
      console.log(this.date, "this.date ")
      this.time = this.router.getCurrentNavigation().extras.state.time;
      this.schedule_id = this.router.getCurrentNavigation().extras.state.schedule_id;
      this.speciality_name = this.router.getCurrentNavigation().extras.state.speciality_name;
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
    // this.choose_self = true;
    // this.choose_relative = false;
    // console.log("this.choose_self", this.choose_self);
    // console.log("this.choose_relative", this.choose_relative)
    this.book_for = 'self';
    this.user = JSON.parse(localStorage.getItem('user_details'));
    this.show_patient_details = true;
    this.show_patient_form = false;
    if (!this.choose_self) {
      this.choose_self = true;
      this.choose_relative = false;
    } else {
      this.choose_self = false;
      this.choose_relative = false;
    }

    // if(!this.choose_relative){
    // this.choose_relative = true;
    // }else{
    // this.choose_relative = false;
    // }

  }

  chooseRelative() {
    this.show_patient_form = true;
    this.show_patient_details = false;
    this.book_for = 'relative';

    if (!this.choose_relative) {
      this.choose_relative = true;
      this.choose_self = false;
    } else {
      // this.choose_relative = false;
      this.choose_self = false;
    }


  }

  chooseBookingOption(title, index) {
    console.log(title)
    if (title == 'SELF') {
      this.book_for = 'self';
      this.user = JSON.parse(localStorage.getItem('user_details'));
      this.show_patient_details = true;
      this.show_patient_form = false;
      this.booking_options[1].isChecked = false;
      this.booking_options[0].isChecked = true;
    } else {
      this.show_patient_form = true;
      this.show_patient_details = false;
      this.book_for = 'relative';
      this.booking_options[0].isChecked = false;
      this.booking_options[1].isChecked = true;
    }
  }

  addPatient() {
    debugger
    let regx = /^[A-Za-z]+$/;
    if (this.name == undefined || this.name == '' || this.age == undefined || this.mobile_no == undefined || this.mobile_no == '') {
      this.utility.showMessageAlert("Error!", "All fields are required.")
    } else if (!this.name.match(regx)) {
      this.utility.showMessageAlert("Invalid Patient name", "Only alphabets are allowed to enter in patient name field.")
    } else if (this.mobile_no.toString().length != 10) {
      this.utility.showMessageAlert("Invalid mobile number!", "The mobile number you have entered is not valid.")
    } else if (this.age.toString().length > 2) {
      this.utility.showMessageAlert("Invalid age !", "The age  you have entered is not valid.")
    } else {
      this.utility.showLoading();
      let params = {
        "name": this.name,
        "mobile_no": this.mobile_no,
        "age": this.age
      }
      this.http.addPatient("addPatient", params).subscribe(
        (res: any) => {
          this.utility.hideLoading();
          if (res.success || res.message == 'Patient added successfully') {
            this.utility.showMessageAlert("Patient added!", "Your patient has been added.");
            this.show_patient_details = true;
            this.show_patient_form = false;
            this.book_for = 'relative';
            this.user = res.data.patient;
            this.choose_self = false;
            this.choose_relative = true;
          } else {
            this.choose_self = false;
            this.choose_relative = true;
            let state = {
              patient: res.data.patient,
              location_name: this.location_name,
              data: this.data,
              date: this.date,
              time: this.time,
              schedule_id: this.schedule_id
            }
            this.showAlert('Patient already added', 'Do you want to continue with this patient?', state)
          }
        }, err => {
          this.utility.hideLoading();
          this.utility.showMessageAlert("Network error!", "Please check your network connection.")
        })
    }
  }

  async showAlert(header: string, message: string, state) {
    const alert = await this.alertController.create({
      cssClass: "alert-container",
      header: header,
      message: message,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            console.log('Buy clicked');
            this.show_patient_details = true;
            this.book_for = 'relative';
            this.user = state.patient;
            this.show_patient_form = false;
          }
        }
      ]
    });
    await alert.present();
  }

  showMap() {

    this.launchNavigator.navigate(this.location_name)
      .then(
      );
  }

  confirmAppointment() {
    //debugger
    if (this.book_for == '' || this.book_for == undefined) {
      this.utility.showMessageAlert("Patient info required!", "Please select one option for whom you are booking this appointment.")
    } else {
      if (this.book_type == 'OPD') {
       let user = JSON.parse(localStorage.getItem('user_details'))
        let params = {
          "speciality_id": this.data.speciality_id,
          "doctor_id": this.doctor_id,
          "date": this.date.getFullYear() + '-' + (this.date.getMonth() + 1) + '-' + this.date.getDate(),
          "location_id": this.location_id,
          "fee": "500",
          "schedule_id": this.schedule_id,
          "book_for": this.book_for,
          "patient_id": this.user.id,
          "created_by": user.id,
          "type":"OPD"
        }
        // debugger
        console.log("params.....", params);

        //this.presentModal(params);
        this.utility.showLoading();
        this.http.confirmAppointment("confirmAppointment", params).subscribe(
          (res: any) => {
            console.log(res)
            this.utility.hideLoading();
            if (res.success || res.message == 'Appointment booked successfully') {
              this.utility.showMessageAlert("Appointment booked!", "Appointment booked successfully.")
              this.router.navigateByUrl("/home");
            } else if (res.success == false) {
              this.utility.showMessageAlert("Slot not available!",res.message )
              let navigationExtras: NavigationExtras = {
                state: {
                  location_name: this.location_name,
                  data: this.data,
                  book_type: this.book_type,
                  speciality_id:this.speciality_id,
                  speciality_name: this.speciality_name,

                },
              };
              debugger
              this.router.navigateByUrl("/select-timeslot", navigationExtras);
            } else {
              this.utility.showMessageAlert("Appointment not booked!", "Plese try again.")

            }
           
          }, err => {
            this.utility.hideLoading();
            this.utility.showMessageAlert("Network error!", "Please check your network connection.")
          })
      }
      if (this.book_type == 'videocall') {
       let user = JSON.parse(localStorage.getItem('user_details'))
        let params = {
          "speciality_id": this.data.speciality_id,
          "doctor_id": this.doctor_id,
          "date": this.date.getFullYear() + '-' + (this.date.getMonth() + 1) + '-' + this.date.getDate(),
          "location_id": this.location_id,
          "fee": "500",
          "schedule_id": this.schedule_id,
          "book_for": this.book_for,
          "patient_id": this.user.id,
          "created_by": user.id,
          "type":"video"
        }

        //this.presentModal(params);
        this.utility.showLoading();
        this.http.confirmAppointment("confirmVideoAppointment", params).subscribe(
          (res: any) => {
            this.utility.hideLoading();
            if (res.success || res.message == 'Appointment booked successfully') {
              this.utility.showMessageAlert("Appointment booked!", "Appointment booked successfully.")
              this.router.navigateByUrl("/home");
            } else if (res.success == false || res.message == 'Slot is already booked.') {
              this.utility.showMessageAlert("Slot not available!", "This slot is already booked.Please choose another time slot.")
              let navigationExtras: NavigationExtras = {
                state: {
                  location_name: this.location_name,
                  data: this.data,
                  book_type: this.book_type,
                  speciality_id:this.speciality_id,
                  speciality_name: this.speciality_name,
                },
              };
              this.router.navigateByUrl("/select-timeslot", navigationExtras);
            } else {
              this.utility.showMessageAlert("Appointment not booked!", "Plese try again.")
            }
           
          }, err => {
            this.utility.hideLoading();
            this.utility.showMessageAlert("Network error!", "Please check your network connection.")
          })
      }
    }

  }

  async presentModal(data) {
    const modal = await this.modalController.create({
      component: CardPaymentPage,
      animated: true,
      backdropDismiss: true,
      showBackdrop: true,
      componentProps: {
        'params': 'data'
      }
    });
    return await modal.present();
  }

}
