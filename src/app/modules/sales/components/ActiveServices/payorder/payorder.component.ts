import { Component } from '@angular/core';
import { ActiveservicesComponent } from '../../../pages/activeservices/activeservices.component';

@Component({
  selector: 'app-payorder',
  templateUrl: './payorder.component.html',
  styleUrls: ['./payorder.component.css']
})
export class PayorderComponent {

  titleBtnPrev: string = "Default";
  totalProduct: number = 0;

  constructor(private ActiveServices: ActiveservicesComponent) {

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
