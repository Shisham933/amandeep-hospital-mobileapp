import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { UtilityService } from '../utility.service';

@Component({
  selector: 'app-chat-with-doctor',
  templateUrl: './chat-with-doctor.page.html',
  styleUrls: ['./chat-with-doctor.page.scss'],
})
export class ChatWithDoctorPage implements OnInit {

  constructor( private http: HttpService,
    public utility: UtilityService) { }

  ngOnInit() {
  }

}
