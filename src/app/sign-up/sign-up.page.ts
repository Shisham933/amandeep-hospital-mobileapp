import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HttpService } from '../http.service';
import { UtilityService } from '../utility.service';
import codes from 'country-calling-code';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.page.html',
    styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
    public codes: any;
    public dial_code;
    public user_id;
    public mobile_no;
    public name;
    public email_id;
    public password;
    constructor(private statusBar: StatusBar,private location: Location, private router: Router, private route: ActivatedRoute, private http: HttpService, private utility: UtilityService) {
        this.statusBar.backgroundColorByHexString('#ffffff');
        this.codes = codes;
        this.route.queryParams.subscribe((params) => {
            this.user_id = this.router.getCurrentNavigation().extras.state.user_id;
            this.mobile_no = this.router.getCurrentNavigation().extras.state.mobile_no;
        });

    }

    ngOnInit() { }

    signup() {
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (this.name == undefined) {
            this.utility.showToast("Please enter name")
        } else if (this.email_id == undefined) {
            this.utility.showToast("Please enter email")
        } else if (!this.email_id.match(mailformat)) {
            this.utility.showToast("Please enter valid email address")
        } else if (this.password == undefined) {
            this.utility.showToast("Please enter password")
        } else {
            this.utility.showLoading();
            let params = {
                user_id: this.user_id,
                name: this.name,
                email: this.email_id,
                password: this.password
            }
            this.http.post("register", params).subscribe(
                (res: any) => {
                    this.utility.hideLoading();
                    if (res.success || res.message == 'Details updated Successfully') {
                        this.utility.showMessageAlert("Welcome " + res.data['user'].user_name + '!',"You are hoping to provide you best services.");
                        this.utility.user = res.data['user'];
                        localStorage.setItem('user_details', JSON.stringify(res.data['user']));
                        localStorage.setItem('token', JSON.stringify(res.data['token']))
                        this.router.navigate(["home"]);

                    } else {
                        this.utility.showMessageAlert("Error ",res.message);
                    }

                }, err => {
                    this.utility.hideLoading();
                    this.utility.showMessageAlert("Network error!", "Please check your network connection.")
                })
        }

    }

    goBack() {
        this.location.back();
    }

}