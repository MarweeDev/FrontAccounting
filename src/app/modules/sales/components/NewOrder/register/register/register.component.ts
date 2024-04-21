import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { OrderService } from 'src/app/core/services/order/order.service';
import { NeworderComponent } from 'src/app/modules/sales/pages/neworder/neworder.component';
import { DataSharedServicesService } from 'src/app/shared/directives/data-shared-services.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  ListOrder: any[] =[];

  constructor(
    private newOrder : NeworderComponent, 
    private app: AppComponent, 
    private DataShared: DataSharedServicesService,
    private router: Router,
    private ApiOrder: OrderService) 
  {

  }

  ngOnInit(): void {
    this.ApiOrder.get().subscribe(data => {
      this.ListOrder = data.result;
    });
  }

  ngAfterContentInit():void {
    //Opciones para el nav
    this.app.listNav = [
      { nombre: 'Nueva orden', url: 'sales/neworder/order', icon: 'fa-solid fa-plus'},
    ];
    this.DataShared.OnSetNav(this.app.listNav);
  }

}
