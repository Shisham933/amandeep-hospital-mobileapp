import { Injectable } from "@angular/core";
// import { Http, RequestOptions, URLSearchParams } from "@angular/http";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Stripe } from '@ionic-native/stripe/ngx';
import { UtilityService } from './utility.service';

@Injectable({
  providedIn: "root",
})
export class HttpService {

  private testingUrl: string = "http://testing.isocare.in/public/api/";

  private url: string = this.testingUrl;


  constructor(private http: HttpClient, private stripe: Stripe, private utility: UtilityService, private router: Router) {
    // this.getLocations('allLocations');
  }

  getWithoutBaseUrl(endpoint: string) {
    return this.http.get(endpoint);
  }

  get(endpoint: string, params?: any) {
    return this.http.get(this.url + endpoint);
  }

  post(endpoint: string, body: any) {
    console.log(endpoint);
    console.log(body)
    return this.http.post(this.url + endpoint, body);
  }

  put(endpoint: string, body: any) {
    return this.http.put(this.url + endpoint, body);
  }

  delete(endpoint: string, body: any) {
    return this.http.post(this.url + endpoint, body);
  }

  patch(endpoint: string, body: any) {
    return this.http.put(this.url + endpoint, body);
  }

  getLocations(endpoint: string) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      })
    };
    // this.http.get(this.url + endpoint, httpOptions).subscribe((res : any) => {
    //   // let data = JSON.parse(res)
    //    if(res.status == "Token is Expired"){
    //        this.utility.showMessageAlert("Token expired!","Please login again");
    //        this.router.navigateByUrl("/login");
    //   }else{
    //     this.utility.locations = res['data']
    //     this.utility.locations.map((x, i) => {
    //       x.choose = false;
    //     })
    //   }

    // }
    // );
    return this.http.get(this.url + endpoint, httpOptions);
  }

  getSpeciality(endpoint: string) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      })
    };
    return this.http.get(this.url + endpoint, httpOptions);
  }

  getDoctorsLocationwise(endpoint: string, body: any) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      })
    };
    return this.http.get(this.url + endpoint, httpOptions);
  }

  getDoctorTimeslot(endpoint: string, body: any) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      })
    };
    return this.http.get(this.url + endpoint, httpOptions);
  }

  addPatient(endpoint: string, body: any) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      })
    };
    return this.http.post(this.url + endpoint, body, httpOptions);
  }

  confirmAppointment(endpoint: string, body: any) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      })
    };
    return this.http.post(this.url + endpoint, body, httpOptions);
  }

  editProfile(endpoint: string, body: any) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      })
    };
    return this.http.post(this.url + endpoint, body, httpOptions);
  }



  getMyAppointments(endpoint: string) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      })
    };
    return this.http.get(this.url + endpoint, httpOptions);
  }

  getYoutubeVideos(endpoint: string) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      })
    };
    return this.http.get(this.url + endpoint, httpOptions);
  }

  getMyReports(endpoint: string) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      })
    };
    return this.http.get(this.url + endpoint, httpOptions);
  }

  addQuery(endpoint: string, body: any) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      })
    };
    return this.http.post(this.url + endpoint, body, httpOptions);
  }

  videoCallPatient(endpoint: string, body: any) {
    console.log(body)
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      })
    };
    return this.http.post(this.url + endpoint, body, httpOptions);
  }

  getAllDoctors(endpoint) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      })
    };
    return this.http.get(this.url + endpoint, httpOptions);
  }

  getChatSubscriptionStatus(endpoint) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      })
    };
    return this.http.get(this.url + endpoint, httpOptions);
  }

  buyChatSubscription(endpoint: string, body: any) {
    console.log(body)
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      })
    };
    return this.http.post(this.url + endpoint, body, httpOptions);
  }

  sendPushNotification(endpoint: string, body: any) {
    console.log(body)
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      })
    };
    return this.http.post(this.url + endpoint, body, httpOptions);
  }

  makePayement(card) {
    this.stripe.setPublishableKey('pk_test_51HY4PWGxS7HD5LRgl5KhFtxE52opZIcvtAbE5qqeoo2rt5kQJxiIUJ9tsStai5yNldou1fjEROeYQNlzQ8BUrPi400W1MBjnEa');
    this.stripe.createCardToken(card)
      .then(token => {
        console.log(token.id)
        return token
      })
      .catch(error =>{
        console.error(error)
      });
  }

}