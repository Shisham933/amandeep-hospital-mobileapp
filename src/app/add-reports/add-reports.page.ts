import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActionSheetController } from "@ionic/angular";
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import * as AWS from 'aws-sdk';
import { HttpService } from '../http.service';
import { UtilityService } from '../utility.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-add-reports',
  templateUrl: './add-reports.page.html',
  styleUrls: ['./add-reports.page.scss'],
})
export class AddReportsPage implements OnInit {
  public description: string;

  public report_1: string;
  public report_2: string;
  public report_3: string;
  public report_4: string;
  public report_5: string;

  public uploded_report_1: string;
  public uploded_report_2: string;
  public uploded_report_3: string;
  public uploded_report_4: string;
  public uploded_report_5: string;


  constructor(private location: Location, private fileChooser: FileChooser,private camera: Camera, public actionSheetController: ActionSheetController, private router: Router, private http: HttpService, private utility: UtilityService) { }

  ngOnInit() {
  }

  goBack() {
    this.location.back();
  }

  async getPicture(picture_number) {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image Source",
      cssClass: "my-custom-class",
      buttons: [
        {
          text: "Load from Library",
          icon: "images-outline",
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY, picture_number);
          },
        },
        {
          text: "Use Camera",
          icon: "camera",
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA, picture_number);
          },
        },
        {
          text: "Upload PDF reports",
          icon: "document-outline",
          handler: () => {
          this.choosePdf(picture_number);
          },
        },
        {
          text: "Cancel",
          role: "destructive",
          icon: "close",
          handler: () => { },
        },
      ],
    });
    await actionSheet.present();
  }

  choosePdf(picture_number){
    this.fileChooser.open()
  .then(uri => console.log(uri))
  .catch(e => console.log(e));
  }

  public takePicture(sourceType, picture_number) {
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.DATA_URL
    };

    this.camera.getPicture(options).then((imagePath) => {
      //this.image = 'data:image/jpeg;base64,' + imagePath;
     // debugger
      if (picture_number == '1') {
        this.report_1 = 'data:image/jpeg;base64,' + imagePath;
      }
      if (picture_number == '2') {
        this.report_2 = 'data:image/jpeg;base64,' + imagePath;
      }
      if (picture_number == '3') {
        this.report_3 = 'data:image/jpeg;base64,' + imagePath;
      }
      if (picture_number == '4') {
        this.report_4 = 'data:image/jpeg;base64,' + imagePath;
      }
      if (picture_number == '5') {
        this.report_5 = 'data:image/jpeg;base64,' + imagePath;
      }
      let imageName = "report";
      this.uploadImage(imagePath, imageName).then((res: any) => {
        console.log(res)
        if (res.Location) {
          this.utility.hideLoading();
          // this.uploadPictureToServer(res.Location,imagePath);
          if (picture_number == '1') {
            this.uploded_report_1 = res.Location;
          }
          if (picture_number == '2') {
            this.uploded_report_2 = res.Location;
          }
          if (picture_number == '3') {
            this.uploded_report_3 = res.Location;
          }
          if (picture_number == '4') {
            this.uploded_report_4 = res.Location;
          }
          if (picture_number == '5') {
            this.uploded_report_5 = res.Location;
          }
        }

      });
    }, (err) => {
    });
  }

  uploadImage(image, imageName) {
    this.utility.showLoading();
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


  addReport() {
    if (this.description == undefined || this.description == '') {
      this.utility.showMessageAlert("Description required!", "Please write description about your reports")
    } else if (this.uploded_report_1 == undefined || this.uploded_report_1 == '') {
      this.utility.showMessageAlert("Upload report!", "Please upload your reports")
    } else {
      this.utility.showLoading();
      let user = JSON.parse(localStorage.getItem('user_details'));
      let params = {
        "user_id": user.id,
        "description": this.description,
        "report_1": this.uploded_report_1,
        "report_2": this.uploded_report_2 == undefined ? null : this.uploded_report_2,
        "report_3": this.uploded_report_3 == undefined ? null : this.uploded_report_3,
        "report_4": this.uploded_report_4 == undefined ? null : this.uploded_report_4,
        "report_5": this.uploded_report_5 == undefined ? null : this.uploded_report_5,
        "report_type": "png"

      }
      this.http.editProfile("addReports", params).subscribe(
        (res: any) => {
          this.utility.hideLoading();
          if (res.success) {
           this.utility.showMessageAlert("Reports sent to doctor!",res.message);
          //  this.router.navigateByUrl('/profile');
          } else {
            this.utility.showMessageAlert("Error!", res.message);
          }
        }, err => {
          this.utility.hideLoading();
          this.utility.showMessageAlert("Network error!", "Please check your network connection.")

        })
    }
  }

} 
