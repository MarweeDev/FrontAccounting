import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payorder',
  templateUrl: './payorder.component.html',
  styleUrls: ['./payorder.component.css']
})
export class PayorderComponent implements OnInit {

  totalProduct: number = 0;
  ListFilter : any[] = [];

  constructor() {
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
  }

  viewOk() {
  }
  viewCancel() {
  }
}
