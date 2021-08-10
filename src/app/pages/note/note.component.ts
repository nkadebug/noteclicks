import { Component, OnInit, ElementRef, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';


@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit, OnDestroy {

  @ViewChild('canvas', { static: true }) canvas: any = document.querySelector('#canvas');
  
  isCameraOpen = false;
  width = 640;
  height = 480;
  placeholderSize = 64;

  constructor(
    private route: ActivatedRoute,
    private storage: AngularFireStorage,
    private db: AngularFireDatabase
  ) { }

  ngOnDestroy(): void {

  }
  
  noteId = "";

  ngOnInit(): void {
    this.route.params.subscribe(params=>{
      console.log(params);
      if(params.id == "new"){
        this.openCamera();
      }else{
        this.noteId = params.id;
      }
    });
  }

  openCamera() {
    this.isCameraOpen = true;
  }

  drawCaptured(video: any): void {
    this.isCameraOpen = false;
    if (video) {
      let _video = video.nativeElement;
      let _canvas = this.canvas.nativeElement;
      _canvas.width = _video.videoWidth;
      _canvas.height = _video.videoHeight;
      _canvas.getContext("2d").drawImage(_video, 0, 0);
    }
  }

  

  drawPlaceholder(e:any){
    let _canvas = this.canvas.nativeElement;
      _canvas.width = this.height;
      _canvas.height = this.width;
      _canvas.getContext('2d').drawImage(
        e.target,  
        0.5*(this.width-this.placeholderSize),
        0.5*(this.height-this.placeholderSize), 
        this.placeholderSize,
        this.placeholderSize
      );
  }

  saveNote(){
    let _canvas = this.canvas.nativeElement;
    _canvas.toBlob((blob:any)=>{
      console.log(blob.size);
      let fileName = moment().format("YY/MM/DD/hhmmss_SSS");
      this.storage.ref(`${localStorage.uid}/${fileName}.jpg`).put(blob).then(()=>{
        this.db.list(`${localStorage.uid}`).push({fileName});
      });
    },'image/jpeg',0.5)
  }

}
