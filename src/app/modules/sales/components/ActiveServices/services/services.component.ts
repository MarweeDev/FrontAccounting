import { Component, OnInit } from '@angular/core';
import { ActiveservicesComponent } from '../../../pages/activeservices/activeservices.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {

  constructor(private ActiveServices: ActiveservicesComponent, private router: Router){}

  ngOnInit(): void {
    let servicesPendingDisabled_ = localStorage.getItem("servicesPendingDisabled");
    let PayPendingDisabled_ = localStorage.getItem("PayPendingDisabled");
    if(servicesPendingDisabled_ != null && servicesPendingDisabled_ != undefined &&
      servicesPendingDisabled_ == "false")
    {
      this.ActiveServices.servicesDisabled = false;
      localStorage.removeItem("servicesPendingDisabled");
      localStorage.removeItem("PayPendingDisabled");
    }
  }

  viewNext(e:any, dom:any) {
    if(e.target.attributes['id'].value != undefined && e.target.attributes['status'].value != undefined && e.target.attributes['name'].value != undefined) {
      this.ActiveServices.servicesDisabled = false;
      this.router.navigate(['/sales/payments']);
    }
  }

}
