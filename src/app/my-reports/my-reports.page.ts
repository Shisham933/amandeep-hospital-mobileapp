import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';
import { Downloader, DownloadRequest,NotificationVisibility } from '@ionic-native/downloader/ngx';
import { HttpService } from '../http.service';
import { UtilityService } from '../utility.service';

@Component({
  selector: 'app-my-reports',
  templateUrl: './my-reports.page.html',
  styleUrls: ['./my-reports.page.scss'],
})
export class MyReportsPage implements OnInit {
  public reports : any = [];
  constructor(private route:ActivatedRoute,private router: Router,private downloader: Downloader,private location:Location,private http: HttpService, private utility: UtilityService) { 
    this.route.queryParams.subscribe((params) => {
      this.getMyReports();
    })
  }

  ngOnInit() {
  }
  
  goBack() {
    this.location.back();
  }

  addreport(){
    this.router.navigateByUrl('/add-reports');
  }

  getMyReports(){
    this.utility.showLoading();
    let user = JSON.parse(localStorage.getItem('user_details'));
    this.http.getMyReports("allReports/" + "user/" + user.id).subscribe((res: any) => {
     
      if (res.success) {
        this.reports = res.data;
        this.reports.map(x=>{
          x.type = x.report.split('.').pop(); 
        })
        console.log(this.reports)
        this.utility.hideLoading();
      } else {
        this.utility.hideLoading();
        this.utility.showMessageAlert("No Reports Added!", "You have not added any reports.");
      }
    }, err => {
      this.utility.hideLoading();
      this.utility.showMessageAlert("Error", "Something went wrong");
    })
  }



  downloadReport(uri){
    console.log(uri)
    console.log(uri.split('/')[1])
    var request: DownloadRequest = {
      uri: uri,
      title: 'Amandeep Hospital Reports',
      description: '',
      mimeType: '',
      visibleInDownloadsUi: true,
      notificationVisibility: NotificationVisibility.VisibleNotifyCompleted,
      destinationInExternalFilesDir: {
          dirType: 'Downloads',
          subPath: uri.split('/')[1]
      }
  };


this.downloader.download(request)
          .catch((error: any) => console.error(error));
  }

}
