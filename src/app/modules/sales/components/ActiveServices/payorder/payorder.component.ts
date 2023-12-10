import { Component, OnInit } from '@angular/core';
import { ActiveservicesComponent } from '../../../pages/activeservices/activeservices.component';
import { PendingservicesComponent } from '../../../pages/pendingservices/pendingservices.component';

@Component({
  selector: 'app-payorder',
  templateUrl: './payorder.component.html',
  styleUrls: ['./payorder.component.css']
})
export class PayorderComponent implements OnInit {

  totalProduct: number = 0;
  ListFilter : any[] = [];

  constructor(private ActiveServices: ActiveservicesComponent) {
    this.ListFilter = [
      { id: 1, nombre: 'Efectivo' },
      { id: 2, nombre: 'Tarjeta' },
      { id: 3, nombre: 'Transferencia' },
      { id: 3, nombre: 'Pendiente' }
    ];
  }

  ngOnInit(): void {
    
  }

  viewPrev() {
    this.ActiveServices.servicesDisabled = true;
    this.ActiveServices.PayDisabled = false;
    /*this.PendingServices.servicesPendingDisabled = true;
    this.PendingServices.PayPendingDisabled = false;*/
  }

  viewOk() {
    this.viewPrev();
  }
  viewCancel() {
  }
}
