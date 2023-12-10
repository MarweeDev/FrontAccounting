import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-pendingservices',
  templateUrl: './pendingservices.component.html',
  styleUrls: ['./pendingservices.component.css']
})
export class PendingservicesComponent implements OnInit {

  //#region Propiedades
  public servicesPendingDisabled : boolean = true;
  public PayPendingDisabled : boolean = false;
  //#endregion

  constructor(private app: AppComponent) {
    this.app.navDisabled = true;
  }

  ngOnInit(): void {
  }

}
