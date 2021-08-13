import { Component, OnInit } from '@angular/core';
import { Note } from 'src/app/model/note';
import { AuthService } from 'src/app/services/auth.service';
import { IdbService } from 'src/app/services/idb.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

  notes: Note[] = [];

  constructor(private idb: IdbService, private auth:AuthService) { }

  ngOnInit(): void {
    this.auth.user.subscribe(user=>{
      if(user){
        this.idb.notes.where({uid:this.auth.uid}).reverse().sortBy('ts').then(arr=>{
          this.notes=arr;
        });
      }
    });
  }

}
