import { Component, OnInit } from '@angular/core';
import { Note } from 'src/app/model/note';
import { AuthService } from 'src/app/services/auth.service';
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
  limit = 9;

  constructor(
    private auth: AuthService,
    private idb: IdbService
  ) { }

  ngOnInit(): void {
    this.auth.user.subscribe(user => {
      if (user) {
        this.idb.notes.where("uid").equals(this.auth.uid).count().then(count => {
          this.totalCount = count;
          this.showNoteList();
        });
      } else {
        this.notes = [];
      }
    });
  }



  showNoteList(offset = 0) {
    offset = this.totalCount - offset - this.limit;
    console.log(offset, this.totalCount);
    this.idb.notes.where("uid").equals(this.auth.uid).offset(offset < 0 ? 0 : offset).limit(offset < 0 ? this.limit + offset : this.limit).toArray().then(arr => {
      this.notes = arr.sort((a, b) => parseInt(b.id) - parseInt(a.id));
    });

    console.log(this.totalCount, this.currIndex, this.limit);

    // this.showNextBtn = this.totalCount > (this.limit + 1) * this.currIndex;
    this.showNextBtn = offset > 0
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
