import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-bi',
  templateUrl: './bi.component.html',
  styleUrls: ['./bi.component.scss']
})
export class BiComponent implements OnInit {

  @Input('icon') icon = "";
  @Input('size') size:number = 16;

  constructor() { }

  ngOnInit(): void {
  }

}
