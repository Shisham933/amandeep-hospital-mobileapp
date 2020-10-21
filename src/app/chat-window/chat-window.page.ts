import { Component, OnInit,Input,ViewChild} from '@angular/core';
import { IonContent,ActionSheetController,Platform } from '@ionic/angular';
import { Router, ActivatedRoute,NavigationExtras } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import * as AWS from 'aws-sdk';
import { FilePath } from '@ionic-native/file-path/ngx';
import { ChatsService } from '../chats.service';
import { HttpService } from '../http.service';
import { UtilityService } from '../utility.service';
import { environment } from '../../environments/environment';
import * as _ from 'lodash';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.page.html',
  styleUrls: ['./chat-window.page.scss'],
})

export class ChatWindowPage implements OnInit {
 @ViewChild(IonContent, { static: false }) content: IonContent;
 @ViewChild('input') messageInput ;
 public chat: any;
 public messages: any = [];
 public sender_id : any;
 public message : string = '';

  constructor(private router:Router,private platform : Platform,private keyboard: Keyboard,public actionSheetController: ActionSheetController,private filePath: FilePath, private base64: Base64, private crop: Crop,  private camera: Camera,private utility:UtilityService,private route:ActivatedRoute,private chats:ChatsService,private http:HttpService) {
    this.route.queryParams.subscribe((params) => {
      let user = JSON.parse(localStorage.getItem('user_details'));
      this.sender_id = user.id;
      this.chat = this.router.getCurrentNavigation().extras.state.chat;
      this.messages = this.router.getCurrentNavigation().extras.state.messages;
     // this.content.scrollToBottom(1500);
    });
    this.platform.resume.subscribe(() => {
      //alert('1');
      this.ngOnInit();
    });
  }

  ngOnInit() {
    let user = JSON.parse(localStorage.getItem('user_details'));
    this.chats.getChatUsersList(user.id).subscribe((res: any) => {
     // localStorage.setItem('chat_lists',JSON.stringify(res));
      this.messages = res.filter(x=> (x.doctor_id ==  this.chat.doctor_id) && (x.patient_id ==  this.chat.patient_id));
      this.content.scrollToBottom(1500);
    }, err => {
    });
  }

  goBack(){
    this.router.navigateByUrl("/chat-lists");
  }

  sendMessage(){
    let message = {
      "doctor_name": this.chat.doctor_name,
      "patient_name": this.chat.patient_name,
      "message": this.message,
      "send_datetime": new Date().toISOString(),
      "patient_firebaseid": this.chat.patient_firebaseid,
      "doctor_firebaseid": this.chat.doctor_firebaseid,
      "doctor_id":this.chat.doctor_id,
      "patient_id": this.chat.patient_id,
      "patient_profile_image": this.chat.patient_profile_image,
      "doctor_profile_image": this.chat.doctor_profile_image,
      "from": "patient",
      "to":"doctor",
      "type":"text"
    }
    this.messages.push(message);
    this.sendChatMessage(message);
    this.message = '';
    setTimeout(()=>{
      this.messageInput.setFocus();
     // this.keyboard.show();
    },100)
    this.content.scrollToBottom(1500);
  }

  sendChatMessage(m) {
    this.chats.sendChatMessage(m);
    
    let params = {
      "id": this.chat.doctor_id,
      "notified-person": "doctor",
      "title": "Dr." + '' + this.chat.doctor_name,
      "message": m.message,
      "data":m
    }
    
    this.http.sendPushNotification("pushNotification", params).subscribe((res: any) => {
      if (res.success) {
        
      }
    }, err => {

    })

  }

  async getPicture() {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image Source",
      cssClass: "my-custom-class",
      buttons: [
        {
          text: "Load from Library",
          icon: "images-outline",
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          },
        },
        {
          text: "Use Camera",
          icon: "camera",
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          },
        }
      ],
    });
    await actionSheet.present();
  }

  public takePicture(sourceType) {
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.DATA_URL
    };

    this.camera.getPicture(options).then((imagePath) => {
     // this.image = 'data:image/jpeg;base64,' + imagePath;
      let imageName = "user-profile";
      this.uploadImage(imagePath, imageName).then((res: any) => {
        if (res.Location) {
          this.sendImage(res.Location);
        }

      });
    }, (err) => {
    });
  }

  uploadImage(image, imageName) {
    //this.utility.showLoading();
    return new Promise((resolve, reject) => {
      const body = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64');;
      const ext = image.split(';')[0].split('/')[1] || 'jpg';
      let date = Date.now();
      const key = imageName + date + "." + 'jpeg';
      this.s3Putimage({ body, mime: `image/${ext}` }, key, 'base64').then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });

    })
  }

  s3Putimage(file, key, encoding) {

    return new Promise((resolve, reject) => {
      let s3 = new AWS.S3({
        accessKeyId: environment.AWS_accesskey,
        secretAccessKey: environment.AWS_secret_key,
        region: 'ap-south-1'
      });

      const params = {
        Body: file.body,
        Bucket: 'amadeephospital-user-images',
        Key: key,
        ACL: 'public-read',
        ContentEncoding: 'base64',
        ContentType: "image/jpeg"
      };


      s3.upload(params, (err, data) => {

        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    })
  }


  sendImage(img){
    let message = {
      "doctor_name": this.chat.doctor_name,
      "patient_name": this.chat.patient_name,
      "message": img,
      "send_datetime": new Date().toISOString(),
      "patient_firebaseid": this.chat.patient_firebaseid,
      "doctor_firebaseid": this.chat.doctor_firebaseid,
      "doctor_id":this.chat.doctor_id,
      "patient_id": this.chat.patient_id,
      "patient_profile_image": this.chat.patient_profile_image,
      "doctor_profile_image": this.chat.doctor_profile_image,
      "from": "patient",
      "to":"doctor",
      "type":"image"
    }
    this.messages.push(message);
    this.sendChatMessage(message);
    this.message = '';
    this.content.scrollToBottom(1500);
  }


}
