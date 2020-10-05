import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { AngularAgoraRtcService, Stream } from 'angular-agora-rtc';
import { checkSystemRequirements, getDevices, createClient, createStream, Logger } from 'agora-rtc-sdk';
import { AudioManagement } from '@ionic-native/audio-management/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Platform } from '@ionic/angular';
import { HttpService } from '../http.service';
import { UtilityService } from '../utility.service';


@Component({
  selector: 'app-video-call-appointment',
  templateUrl: './video-call-appointment.page.html',
  styleUrls: ['./video-call-appointment.page.scss'],
})
export class VideoCallAppointmentPage implements OnInit {
  localStream: Stream
  remoteCalls: any = [];
  activeCall: boolean = false;
  audioEnabled: boolean = true;
  videoEnabled: boolean = true;

  token: string;
  udid: string;
  channel_name: string;

  remote_screen: boolean = false;
  local_screen: boolean = true;


  audioDevices: any;
  videoDevices: any;

  user_id: any;
  doctor_id: any;
  appointment_id: any;

  stream_id : any;
  
  constructor(private agoraService: AngularAgoraRtcService,private platform:Platform,private nativeAudio: NativeAudio,public audioman: AudioManagement, private route: ActivatedRoute, private router: Router, private http: HttpService, private utility: UtilityService) {
    this.agoraService.createClient();
    this.route.queryParams.subscribe((params) => {
      this.user_id = this.router.getCurrentNavigation().extras.state.user_id;
      this.doctor_id = this.router.getCurrentNavigation().extras.state.doctor_id;
      this.appointment_id = this.router.getCurrentNavigation().extras.state.appointment_id;
      this.stream_id = this.router.getCurrentNavigation().extras.state.streamId;
      this.channel_name = this.router.getCurrentNavigation().extras.state.channel_name;
    })
  }

  ionViewDidEnter() {
    this.platform.backButton.subscribeWithPriority(9999, () => {
      // do nothing
    })
  }

  ngOnInit() {
    this.setAudioMode();
    this.startCall();
  }

  startCall() {
    this.getDevices();
   }

   setAudioMode() {
    this.audioman.setAudioMode(AudioManagement.AudioMode.NORMAL)
      .then(() => {
       console.log('Device audio mode is now NORMAL');
      })
      .catch((reason) => {
        console.log(reason);
      });
   }

  getDevices() {
    getDevices((devices) => {
      /** @type {?} */
      //    debugger
      console.log(devices)
      let audioDevices = devices.filter(device => {
        return device.kind === 'audioinput' && device.deviceId !== 'default';
      });
      /** @type {?} */
      let videoDevices = devices.filter(device => {
        return device.kind === 'videoinput' && device.deviceId !== 'default';
      });
      this.audioDevices = audioDevices;
      this.videoDevices = videoDevices;
      console.log(this.audioDevices);
      console.log(this.videoDevices);
      console.log("his.channel_name",this.channel_name)
      this.agoraService.client.join(null,this.channel_name, null, (streamID) => { // stream id created
        console.log(streamID);
        let audio = true;
        let video = true;
        let screen = false;
        let cameraId = this.videoDevices[0].deviceId;
        let microphoneId = this.audioDevices[0].deviceId;
        let incoming_id = this.stream_id 
        // this.localStream = this.agoraService.createStream(uid, true, cameraId, microphoneId, true, false); // join stream
        this.localStream = createStream({ incoming_id, audio, cameraId, microphoneId, video, screen })
        console.log("this.localStream", this.localStream);
        var stream = this.localStream
        window.navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
          let videoTrack = stream.getVideoTracks()[0];
          console.log(videoTrack);

          document.querySelector("video").srcObject = stream;
          this.localStream.play('agora_local');
        }).catch(err => console.log(err.name))
        this.localStream.setVideoProfile('720p_3');
        this.subscribeToStreams();
      });

    });
  }

  private subscribeToStreams() {
    this.localStream.on("accessAllowed", () => {
      console.log("accessAllowed");
    });
    // The user has denied access to the camera and mic.
    this.localStream.on("accessDenied", () => {
      console.log("accessDenied");
    });
    this.localStream.init(() => {
      console.log("getUserMedia successfully");
      this.localStream.play('agora_local');
      this.agoraService.client.publish(this.localStream, function (err) {
        console.log("Publish local stream error: " + err);
      });
      this.agoraService.client.on('stream-published', function (evt) {
        console.log("Publish local stream successfully");
      });
    }, function (err) {
      console.log("getUserMedia failed", err);
    });
    this.agoraService.client.on('error', (err) => {
      console.log("Got error msg:", err.reason);
      if (err.reason === 'DYNAMIC_KEY_TIMEOUT') {
        this.agoraService.client.renewChannelKey("", () => {
          console.log("Renew channel key successfully");
        }, (err) => {
          console.log("Renew channel key failed: ", err);
        });
      }
    });
    this.agoraService.client.on('stream-added', (evt) => {
      const stream = evt.stream;
      this.agoraService.client.subscribe(stream, (err) => {
        console.log("Subscribe stream failed", err);
      });
    });
    this.agoraService.client.on('stream-subscribed', (evt) => {
      const stream = evt.stream;
      console.log("agora remote id.....",`agora_remote${stream.getId()}`)
      if (!this.remoteCalls.includes(`agora_remote${stream.getId()}`)) this.remoteCalls.push(`agora_remote${stream.getId()}`);
      setTimeout(() => stream.play(`agora_remote${stream.getId()}`), 2000);
      // this.remote_screen = true;
      // this.local_screen = false;
    });
    this.agoraService.client.on('stream-removed', (evt) => {
      const stream = evt.stream;
      stream.stop();
      this.remoteCalls = this.remoteCalls.filter(call => call !== `#agora_remote${stream.getId()}`);
      console.log(`Remote stream is removed ${stream.getId()}`);
    });
    this.agoraService.client.on('peer-leave', (evt) => {
      const stream = evt.stream;
      if (stream) {
        stream.stop();
        this.remoteCalls = this.remoteCalls.filter(call => call === `#agora_remote${stream.getId()}`);
        console.log(`${evt.uid} left from this channel`);
        this.utility.showMessageAlert("Call ended!","");
        this.router.navigate(["home"])
      }
    });
    console.log("this.remoteCalls.........",this.remoteCalls);
  }

  leave() {
    this.agoraService.client.leave(() => {
      this.activeCall = false;
      this.utility.showMessageAlert("Call ended!","");
      this.router.navigate(["home"])
      console.log("Leavel channel successfully");
    }, (err) => {
      console.log("Leave channel failed");
    });
  }
  toggleAudio() {
    this.audioEnabled = !this.audioEnabled;
    if (this.audioEnabled) this.localStream.enableAudio();
    else this.localStream.disableAudio();
  }
  toggleVideo() {
    this.videoEnabled = !this.videoEnabled;
    if (this.videoEnabled) this.localStream.enableVideo();
    else this.localStream.disableVideo();
  }

 

}
