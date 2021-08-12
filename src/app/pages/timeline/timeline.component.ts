import { Component, OnInit } from '@angular/core';
import { Note } from 'src/app/model/note';
import { IdbService } from 'src/app/services/idb.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

  notes: Note[] = [];

  constructor(private idb: IdbService) { }

  ngOnInit(): void {
    this.idb.notes.where({uid:localStorage.uid}).reverse().sortBy('ts').then(arr=>{
      this.notes=arr;
    });
  }

}
