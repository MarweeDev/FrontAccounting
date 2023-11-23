import { Component, OnInit } from '@angular/core';
import { ActiveservicesComponent } from '../../../pages/activeservices/activeservices.component';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {

  constructor(private ActiveServices: ActiveservicesComponent){}

  ngOnInit(): void {
    
  }

  viewNext(e:any, dom:any) {
    if(e.target.attributes['id'].value != undefined && e.target.attributes['status'].value != undefined && e.target.attributes['name'].value != undefined) {
      this.ActiveServices.servicesDisabled = false;
      this.ActiveServices.PayDisabled = true;
    }
  }

}
