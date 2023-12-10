import { Component, OnInit } from '@angular/core';
import { PendingservicesComponent } from '../../../pages/pendingservices/pendingservices.component';

@Component({
  selector: 'app-paypending',
  templateUrl: './paypending.component.html',
  styleUrls: ['./paypending.component.css']
})
export class PaypendingComponent implements OnInit {

  totalProduct: number = 0;
  ListFilter : any[] = [];

  constructor(private PendingServices: PendingservicesComponent) {
    this.ListFilter = [
      { id: 1, nombre: 'Efectivo' },
      { id: 2, nombre: 'Tarjeta' },
      { id: 3, nombre: 'Transferencia' }
    ];
  }

  ngOnInit(): void {
    
  }

  viewPrev() {
    this.PendingServices.servicesPendingDisabled = true;
    this.PendingServices.PayPendingDisabled = false;
  }

  viewOk() {
    this.viewPrev();
  }
  viewCancel() {
  }
}

