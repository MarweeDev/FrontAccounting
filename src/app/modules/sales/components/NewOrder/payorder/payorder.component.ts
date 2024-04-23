import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { DataSharedServicesService } from 'src/app/shared/directives/data-shared-services.service';

@Component({
  selector: 'app-payorder',
  templateUrl: './payorder.component.html',
  styleUrls: ['./payorder.component.css']
})
export class PayorderComponent implements OnInit {

  totalProduct: number = 0;
  ListFilter : any[] = [];

  constructor(
    private app: AppComponent, 
    private DataShared: DataSharedServicesService,) {
      
    this.ListFilter = [
      { id: 1, nombre: 'Efectivo' },
      { id: 2, nombre: 'Tarjeta' },
      { id: 3, nombre: 'Transferencia' },
      { id: 3, nombre: 'Pendiente' }
    ];
  }

  ngOnInit(): void {
    
  }

  ngAfterContentInit():void {
    //Opciones para el nav
    this.app.listNav = [
      { nombre: 'Cancelar pago', url: 'sales/neworder', type: "btn-info"},
      { nombre: 'Nueva orden', url: 'sales/neworder/order', icon: 'fa-solid fa-plus', type: "btn-companyTwo"},
    ];
    this.DataShared.OnSetNav(this.app.listNav);
  }

  viewPrev() {
  }

  viewOk() {
  }
  viewCancel() {
  }
}
