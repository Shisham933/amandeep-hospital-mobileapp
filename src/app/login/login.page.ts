import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import codes from 'country-calling-code';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { AngularFireAuth } from 'angularfire2/auth';
import { HttpService } from '../http.service';
import { UtilityService } from '../utility.service';
@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    public codes: any;
    public dial_code;
    public mobile_no;
    public password;
    constructor(private statusBar: StatusBar, private fb: Facebook, private afAuth: AngularFireAuth, private router: Router, private http: HttpService, private utility: UtilityService) {
        this.statusBar.backgroundColorByHexString('#ffffff');
        this.codes = codes;
    }

    ngOnInit() { }

    login() {
        if (this.mobile_no == undefined) {
            this.utility.showMessageAlert("Mobile number required!", "Please enter your mobile number.")
        }
        else if (this.mobile_no.length != 10) {
            this.utility.showMessageAlert("Invalid mobile number!", "The mobile number you have entered is not valid.")
        } else if (this.password == undefined) {
            this.utility.showMessageAlert("Password required!", "Please enter the password.")
        } else {
            //this.utility.showLoading();
            // let email = this.mobile_no + "@amandeephospitalpatient.com";
            // let password = "Techies@321";
            // this.afAuth.auth.signInWithEmailAndPassword(email, password).then((res: any) => {
            //     console.log(res);
            //     if (res.code == 'auth/user-not-found') {
            //         this.afAuth.auth.createUserWithEmailAndPassword(email, password)
            //             .then((user: any) => {
            //                 console.log(user);
            //                 localStorage.setItem('firebase_user_id', JSON.stringify(user['user']));
            //                 let params = {
            //                     mobile: this.mobile_no
            //                 }
            //                 this.http.post("generateOTP", params).subscribe(
            //                     (res: any) => {

            //                         if (res.success) {
            //                             if (res.message == 'OTP has been sent to your mobile number.' || res.message == 'User is not verified.') {
            //                                 this.utility.showMessageAlert("OTP sent!", "OTP has been sent to your mobile number.")
            //                                 let navigationExtras: NavigationExtras = {
            //                                     state: {
            //                                         user_id: res.data['user_id'],
            //                                         mobile_no: this.mobile_no
            //                                     },
            //                                 };
            //                                 this.router.navigate(["verify-otp"], navigationExtras);
            //                             } else if (res.success || res.message == 'User is verified.') {
            //                                 if (res.data.length == 0) {
            //                                     this.utility.showMessageAlert("Setup your profile", "You have not setup your profile yet.")
            //                                     this.router.navigate(["sign-up"]);
            //                                 } else {
            //                                     let navigationExtras: NavigationExtras = {
            //                                         state: {
            //                                             user_id: res.data['user_id'],
            //                                             mobile_no: this.mobile_no
            //                                         },
            //                                     };
            //                                     this.router.navigate(["password"], navigationExtras);
            //                                 }
            //                             }
            //                         }
            //                         this.utility.hideLoading();
            //                     }, err => {
            //                         this.utility.hideLoading();
            //                         // this.utility.showMessageAlert("error", err);
            //                         // this.utility.showMessageAlert("error", JSON.stringify(err));
            //                     })
            //             }, (error) => {
            //                 console.log(error)
            //             });
            //     } else {
            //         localStorage.setItem('firebase_user_id', JSON.stringify(res['user']));
            //         let params = {
            //             mobile: this.mobile_no
            //         }
            //         this.http.post("generateOTP", params).subscribe(
            //             (res: any) => {

            //                 if (res.success) {
            //                     if (res.message == 'OTP has been sent to your mobile number.' || res.message == 'User is not verified.') {
            //                         this.utility.showMessageAlert("OTP sent!", "OTP has been sent to your mobile number.")
            //                         let navigationExtras: NavigationExtras = {
            //                             state: {
            //                                 user_id: res.data['user_id'],
            //                                 mobile_no: this.mobile_no
            //                             },
            //                         };
            //                         this.router.navigate(["verify-otp"], navigationExtras);
            //                     } else if (res.success || res.message == 'User is verified.') {
            //                         if (res.data.length == 0) {
            //                             this.utility.showMessageAlert("Setup your profile", "You have not setup your profile yet.")
            //                             this.router.navigate(["sign-up"]);
            //                         } else {
            //                             let navigationExtras: NavigationExtras = {
            //                                 state: {
            //                                     user_id: res.data['user_id'],
            //                                     mobile_no: this.mobile_no
            //                                 },
            //                             };
            //                             this.router.navigate(["password"], navigationExtras);
            //                         }
            //                     }
            //                 }
            //                 this.utility.hideLoading();
            //             }, err => {
            //                 this.utility.hideLoading();
            //                 // this.utility.showMessageAlert("error", err);
            //                 // this.utility.showMessageAlert("error", JSON.stringify(err));
            //             })
            //     }
            // }, (error) => {
            //     console.log(error)
            //     this.afAuth.auth.createUserWithEmailAndPassword(email, password)
            //         .then((user: any) => {
            //             console.log(user);
            //             localStorage.setItem('firebase_user_id', JSON.stringify(user['user']));
            //             let params = {
            //                 mobile: this.mobile_no
            //             }
            //             this.http.post("generateOTP", params).subscribe(
            //                 (res: any) => {

            //                     if (res.success) {
            //                         if (res.message == 'OTP has been sent to your mobile number.' || res.message == 'User is not verified.') {
            //                             this.utility.showMessageAlert("OTP sent!", "OTP has been sent to your mobile number.")
            //                             let navigationExtras: NavigationExtras = {
            //                                 state: {
            //                                     user_id: res.data['user_id'],
            //                                     mobile_no: this.mobile_no
            //                                 },
            //                             };
            //                             this.router.navigate(["verify-otp"], navigationExtras);
            //                         } else if (res.success || res.message == 'User is verified.') {
            //                             if (res.data.length == 0) {
            //                                 this.utility.showMessageAlert("Setup your profile", "You have not setup your profile yet.")
            //                                 this.router.navigate(["sign-up"]);
            //                             } else {
            //                                 let navigationExtras: NavigationExtras = {
            //                                     state: {
            //                                         user_id: res.data['user_id'],
            //                                         mobile_no: this.mobile_no
            //                                     },
            //                                 };
            //                                 this.router.navigate(["password"], navigationExtras);
            //                             }
            //                         }
            //                     }
            //                     this.utility.hideLoading();
            //                 }, err => {
            //                     this.utility.hideLoading();
            //                     // this.utility.showMessageAlert("error", err);
            //                     // this.utility.showMessageAlert("error", JSON.stringify(err));
            //                 })
            //         }, (error) => {
            //             console.log(error)
            //         });
            // });

            this.utility.showLoading();
            let params = {
                mobile_no: this.mobile_no,
                password: this.password,
                device_token: this.utility.device_token == undefined ? 'devicetoken' : this.utility.device_token,
                device_type: this.utility.device_type == undefined ? 'devicetype' : this.utility.device_type

            }
            this.http.post("login", params).subscribe(
                (res: any) => {
                    console.log(res)
                    this.utility.hideLoading();
                    if (res.success == true) {
                        this.utility.showMessageAlert("Welcome " + res.data['user'].user_name + '!', "We are hoping to provide you the best.");
                        this.utility.user = res.data['user'];
                        if (this.utility.user.profile_photo != null) {
                            this.utility.image = this.utility.user.profile_photo;
                        } else {
                            this.utility.image = "assets/imgs/no-profile.png";
                        }
                        localStorage.setItem('user_details', JSON.stringify(res.data['user']));
                        localStorage.setItem('token', JSON.stringify(res.data['token']))
                        this.router.navigateByUrl("/home");
                    } else {
                        this.utility.showMessageAlert("Error", res.message);
                    }
                }, err => {
                    this.utility.hideLoading();

                })

        }
    }

    facebookLogin() {
        this.fb.login(['public_profile', 'user_friends', 'email'])
            .then((res: FacebookLoginResponse) => console.log('Logged into Facebook!', res))
            .catch(e => console.log('Error logging into Facebook', e));

    }

    signup() {
        this.router.navigate(['/sign-up']);
    }

}