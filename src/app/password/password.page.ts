import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NavController } from '@ionic/angular';
import { Location } from '@angular/common';
import { HttpService } from '../http.service';
import { UtilityService } from '../utility.service';

@Component({
    selector: 'app-password',
    templateUrl: './password.page.html',
    styleUrls: ['./password.page.scss'],
})
export class PasswordPage implements OnInit {
    public password;
    public user_id;
    public mobile_no;
    constructor(private statusBar: StatusBar,private navCtrl: NavController, private router: Router, private route: ActivatedRoute, private location: Location, private http: HttpService, private utility: UtilityService) {
        this.statusBar.backgroundColorByHexString('#ffffff');
        this.route.queryParams.subscribe((params) => {
            this.user_id = this.router.getCurrentNavigation().extras.state.user_id;
            this.mobile_no = this.router.getCurrentNavigation().extras.state.mobile_no;
        });
    }

    ngOnInit() { }

    forgotPassword() {

        let params = {
            user_id: this.user_id
        }
        this.http.post("resendOTP", params).subscribe(
            (res: any) => {
                this.utility.hideLoading();
                if (res.success) {
                    this.utility.showMessageAlert("OTP sent!",res.message);
                    let navigationExtras: NavigationExtras = {
                        state: {
                            user_id: this.user_id
                        },
                    };
                    this.router.navigate(['/forgot-password'], navigationExtras);
                }
               
            }, err => {
                this.utility.hideLoading();
                this.utility.showMessageAlert("Network error!", "Please check your network connection.")
    
            })
    }

    goBack() {
        this.location.back();
    }

    checkPassword() {
        //this.router.navigate(['/home']);
        if (this.password == undefined) {
            this.utility.showMessageAlert("Password required!",'Please enter password')
        } else {

            this.utility.showLoading();
            let params = {
                user_id: this.user_id,
                password: this.password
            }
            this.http.post("login", params).subscribe(
                (res: any) => {
                    this.utility.hideLoading();
                    if (res.success || res.message == 'Login Successful') {
                        this.utility.showMessageAlert("Welcome " + res.data['user'].user_name + '!',"You are hoping to provide you best services.");
                        this.utility.user = res.data['user'];
                        localStorage.setItem('user_details', JSON.stringify(res.data['user']));
                        localStorage.setItem('token', JSON.stringify(res.data['token']))
                        this.router.navigateByUrl("/home");
                    } else {
                        this.utility.showMessageAlert("Error","You have entered wrong password");
                    }
                   
                }, err => {
                    this.utility.hideLoading();
                    this.utility.showMessageAlert("Setup your profile","You have not setup your profile yet.")
                    let navigationExtras: NavigationExtras = {
                        state: {
                            user_id: this.user_id,
                            mobile_no: this.mobile_no
                        },
                    };
                    this.router.navigate(["sign-up"], navigationExtras);
                })

        }

    }
}