import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { ChatsService } from '../chats.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-chat-lists',
  templateUrl: './chat-lists.page.html',
  styleUrls: ['./chat-lists.page.scss'],
})
export class ChatListsPage implements OnInit {
  public showSearchbar: boolean = false;
  public chat_list: any = [];
  public searchArray : any = [];
  constructor(private router: Router, private platform:Platform,public chats: ChatsService,) {
    if (JSON.parse(localStorage.getItem('chat_lists'))) {
      let chat_list = _.orderBy(JSON.parse(localStorage.getItem('chat_lists')), ['send_datetime'], ['desc']);
      this.chat_list = _.uniqBy(chat_list, 'patient_id');
    }
    this.platform.backButton.subscribeWithPriority(9999, () => {
      // do nothing
      this.goBack();
    })
  }

  ngOnInit() {
    let user = JSON.parse(localStorage.getItem('user_details'));
    console.log(user,"user");
    debugger
    this.chats.getChatUsersList(user.id).subscribe((res: any) => {
      console.log(res)
      let chat_list = _.orderBy(res, ['send_datetime'], ['desc']);;
      this.chat_list = _.uniqBy(chat_list, 'patient_id');
      localStorage.setItem('chat_lists', JSON.stringify(res));
      this.searchArray = this.chat_list;
    }, err => {
    });
  }

  goBack() {
    this.router.navigateByUrl('/home');
  }

  searchPatient() {
    this.showSearchbar = true;
  }

  search(searchInput) {
    if (searchInput.target.value != null) {
      this.chat_list = this.searchArray.filter(function (ele, i, array) {
        let arrayelement = ele.doctor_name.toLowerCase();
        return arrayelement.includes(searchInput.target.value)
      })
    } else {
      this.chat_list = this.searchArray;
    }

  }

  stopSearch() {
    this.chat_list = this.searchArray;
    this.showSearchbar =  false;
  }

  goToChatWindow(chat){
    if(JSON.parse(localStorage.getItem('chat_lists'))){
      let chats = JSON.parse(localStorage.getItem('chat_lists'));
      var messages = chats.filter(x=> x.patient_id ==  chat.patient_id)
    }
    let navigationExtras: NavigationExtras = {
      state: {
        chat: chat,
        messages:messages
      },
    };
     this.router.navigateByUrl('/chat-window',navigationExtras)
  }
}
