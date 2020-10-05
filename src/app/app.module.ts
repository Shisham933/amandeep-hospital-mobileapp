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
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { AudioManagement } from '@ionic-native/audio-management/ngx';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { AngularAgoraRtcModule, AgoraConfig } from 'angular-agora-rtc';

const agoraConfig: AgoraConfig = {
  AppID: '3a858c37dd19440a9bb6e7ecd50b6ca9',
};

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, HttpClientModule,CalendarModule, NgOtpInputModule,AngularAgoraRtcModule.forRoot(agoraConfig),IonicModule.forRoot({mode:'ios'}), AppRoutingModule],
  providers: [
    StatusBar,
    SplashScreen,
    LaunchNavigator,
    EmbedVideo,
    YoutubeVideoPlayer,
    Camera,
    FilePath,
    AndroidPermissions,
    BackgroundMode,
    AudioManagement,
    NativeAudio,
    Crop,
    FileChooser,
    Base64,
    Push,
    Media,
    InAppBrowser,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
