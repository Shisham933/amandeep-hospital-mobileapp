import { Injectable } from '@angular/core';
import { Observable,BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AngularFireDatabase, AngularFireList,AngularFireAction } from "angularfire2/database";

@Injectable({
  providedIn: 'root'
})
export class ChatsService {
 
  constructor(private database: AngularFireDatabase) { }

  sendChatMessage(message) {
    this.database.list('/chats/').push(message);
  }

  getChatUsersList(uid){
    console.log(uid)
    return  this.database.list('/chats', ref => ref.orderByChild('patient_id').equalTo(uid)).valueChanges()
  }
 
  getChatsPerUser(doctor_id,patient_id){
    return  this.database.list('/chats', ref => ref.orderByChild('patient_id').equalTo(patient_id).orderByChild('doctor_id').equalTo(doctor_id)).valueChanges()
  }

}
