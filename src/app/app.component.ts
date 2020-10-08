import { Component } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';
import { Badge } from '@ionic-native/badge/ngx';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { HttpService } from './http.service';
import { UtilityService } from './utility.service';

declare var cordova: any;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public user: any;
  public image: any;
  public menu = [
    {
      title: "Home",
      url: "/home",
      icon: "home-outline",
    },
    {
      title: "Book OPD Consulation",
      url: "",
      icon: "calendar",
    },
    {
      title: "Book Video Consulation",
      url: "",
      icon: "phone-portrait-outline",
    },
    {
      title: "Chat with doctor",
      url: "chat-with-doctor",
      icon: "chatbox-ellipses-outline",
    },
    {
      title: "Ask a query",
      url: "/query",
      icon: "help",
    },
    {
      title: "Videos",
      url: "/videos",
      icon: "logo-youtube",
    },
    {
      title: "Blogs",
      url: "/blogs",
      icon: "newspaper-outline",
    },
    {
      title: "My Reports",
      url: "/my-reports",
      icon: "receipt-outline",
    },
    {
      title: "My Appointments",
      url: "/my-appointments",
      icon: "calendar-outline",
    },
    {
      title: "My Profile",
      url: "/profile",
      icon: "person-outline",
    },
    {
      title: "About Us",
      url: "/about",
      icon: "help",
    },
    {
      title: "Contact Us",
      url: "/contact",
      icon: "call"
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
    private push: Push,
    private badge:Badge,
    private androidPermissions: AndroidPermissions,
    private backgroundMode: BackgroundMode,
    public localNotifications: LocalNotifications,
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
      if (this.platform.is('android')) {
        this.utility.device_type = 'android';
      }
      if (this.platform.is('ios')) {
        this.utility.device_type = 'ios';
      }
     // this.backgroundMode.enable();
      this.pushNotification();
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
        result => {
          console.log('Has permission?', result.hasPermission)
          if (result.hasPermission == false) {
            console.log("ask permission")
            this.androidPermissions.requestPermissions([
              this.androidPermissions.PERMISSION.CAMERA,
              this.androidPermissions.PERMISSION.MODIFY_AUDIO_SETTINGS,
              this.androidPermissions.PERMISSION.RECORD_AUDIO
            ])
          }
        },
        err => {
          console.log(err)
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
        }
      );
      if (JSON.parse(localStorage.getItem('token')) != undefined) {
        this.user = JSON.parse(localStorage.getItem('user_details'));
        this.utility.user = JSON.parse(localStorage.getItem('user_details'));
        if (this.utility.user.profile_photo != null) {
          this.utility.image = this.utility.user.profile_photo;
        } else {
          this.utility.image = "assets/imgs/no-profile.png";
        }
        this.router.navigate(["home"])
      } else {
        this.router.navigate(["login"])
        this.http.getLocations("allLocations");
      }
      this.platform.resume.subscribe(() => {
        console.log('****UserdashboardPage RESUMED****');
      });
    });
  }
  chooseOption(page) {
    if (page == 'Logout') {
      localStorage.removeItem('token');
      localStorage.removeItem('user_details');
      // this.utility.showMessageAlert("Logout","You have been logout");
      this.router.navigate(["login"])
    }
    if (page == 'Book OPD Consulation') {

      let navigationExtras: NavigationExtras = {
        state: {
          book_type: 'OPD'
        },
      };
      this.router.navigate(['/select-location'], navigationExtras);

    }
    if (page == 'Book Video Consulation') {

      let navigationExtras: NavigationExtras = {
        state: {
          book_type: 'OPD'
        },
      };
      this.router.navigate(['/select-location'], navigationExtras);

    }
  }

  pushNotification() {
    const options: PushOptions = {
      android: {
       // badge:true,
        sound:true,
        vibrate:true
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'true'
      },
      windows: {},
      browser: {
        pushServiceURL: 'http://push.api.phonegap.com/v1/push'
      }
    }

    const pushObject: PushObject = this.push.init(options);

    pushObject.on('notification').subscribe((notification: any) => {
      console.log('Received a notification', notification); 
      this.badge.set(1);
      // cordova.plugins.CordovaCall.setVideo(true);
      // cordova.plugins.CordovaCall.receiveCall('David Marcus');
      if (notification.additionalData['notification_type'] == 'start_call') {
        this.localNotifications.schedule({
          id: 1,
          title: notification.title,
          text: notification.message
        });

        let navigationExtras: NavigationExtras = {
          state: {
            streamId: notification.additionalData['unique ID'],
            channel_name: notification.additionalData['channel'],
          },
        };
        this.router.navigateByUrl('/video-call-appointment', navigationExtras)
      }

      if (notification.additionalData['notification_type'] == 'end_call') {
        this.localNotifications.schedule({
          id: 1,
          title: notification.title,
          text: notification.message
        });
        
        this.utility.showMessageAlert(notification.title,notification.message)
        this.utility.publishEvent({
          'call:ended': notification.title
        });
       }

    });

    pushObject.on('registration').subscribe((registration: any) => {
      console.log('Device registered', registration);
      this.utility.device_token = registration.registrationId;

    });

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));

  }
}
