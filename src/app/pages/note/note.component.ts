import {
  Component,
  OnInit,
  ElementRef,
  AfterViewInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import * as FileSaver from 'file-saver';
import { AngularFirestore } from '@angular/fire/firestore';
import { Note } from 'src/app/model/note';
import { IdbService } from 'src/app/services/idb.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'],
})
export class NoteComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvas: any =
    document.querySelector('#canvas');

  isCameraOpen = false;
  width = 640;
  height = 480;
  placeholderSize = 64;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storage: AngularFireStorage,
    private db: AngularFireDatabase,
    private fs: AngularFirestore,
    private idb: IdbService
  ) {}

  ngOnDestroy(): void {}

  newNote = true;
  noteId = '';
  noteFrom = new FormGroup({
    description: new FormControl(''),
  });

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      console.log(params);
      this.newNote = params.id == 'new';
      if (params.id == 'new') {
        this.drawPlaceholder();
        this.openCamera();
      } else {
        this.noteId = params.id;
        this.loadNote(params.id);
      }
    });
  }

  openCamera() {
    this.isCameraOpen = true;
  }

  captured = false;

  drawCaptured(video: any): void {
    this.isCameraOpen = false;
    this.captured = !!video;
    if (video) {
      let _video = video.nativeElement;
      let _canvas = this.canvas.nativeElement;
      _canvas.width = _video.videoWidth;
      _canvas.height = _video.videoHeight;
      _canvas.getContext('2d').drawImage(_video, 0, 0);
      if (!this.noteId) this.noteId = Date.now() + '';
    }
  }

  drawPlaceholder() {
    let _canvas = this.canvas.nativeElement;
    _canvas.width = this.height;
    _canvas.height = this.width;
    let img = new Image();
    img.onload = () => {
      _canvas
        .getContext('2d')
        .drawImage(
          img,
          0.5 * (this.height - this.placeholderSize),
          0.5 * (this.width - this.placeholderSize),
          this.placeholderSize,
          this.placeholderSize
        );
    };
    img.src = 'assets/bsi/camera.svg';
  }

  currNote: Note | null = null;

  loadNote(id: string) {
    this.idb.notes.get(id).then((note) => {
      if (note) {
        this.currNote = note;
        if (note.photo) {
          let _canvas = this.canvas.nativeElement;
          _canvas.width = this.height;
          _canvas.height = this.width;

          let img = new Image();
          img.onload = () => {
            _canvas.getContext('2d').drawImage(img, 0, 0);
          };
          img.src = note.photo;
        }
        this.noteFrom.setValue({ description: note.description });
      }
    });
  }

  saveNote() {
    let _canvas = this.canvas.nativeElement;

    let ts = Date.now();

    if (this.currNote) {
      this.currNote.updated_at = ts;
      this.currNote.photo = this.captured
        ? _canvas.toDataURL('image/jpeg', 0.5)
        : null;
      this.currNote.description = this.noteFrom.value.description;
    } else {
      this.currNote = {
        id: this.noteId,
        created_at: ts,
        updated_at: ts,
        photo: this.captured ? _canvas.toDataURL('image/jpeg', 0.5) : null,
        description: this.noteFrom.value.description,
        uid: localStorage.uid,
        trashed: false,
      };
    }

    this.idb.notes
      .put(this.currNote)
      .then(() => {
        this.router.navigate(['']);
      })
      .catch((e) => {
        console.log(e);
      });

    // _canvas.toBlob((blob:any)=>{
    //   console.log(blob.size);
    //   let fileName = moment().format("YY/MM/DD/hhmmss_SSS");
    //   FileSaver.saveAs(blob,fileName+'.jpg');
    //   // this.storage.ref(`${localStorage.uid}/${fileName}.jpg`).put(blob).then(()=>{
    //   //   this.db.list(`${localStorage.uid}`).push({fileName});
    //   // });
    // },'image/jpeg',0.5)
  }

  trashNote() {
    this.idb.notes
      .get(this.noteId)
      .then((note) => {
        if (note) {
          note.trashed = true;
          this.idb.notes
            .put(note)
            .then(() => {
              this.router.navigate(['']);
            })
            .catch((e) => {
              console.log(e);
            });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }
}
