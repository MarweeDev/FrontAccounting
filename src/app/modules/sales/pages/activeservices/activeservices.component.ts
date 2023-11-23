import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-activeservices',
  templateUrl: './activeservices.component.html',
  styleUrls: ['./activeservices.component.css']
})
export class ActiveservicesComponent implements OnInit {

  //#region Propiedades
  public servicesDisabled : boolean = true;
  public PayDisabled : boolean = false;
  //#endregion

  constructor() {
  }

  ngOnInit(): void {
  }

}
