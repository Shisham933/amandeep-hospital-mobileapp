import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.page.html',
  styleUrls: ['./blogs.page.scss'],
})
export class BlogsPage implements OnInit {

  constructor(private location: Location,private iab: InAppBrowser) { }

  ngOnInit() {
  }

 goBack(){
  this.location.back();
 }

}
