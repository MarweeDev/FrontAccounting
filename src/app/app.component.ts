import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  //Estado menu
  statusDisabledMain : boolean = true;
  
  //#region Constructor
  constructor() {
  }

  ngOnInit(): void {
  }
  //#endregion
  
}
