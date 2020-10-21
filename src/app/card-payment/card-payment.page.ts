import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-card-payment',
  templateUrl: './card-payment.page.html',
  styleUrls: ['./card-payment.page.scss'],
})
export class CardPaymentPage implements OnInit {

  constructor(private http:HttpService) { }

  ngOnInit() {
  }
  
  selectCurrentDate() {
    let d = new Date();
    console.log(d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate())
    return new Date(new Date().setFullYear(new Date().getFullYear())).toISOString();
  }
  
  payNow(){
    let card = {
      number: '4242424242424242',
      expMonth: 12,
      expYear: 2020,
      cvc: '220'
     }
     this.http.makePayement(card);
  }

}
