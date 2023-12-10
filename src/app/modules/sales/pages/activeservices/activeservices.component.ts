import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';

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

  constructor(private app: AppComponent) {
    this.app.navDisabled = true;
  }

  ngOnInit(): void {
  }

}
