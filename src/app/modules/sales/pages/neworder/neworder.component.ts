import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalModels } from '../../../../core/models/globalModels';
import { AppComponent } from 'src/app/app.component';

const models : GlobalModels = new GlobalModels();

@Component({
  selector: 'app-neworder',
  templateUrl: './neworder.component.html',
  styleUrls: ['./neworder.component.css']
})
export class NeworderComponent implements OnInit  {
  
  title : string | undefined;

  //#region Propiedades
  assignmentDisabled : boolean | undefined;
  orderDisabled : boolean | undefined;
  reserveDisabled : boolean | undefined;
  orderModels = models.order;
  mesaModels = models.mesa;
  productModels = models.product;
  VisibleToask : boolean = false;
  //#endregion

  constructor(private route: ActivatedRoute, private app: AppComponent) {
    this.assignmentDisabled = true;
    this.orderDisabled = false;
    this.reserveDisabled = false;
    this.app.navDisabled = true;
  }

  ngOnInit(): void {
    const titleDOM = this.route.snapshot.routeConfig?.title;
    if(titleDOM){ this.title = titleDOM.toString()}
  }
}
