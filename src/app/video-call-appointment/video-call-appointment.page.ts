import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { AngularAgoraRtcService, Stream } from 'angular-agora-rtc';
import { checkSystemRequirements, getDevices, createClient, createStream, Logger } from 'agora-rtc-sdk';
import { AudioManagement } from '@ionic-native/audio-management/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Platform } from '@ionic/angular';
import { HttpService } from '../http.service';
import { UtilityService } from '../utility.service';

declare var apiRTC: any

@Component({
  selector: 'app-video-call-appointment',
  templateUrl: './video-call-appointment.page.html',
  styleUrls: ['./video-call-appointment.page.scss'],
})
export class VideoCallAppointmentPage implements OnInit {
  localStream: Stream;
  stream : any;
  remoteCalls: any = [];
  activeCall: boolean = false;
  audioEnabled: boolean = true;
  videoEnabled: boolean = true;
  speakerEnabled : boolean = false;

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

  stream_id: any;
  call_started : any;
  audio: any;

  /*** WEBRTC */
  showCall: boolean;
  showHangup: boolean;
  showAnswer: boolean;
  showReject: boolean;
  showStatus: boolean;
  showRemoteVideo: boolean = true;
  showMyVideo: boolean = true;

  session;
  webRTCClient;
  incomingCallId = 0;
  myCallId;
  status;
  calleeId;
  /*** */


  constructor(private agoraService: AngularAgoraRtcService, private platform: Platform, private nativeAudio: NativeAudio, public audioman: AudioManagement, private route: ActivatedRoute, private router: Router, private http: HttpService, private utility: UtilityService) {
    this.agoraService.createClient();
    this.route.queryParams.subscribe((params) => {
      this.user_id = this.router.getCurrentNavigation().extras.state.user_id;
      this.doctor_id = this.router.getCurrentNavigation().extras.state.doctor_id;
      this.appointment_id = this.router.getCurrentNavigation().extras.state.appointment_id;
      this.stream_id = this.router.getCurrentNavigation().extras.state.streamId;
      this.channel_name = this.router.getCurrentNavigation().extras.state.channel_name;
      debugger
       /** WEBRTC */
       this.InitializeApiRTC();
       this.nativeAudio.preloadComplex('uniqueI1', 'assets/tone.mp3', 1, 1, 0).then((succ)=>{
         console.log("suu",succ)
       }, (err)=>{
         console.log("err",err)
       });
       /*** */

    });
   
    this.utility.getevent().subscribe((message) => {
      console.log("call:ended",message)
      if (this.audio) {
        this.audio.pause();
        this.audio = null;
      }
      //this.utility.showMessageAlert("Call ended!",message['call:ended']);
      this.router.navigate(["home"])
  });
  }

  ionViewDidEnter() {
    this.platform.backButton.subscribeWithPriority(9999, () => {
      // do nothing
    })
  }


  ngOnInit() {
    // this.setAudioMode();
    // this.startCall();
    this.audio = new Audio();
    this.audio.src = '../../assets/tone/iphone_6-30.mp3';
    this.audio.load();
    //this.playAudio();
  }


  // startCall() {
  //   this.getDevices();
  // }

  // playAudio() {
  //   this.audio.play();
  //   this.audio.loop = true;
  // }


  // setAudioMode() {
  //   this.audioman.setAudioMode(AudioManagement.AudioMode.NORMAL)
  //     .then(() => {
  //       console.log('Device audio mode is now NORMAL');
  //     })
  //     .catch((reason) => {
  //       console.log(reason);
  //     });
  // }

