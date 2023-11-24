import { Component } from '@angular/core';
import { ActiveservicesComponent } from '../../../pages/activeservices/activeservices.component';

@Component({
  selector: 'app-payorder',
  templateUrl: './payorder.component.html',
  styleUrls: ['./payorder.component.css']
})
export class PayorderComponent {

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

  viewPrev() {
    this.ActiveServices.servicesDisabled = true;
    this.ActiveServices.PayDisabled = false;
  }

  viewOk() {
    this.viewPrev();
  }
  viewCancel() {
  }
}
