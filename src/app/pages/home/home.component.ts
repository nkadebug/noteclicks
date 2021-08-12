import { Component, OnInit } from '@angular/core';
import { Note } from 'src/app/model/note';
import { IdbService } from 'src/app/services/idb.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  notes: Note[] = [];

  totalCount = 0;
  currIndex = 0;
  showPrevBtn = false;
  showNextBtn = false;
  limit = 10;
  
  constructor(private idb: IdbService) { }

  ngOnInit(): void {
    this.idb.notes.where("uid").equals(localStorage.uid).count().then(count => {
      this.totalCount = count;
      this.showNoteList(0);
    });
  }

  

  showNoteList(offset: number) {
    this.idb.notes.where("uid").equals(localStorage.uid).offset(this.totalCount-offset-this.limit).limit(this.limit).toArray().then(arr => {
      this.notes = arr.sort((a,b)=>parseInt(b.id)-parseInt(a.id));
    });

    console.log(this.totalCount,this.currIndex,this.limit);

    this.showNextBtn = this.totalCount > (this.limit+1) * this.currIndex;
    this.showPrevBtn = !!this.currIndex;
  }

  prev() {
    this.currIndex--;
    this.showNoteList(this.currIndex * this.limit);
  }

  next() {
    this.currIndex++;
    this.showNoteList(this.currIndex * this.limit);
  }

}