  // getDevices() {
  //   getDevices((devices) => {
  //     /** @type {?} */
  //     //    debugger
  //     console.log(devices)
  //     let audioDevices = devices.filter(device => {
  //       return device.kind === 'audioinput' && device.deviceId !== 'default';
  //     });
  //     /** @type {?} */
  //     let videoDevices = devices.filter(device => {
  //       return device.kind === 'videoinput' && device.deviceId !== 'default';
  //     });
  //     this.audioDevices = audioDevices;
  //     this.videoDevices = videoDevices;
  //     console.log(this.audioDevices);
  //     console.log(this.videoDevices);
  //     console.log("his.channel_name", this.channel_name)
  //     this.agoraService.client.join(null, this.channel_name, null, (streamID) => { // stream id created
  //       console.log(streamID);
  //       let audio = true;
  //       let video = true;
  //       let screen = false;
  //       let cameraId = this.videoDevices[0].deviceId;
  //       let microphoneId = this.audioDevices[0].deviceId;
  //       let incoming_id = this.stream_id
  //       // this.localStream = this.agoraService.createStream(uid, true, cameraId, microphoneId, true, false); // join stream
  //       this.localStream = createStream({ incoming_id, audio, cameraId, microphoneId, video, screen })
  //       console.log("this.localStream", this.localStream);
  //       var stream = this.localStream
  //       window.navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
  //         let videoTrack = stream.getVideoTracks()[0];
  //         console.log(videoTrack);

  //         document.querySelector("video").srcObject = stream;
  //         this.localStream.play('agora_local');
  //       }).catch(err => console.log(err.name))
  //       this.localStream.setVideoProfile('720p_3');
  //       this.subscribeToStreams();
  //     });

  //   });
  // }

  // acceptCall() {
  //   this.startCall();
  //   this.activeCall = true;
  //   if (this.audio) {
  //     this.audio.pause();
  //     this.audio = null;
  //     this.call_started = new Date();
  //   }
  // }

  // private subscribeToStreams() {
  //   this.localStream.on("accessAllowed", () => {
  //     console.log("accessAllowed");
  //   });
  //   // The user has denied access to the camera and mic.
  //   this.localStream.on("accessDenied", () => {
  //     console.log("accessDenied");
  //   });
  //   this.localStream.init(() => {
  //     console.log("getUserMedia successfully");
  //     this.localStream.play('agora_local');
  //     this.agoraService.client.publish(this.localStream, function (err) {
  //       console.log("Publish local stream error: " + err);
  //     });
  //     this.agoraService.client.on('stream-published', function (evt) {
  //       console.log("Publish local stream successfully");
  //     });
  //   }, function (err) {
  //     console.log("getUserMedia failed", err);
  //   });
  //   console.log(" this.localStream.........", this.localStream)
  //   this.agoraService.client.on('error', (err) => {
  //     console.log("Got error msg:", err.reason);
  //     if (err.reason === 'DYNAMIC_KEY_TIMEOUT') {
  //       this.agoraService.client.renewChannelKey("", () => {
  //         console.log("Renew channel key successfully");
  //       }, (err) => {
  //         console.log("Renew channel key failed: ", err);
  //       });
  //     }
  //   });
  //   this.agoraService.client.on('stream-added', (evt) => {
  //     const stream = evt.stream;
  //     this.agoraService.client.subscribe(stream, (err) => {
  //       console.log("Subscribe stream failed", err);
  //     });
  //   });
  //   this.agoraService.client.on('stream-subscribed', (evt) => {
  //     const stream = evt.stream;
  //     this.stream = stream;
  //     console.log("agora remote id.....", `agora_remote${stream.getId()}`)
  //     if (!this.remoteCalls.includes(`agora_remote${stream.getId()}`)) this.remoteCalls.push(`agora_remote${stream.getId()}`);
  //     setTimeout(() => stream.play(`agora_remote${stream.getId()}`), 2000);
  //     // this.remote_screen = true;
  //     // this.local_screen = false;
  //   });
  //   this.agoraService.client.on('stream-removed', (evt) => {
  //     this.localStream.stop();
  //     if (this.audio) {
  //       this.audio.pause();
  //       this.audio = null;
  //     }
  //     this.utility.showMessageAlert("Call ended!", "Call has ended due to poor network connection");
  //     this.router.navigate(["home"])
  //     const stream = evt.stream;
  //     stream.stop();
  //     this.remoteCalls = this.remoteCalls.filter(call => call !== `#agora_remote${stream.getId()}`);
  //     console.log(`Remote stream is removed ${stream.getId()}`);
  //   });
  //   this.agoraService.client.on('peer-leave', (evt) => {
  //     const stream = evt.stream;
  //     if (stream) {
  //       stream.stop();
  //       this.remoteCalls = this.remoteCalls.filter(call => call === `#agora_remote${stream.getId()}`);
  //       console.log(`${evt.uid} left from this channel`);
  //       this.localStream.stop();
  //       if (this.audio) {
  //         this.audio.pause();
  //         this.audio = null;
  //       }
  //       this.utility.showMessageAlert("Call ended!", "");
  //       this.router.navigate(["home"])
  //     }
  //   });
  //   console.log("this.remoteCalls.........", this.remoteCalls);
  // }

