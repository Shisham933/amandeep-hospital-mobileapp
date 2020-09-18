import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
// Calendar UI Module
import { CalendarModule } from 'ion2-calendar';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';
import { NgOtpInputModule } from  'ng-otp-input';
import { EmbedVideo } from 'ngx-embed-video';
import { Base64 } from '@ionic-native/base64/ngx';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, HttpClientModule,CalendarModule, NgOtpInputModule,IonicModule.forRoot({mode:'ios'}), AppRoutingModule],
  providers: [
    StatusBar,
    SplashScreen,
    LaunchNavigator,
    EmbedVideo,
    YoutubeVideoPlayer,
    Camera,
    FilePath,
    Crop,
    Base64,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
