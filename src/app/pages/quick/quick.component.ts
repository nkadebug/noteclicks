import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Note } from 'src/app/model/note';
import { AuthService } from 'src/app/services/auth.service';
import { IdbService } from 'src/app/services/idb.service';

@Component({
  selector: 'app-quick',
  templateUrl: './quick.component.html',
  styleUrls: ['./quick.component.scss']
})
export class QuickComponent implements OnInit {

  constructor(private idb: IdbService, private router: Router, private auth: AuthService) {

  }

  ngOnInit(): void {
  }

  width = innerHeight;
  height = innerWidth;
  showControl = true;

  @ViewChild('canvas', { static: true }) canvas: any =
    document.querySelector('#canvas');


  drawCaptured(video: any): void {
    if (video) {
      let _canvas = this.canvas.nativeElement;
      let _video = video.nativeElement;
      _video.pause();
      this.showControl = false;

      _canvas.width = _video.videoWidth;
      _canvas.height = _video.videoHeight;
      _canvas.getContext('2d').drawImage(_video, 0, 0);
      let photo = _canvas.toDataURL();
      // console.log(photo);
      this.addNote(photo);

      setTimeout(() => {
        _video.play();
        this.showControl = true;
      }, 2000);
    } else {
      this.router.navigate(["home"]);
    }
  }

  addNote(photo: string): void {
    let ts = Date.now();
    let note: Note = {
      id: ts + "",
      uid: this.auth.uid,
      trashed: false,
      created_at: ts,
      updated_at: ts,
      photo
    }
    this.idb.notes.add(note);
  }

}