  // leave() {
  //   if (this.audio) {
  //     this.audio.pause();
  //     this.audio = null;
  //   }
  //   this.agoraService.client.leave(() => {
  //     this.activeCall = false;
  //     if (this.localStream) {
  //       this.localStream.stop();
  //     }
  //     this.utility.showMessageAlert("Call ended!", "");
  //     this.router.navigate(["home"]);
  //     console.log("Leavel channel successfully");
  //   }, (err) => {
  //     console.log("Leave channel failed");
  //   });
  // }
  // toggleAudio() {
  //   this.audioEnabled = !this.audioEnabled;
  //   if (this.audioEnabled) this.localStream.enableAudio();
  //   else this.localStream.disableAudio();
  // }
  // toggleVideo() {
  //   this.videoEnabled = !this.videoEnabled;
  //   if (this.videoEnabled) this.localStream.enableVideo();
  //   else this.localStream.disableVideo();
  // }
  // toggleSpeaker(){
  //   this.speakerEnabled = !this.speakerEnabled;
  //   if (this.speakerEnabled) this.stream.adjustPlaybackSignalVolume(200);
  //   else this.stream.adjustPlaybackSignalVolume(50);
  // }
  
  InitializeApiRTC() {
    //apiRTC initialization
    apiRTC.init({
      apiKey: "74cc9de88666a26789303547fb5192b8",
      // apiCCId : "2",
      onReady: (e) => {
        this.sessionReadyHandler(e);
      }
    });
  }

  sessionReadyHandler(e) {
    this.myCallId = apiRTC.session.apiCCId;
    this.InitializeControls();
    this.AddEventListeners();
    this.InitializeWebRTCClient();
  }

  InitializeWebRTCClient() {
    this.webRTCClient = apiRTC.session.createWebRTCClient({
      status: "status" //Optionnal
    });
    /*    this.webRTCClient.setAllowMultipleCalls(true);
        this.webRTCClient.setVideoBandwidth(300);
        this.webRTCClient.setUserAcceptOnIncomingCall(true);*/
  }

  InitializeControls() {
    this.showCall = true;
    this.showAnswer = false;
    this.showHangup = false;
    this.showReject = false;
  }

  InitializeControlsForIncomingCall() {
    this.showCall = false;
    this.showAnswer = true;
    this.showReject = true;
    this.showHangup = true;
    this.nativeAudio.loop('uniqueI1').then((succ)=>{
      console.log("succ",succ)
    }, (err)=>{
      console.log("err",err)
    });

  }

  InitializeControlsForHangup() {
    this.showCall = true;
    this.showAnswer = false;
    this.showReject = false;
    this.showHangup = false;
  }

  UpdateControlsOnAnswer() {
    this.showAnswer = false;
    this.showReject = false;
    this.showHangup = true;
    this.showCall = false;
  }

  UpdateControlsOnReject() {
    this.showAnswer = false;
    this.showReject = false;
    this.showHangup = false;
    this.showCall = true;
  }

  RemoveMediaElements(callId) {
    this.webRTCClient.removeElementFromDiv('mini', 'miniElt-' + callId);
    this.webRTCClient.removeElementFromDiv('remote', 'remoteElt-' + callId);
  }

