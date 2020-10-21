import { Component } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Badge } from '@ionic-native/badge/ngx';
import { MenuController } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HttpService } from '../http.service';
import { UtilityService } from '../utility.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private statusBar: StatusBar, private menu: MenuController,private badge:Badge, private utility:UtilityService,private route: ActivatedRoute, private router: Router, private http: HttpService) {
    this.statusBar.backgroundColorByHexString('#ffffff');
    this.route.queryParams.subscribe((params) => {
      this.badge.clear();
      this.getAllDoctors();
      this.getChatSubscriptionStatus();
    });
    
  }

  bookOPD() {
    this.http.getLocations('allLocations');
    let navigationExtras: NavigationExtras = {
      state: {
        book_type: 'OPD'
      },
    };
    this.router.navigate(['/select-location'], navigationExtras);
  }

  myReports(){
    this.router.navigateByUrl('/my-reports')
  }

  bookVideoCall() {
    this.http.getLocations('allLocations');
    let navigationExtras: NavigationExtras = {
      state: {
        book_type: 'videocall'
      },
    };
   this.router.navigate(['/select-location'],navigationExtras);
  }

  aboutUs(){
    this.router.navigateByUrl("/about");
  }


  myAppointments() {
    this.router.navigate(['/my-appointments']);
  }
  account() {
    this.router.navigate(['/profile']);
  }
  openMenu() {
    this.menu.enable(true, 'first');
  }

  getAllDoctors(){
    this.http.getAllDoctors("allDoctors").subscribe((res: any) => {
       if (res.success) {
        this.utility.all_doctors = res.data;
      } else {
       
      }
    }, err => {
     
    })
  }

  getChatSubscriptionStatus(){
    let user = JSON.parse(localStorage.getItem('user_details'));
    this.http.getChatSubscriptionStatus("chatPaymentStatus/user/" + user.id).subscribe((res: any) => {
       if (res.success) {
        this.utility.chat_payment_status = res.data['payment_status'];
      } else {
      }
    }, err => {
     
    })
  }
}
