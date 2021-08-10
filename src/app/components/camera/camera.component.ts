import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss']
})
export class CameraComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input('width') width: Number = 100;
  @Input('height') height: Number = 100;
  @Output() onClose: EventEmitter<any> = new EventEmitter();

  @ViewChild('video', { static: true }) video: any = document.querySelector('#video');

  constraints: any;

  constructor() { }

  ngOnInit() {
    console.log(this.width, this.height);
    this.constraints = {
      audio: false,
      video: {
        width: this.width,
        height: this.height,
        facingMode: { exact: "environment" },
        // frameRate: { ideal: 20, max: 30 } 
      }
    }
  }

  ngAfterViewInit(): void {
    this.initCam({ exact: "environment" });
  }

  ngOnDestroy(): void {
    this.video.nativeElement
      .srcObject.getVideoTracks().forEach((track: MediaStreamTrack) => track.stop());
  }

  initCam(facingMode: any) {
    this.constraints.video.facingMode = facingMode;
    navigator.mediaDevices.getUserMedia(this.constraints).then((stream) => {
      let _video = this.video.nativeElement;
      _video.srcObject = stream;
      _video.play();
    });
  }

  capture() {
    this.onClose.emit(this.video);
  }

  close() {
    this.onClose.emit(null);
  }

  switchCamera() {
    if (this.constraints.video.facingMode == "user") {
      this.initCam({ exact: "environment" });
    } else {
      this.initCam("user");
    }
  }

}