  AddStreamInDiv(stream, callType, divId, mediaEltId, style, muted) {
    let mediaElt = null;
    let divElement = null;

    if (callType === 'audio') {
      mediaElt = document.createElement("audio");
    } else {
      mediaElt = document.createElement("video");
    }

    mediaElt.id = mediaEltId;
    mediaElt.autoplay = true;
    mediaElt.muted = muted;
    mediaElt.style.width = style.width;
    mediaElt.style.height = style.height;

    divElement = document.getElementById(divId);
    divElement.appendChild(mediaElt);

    this.webRTCClient.attachMediaStream(mediaElt, stream);
  }

  AddEventListeners() {
    apiRTC.addEventListener("userMediaSuccess", (e) => {
      this.showStatus = true;
      this.showMyVideo = true;

      this.webRTCClient.addStreamInDiv(e.detail.stream, e.detail.callType, "mini", 'miniElt-' + e.detail.callId, {
        width: "128px",
        height: "96px"
      }, true);

    });

    apiRTC.addEventListener("userMediaError", (e) => {
      this.InitializeControlsForHangup();

      this.status = this.status + "<br/> The following error has occurred <br/> " + e;
    });

    apiRTC.addEventListener("incomingCall", (e) => {
      this.InitializeControlsForIncomingCall();
      this.incomingCallId = e.detail.callId;
    });

    apiRTC.addEventListener("hangup", (e) => {
      if (e.detail.lastEstablishedCall === true) {
        this.InitializeControlsForHangup();
      }
      this.status = this.status + "<br/> The call has been hunged up due to the following reasons <br/> " + e.detail.reason;
      this.RemoveMediaElements(e.detail.callId);
    });

    apiRTC.addEventListener("remoteStreamAdded", (e) => {
      this.webRTCClient.addStreamInDiv(e.detail.stream, e.detail.callType, "remote", 'remoteElt-' + e.detail.callId, {
        width: "300px",
        height: "225px"
      }, false);
    });

    apiRTC.addEventListener("webRTCClientCreated", (e) => {
      console.log("webRTC Client Created");
      this.webRTCClient.setAllowMultipleCalls(true);
      this.webRTCClient.setVideoBandwidth(300);
      this.webRTCClient.setUserAcceptOnIncomingCall(true);

      /*      this.InitializeControls();
            this.AddEventListeners();*/

      //this.MakeCall("729278");
    });

  }

  MakeCall(calleeId) {
    debugger
    console.log(this.calleeId)
    var callId = this.webRTCClient.call(this.calleeId);
    if (callId != null) {
      this.incomingCallId = callId;
      this.showHangup = true;
    }
  }

  HangUp() {
    this.webRTCClient.hangUp(this.incomingCallId);
  }

  AnswerCall(incomingCallId) {
    this.webRTCClient.acceptCall(incomingCallId);
    this.nativeAudio.stop('uniqueI1').then(()=>{},()=>{});

    this.UpdateControlsOnAnswer();
  }

  RejectCall(incomingCallId) {
    this.webRTCClient.refuseCall(incomingCallId);
    this.UpdateControlsOnReject();
    this.RemoveMediaElements(incomingCallId);
  }

  callEnded() {

    let user = JSON.parse(localStorage.getItem('user_details'));

    let params = {
      "user_id": this.user_id,
      "doctor_id": this.doctor_id,
      "uid": this.stream_id,
      "call_started": this.call_started,
      "call_ended": new Date(),
      "ended_by": "Patient"
    }

    console.log("params.............", JSON.stringify(params));

    this.http.videoCallPatient('callDuration', params).subscribe(
      (res: any) => {
        console.log("callDuration  ended call............", JSON.stringify(res));
        if (res.success) {
          this.utility.showMessageAlert("Call ended!", "");
          this.router.navigate(["my-appointments"])
          console.log("Leavel channel successfully");
        }
      }, err => {
        console.log("err.............", err)
        this.utility.hideLoading();
        this.utility.showMessageAlert("Network error!", "Please check your network connection.")
      })
  }




}
