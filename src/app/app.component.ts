import { Component } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HttpService } from './http.service';
import { UtilityService } from './utility.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public user: any;
  public menu = [
    {
      title: "Home",
      url: "/home",
      icon: "home-outline",
    },
    {
      title: "Book OPD",
      url: "/select-location",
      icon: "calendar",
    },
    {
      title: "Chat with doctor",
      url: "",
      icon: "chatbox-ellipses-outline",
    },
    {
      title: "Ask a query",
      url: "",
      icon: "help",
    },
    {
      title: "Videos",
      url: "/videos",
      icon: "logo-youtube",
    },
    {
      title: "Blogs",
      url: "/customer-order-history",
      icon: "newspaper-outline",
    },
    {
      title: "My Reports",
      url: "/lotto",
      icon: "receipt-outline",
    },
    {
      title: "My Appointments",
      url: "/my-appointments",
      icon: "calendar-outline",
    },
    {
      title: "My Documents",
      url: "/customer-notifications",
      icon: "document-text-outline",
    },
    {
      title: "My Profile",
      url: "/profile",
      icon: "person-outline",
    },
    {
      title: "About",
      url: "",
      icon: "help",
    },
    {
      title: "Logout",
      url: "/login",
      icon: "log-in-outline",
    },
  ];
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private http: HttpService,
    public utility: UtilityService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString('#FF0000');
      this.splashScreen.hide();
      if (JSON.parse(localStorage.getItem('token')) != undefined) {
        //this.user = JSON.parse(localStorage.getItem('user_details'));
        this.utility.user = JSON.parse(localStorage.getItem('user_details'));
        this.router.navigate(["home"])
      } else {
        this.router.navigate(["login"])
        this.http.getLocations("allLocations");
      }
    });
  }
  chooseOption(page) {
    if (page == 'Logout') {
      localStorage.removeItem('token');
      localStorage.removeItem('user_details');
      // this.utility.showMessageAlert("Logout","You have been logout");
      this.router.navigate(["login"])
    }
  }
}
