import { Component, OnInit } from '@angular/core';
import { PendingservicesComponent } from '../../../pages/pendingservices/pendingservices.component';

@Component({
  selector: 'app-services-pay',
  templateUrl: './services-pay.component.html',
  styleUrls: ['./services-pay.component.css']
})
export class ServicesPayComponent implements OnInit {

  constructor(private PendingServices: PendingservicesComponent){}

  ngOnInit(): void {
    
  }

  viewNext(e:any, dom:any) {
    if(e.target.attributes['id'].value != undefined && e.target.attributes['status'].value != undefined && e.target.attributes['name'].value != undefined) {
      this.PendingServices.servicesPendingDisabled = false;
      this.PendingServices.PayPendingDisabled = true;
    }
  }

}
