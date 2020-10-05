import { Component } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
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

  constructor(private statusBar: StatusBar, private menu: MenuController, private route: ActivatedRoute, private router: Router, private http: HttpService) {
    this.statusBar.backgroundColorByHexString('#ffffff');
    this.route.queryParams.subscribe((params) => {
      this.http.getLocations('allLocations');
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
}
