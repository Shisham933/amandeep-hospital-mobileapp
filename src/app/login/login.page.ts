import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import codes from 'country-calling-code';
import { StatusBar } from '@ionic-native/status-bar/ngx';
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
    constructor(private statusBar: StatusBar,private router: Router, private http: HttpService, private utility: UtilityService) {
        this.statusBar.backgroundColorByHexString('#ffffff');
        this.codes = codes;
    }

    ngOnInit() { }

    login() {
        if (this.mobile_no == undefined) {
            this.utility.showMessageAlert("Mobile number required!", "Please enter your mobile number.")
        } else if (this.mobile_no.length != 10) {
            this.utility.showMessageAlert("Invalid mobile number!", "The mobile number you have entered is not valid.")
        } else {
            this.utility.showLoading();
            let params = {
                mobile: '91' + this.mobile_no
            }
            this.http.post("generateOTP", params).subscribe(
                (res: any) => {

                    if (res.success) {
                        if (res.message == 'OTP has been sent to your mobile number.' || res.message == 'User is not verified.') {
                            this.utility.showMessageAlert("OTP sent!", "OTP has been sent to your mobile number.")
                            let navigationExtras: NavigationExtras = {
                                state: {
                                    user_id: res.data['user_id'],
                                    mobile_no: this.mobile_no
                                },
                            };
                            this.router.navigate(["verify-otp"], navigationExtras);
                        } else if (res.success || res.message == 'User is verified.') {
                            if (res.data.length == 0) {
                                this.utility.showMessageAlert("Setup your profile", "You have not setup your profile yet.")
                                this.router.navigate(["sign-up"]);
                            } else {
                                let navigationExtras: NavigationExtras = {
                                    state: {
                                        user_id: res.data['user_id'],
                                        mobile_no: this.mobile_no
                                    },
                                };
                                this.router.navigate(["password"], navigationExtras);
                            }
                        }
                    }
                    this.utility.hideLoading();
                }, err => {
                    console.log("err");
                    this.utility.hideLoading();
                    // this.utility.showMessageAlert("error", err);
                    // this.utility.showMessageAlert("error", JSON.stringify(err));
                })
        }

    }

    signup() {
        this.router.navigate(['/sign-up']);
    }
}