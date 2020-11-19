import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { LoadingController, AlertController, ToastController, ModalController } from "@ionic/angular";
import { HttpService } from '../http.service';
import { UtilityService } from '../utility.service';
import { ChatsService } from '../chats.service';
import { CardPaymentPage } from '../card-payment/card-payment.page';

@Component({
  selector: 'app-chat-with-doctor',
  templateUrl: './chat-with-doctor.page.html',
  styleUrls: ['./chat-with-doctor.page.scss'],
})
export class ChatWithDoctorPage implements OnInit {
  public show_patient_form: boolean = false;
  public patient_name: string;
  public doctor_id: any;
  public doctor_name: any;
  public doctor_firebaseid: any;
  public doctor_profile_image: string;
  public patient_profile_image: string;
  public name: any;
  public mobile_no: any;
  public age: any;
  public book_for: string = 'self';
  public subscribed_by;
  public patient_id: any;
  public health_query: string;



  constructor(private router: Router,
    private platform: Platform,
    private modalController: ModalController,
    private alertController: AlertController,
    private http: HttpService,
    public chats: ChatsService,
    public utility: UtilityService) {
    let user = JSON.parse(localStorage.getItem('user_details'));
    this.subscribed_by = user.id;
    this.patient_id = user.id;
    this.patient_name = user.user_name;
    this.patient_profile_image = user.profile_photo != undefined ? user.profile_photo : '';
    this.platform.backButton.subscribeWithPriority(9999, () => {
      // do nothing
      this.goBack();
    })
  }

  ngOnInit() {
  }

  goBack() {
    this.router.navigate(["home"])
  }

  chooseSelf() {
    this.book_for = 'self';
    let user = JSON.parse(localStorage.getItem('user_details'));
    this.patient_id = user.id;
  }

  chooseRelative() {
    this.show_patient_form = true;
    this.book_for = 'relative';
    this.patient_name = '';
  }

  chooseDoctor(d) {
    //debugger
    if (d.detail.value == 0) {
      this.doctor_id = this.utility.all_doctors[0].id;
      this.doctor_name = this.utility.all_doctors[0].firstname + ' ' + this.utility.all_doctors[0].lastname;
      this.doctor_firebaseid = this.utility.all_doctors[0].doctor_firebaseid;
      this.doctor_profile_image = this.utility.all_doctors[0].profile_picture;
    } else {
      this.doctor_id = this.utility.all_doctors[0].id;
      this.doctor_name = this.utility.all_doctors[d.detail.value].firstname + ' ' + this.utility.all_doctors[d.detail.value].lastname;
      this.doctor_firebaseid = this.utility.all_doctors[d.detail.value].doctor_firebaseid;
      this.doctor_profile_image = this.utility.all_doctors[d.detail.value].profile_picture;
    }

  }

  addPatient() {
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
      this.show_patient_form = false;
      this.book_for = 'relative';
      this.patient_name = this.name;

      // this.utility.showLoading();
      // let params = {
      //   "name": this.name,
      //   "mobile_no": this.mobile_no,
      //   "age": this.age
      // }
      // this.http.addPatient("addPatient", params).subscribe(
      //   (res: any) => {
      //     this.utility.hideLoading();
      //     if (res.success || res.message == 'Patient added successfully') {
      //       this.utility.showMessageAlert("Patient added!", "Your patient has been added.");

      //       this.show_patient_form = false;
      //       this.book_for = 'relative';
      //       this.patient_id = res.data['patient'].id;
      //       this.patient_name = res.data['patient'].name;

      //     } else {
      //       let state = {
      //         patient: res.data.patient,

      //       }
      //       this.showAlert('Patient already added', 'Do you want to continue with this patient?', state)
      //     }
      //   }, err => {
      //     this.utility.hideLoading();
      //     this.utility.showMessageAlert("Network error!", "Please check your network connection.")
      //   })
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
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.book_for = 'relative';
            this.show_patient_form = false;
            this.patient_id = state.patient.id;
            this.patient_name = state.patient.name;
          }
        }
      ]
    });
    await alert.present();
  }

  payNow() {
    //this.router.navigateByUrl("/chat-lists");
    if (this.doctor_id == undefined || this.doctor_id == '') {
      this.utility.showMessageAlert("Doctor is required!", "Please choose one of our doctors whom you want to chat with.")
    } else if (this.health_query == undefined || this.health_query == '') {
      this.utility.showMessageAlert("Health query is missing!", "Please write about your query you want to ask.")
    } else if (this.doctor_firebaseid == null) {
      this.utility.showMessageAlert("Doctor not available!", this.doctor_name + ' ' + "is not available for chat.")
    } else {
      // this.utility.showLoading();
      let user = JSON.parse(localStorage.getItem('user_details'));
      let params = {
        "doctor_id": this.doctor_id,
        "book_for": this.book_for,
        "subscribed_by": user.id,
        "health_query": this.health_query,
        "amount": 200,
        "name": this.patient_name,
        "age": this.age,
        "mobile_no": this.mobile_no,
        "type": "Chat"
        }

      localStorage.setItem('confirm-appointment', JSON.stringify(params));
      // debugger
      console.log("params.....", params);
      this.presentModal();
    }
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: CardPaymentPage,
      animated: true,
      backdropDismiss: true,
      showBackdrop: true,
    });
    return await modal.present();
  }


  // sendChatMessage(message) {
  //   this.chats.sendChatMessage(message);

  //   let params = {
  //     "id": this.doctor_id,
  //     "notified-person": "doctor",
  //     "title": "New message arrived",
  //     "message": this.patient_name + " " + "has asked you a health query.",
  //     "data": message
  //   }

  //   this.http.sendPushNotification("pushNotification", params).subscribe((res: any) => {
  //     if (res.success) {
  //       this.utility.showMessageAlert("Payment recieved!", "You have bought chat subscription to chat with our doctors");
  //       this.router.navigateByUrl("/chat-lists");
  //     }
  //   }, err => {

  //   })
  // }
}
