import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';
import { LocationList } from 'aws-sdk/clients/directconnect';

@Component({
  selector: 'app-my-reports',
  templateUrl: './my-reports.page.html',
  styleUrls: ['./my-reports.page.scss'],
})
export class MyReportsPage implements OnInit {

  constructor(private router: Router,private location:Location) { }

  ngOnInit() {
  }
  
  goBack() {
    this.location.back();
  }

  addreport(){
    this.router.navigateByUrl('/add-reports');
  }

}
