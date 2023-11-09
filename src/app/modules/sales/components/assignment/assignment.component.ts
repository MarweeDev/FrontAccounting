import { Component, OnInit } from '@angular/core';
import { NeworderComponent } from '../../pages/neworder/neworder.component';
import { ProductDTO } from '../../../../core/models/product';
import { DataSharedServicesService } from 'src/app/shared/directives/data-shared-services.service';
import { EstadoDTO } from 'src/app/core/models/estado';

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.css']
})
export class AssignmentComponent implements OnInit {

  VisibleAlert : boolean = false;
  VisibleAlertDescar : boolean = false;
  fecha ?: string;
  idMesa : number = 0;
  ListProduct: ProductDTO[] = [];
  valueCount : boolean = false;

  //#region propietari
  ListFilter : EstadoDTO[] = [];
  //#endregion

  constructor(private newOrder : NeworderComponent, private DataShared: DataSharedServicesService) {
    const DateTime = new Date();
    this.fecha = DateTime.getDate() + "-" + Number(DateTime.getMonth() + 1) + "-" + DateTime.getFullYear();
  }

  ngOnInit(): void {
    this.OnSetValueList();
  }

  OnSetValueList(){
    //Cargar filtros
    this.ListFilter = [
      { id: 4, nombre: 'Disponible' },
      { id: 5, nombre: 'Reservado' },
      { id: 6, nombre: 'Descatado' }
    ];

    this.DataShared.OnSetList(this.ListFilter); 
  }

  viewNext(e:any, dom:any) {
    if(e.target.attributes['id'].value != undefined && e.target.attributes['status'].value != undefined && e.target.attributes['name'].value != undefined) {
      
      this.newOrder.mesaModels.id = e.target.attributes['id'].value;
      this.newOrder.mesaModels.numero = e.target.attributes['id'].value;
      this.newOrder.mesaModels.nombre = e.target.attributes['name'].value;
      
      switch (e.target.attributes['status'].value) {
        case "Disponible":
          this.VisibleAlert = false;
          this.VisibleAlertDescar = false;

          this.newOrder.assignmentDisabled = false;
          this.newOrder.orderDisabled = true;
          break;

        case "Reservado":
          this.VisibleAlert = true;
          this.VisibleAlertDescar = false;
          break;
        
        case "Descartado":
          this.VisibleAlert = false;
          this.VisibleAlertDescar = true;
          break;
      }
    }
  }
  viewPrev() {
    this.newOrder.assignmentDisabled = true;
    this.newOrder.orderDisabled = false;
  }

  viewPrevModal() {
    this.VisibleAlert = false;
    this.VisibleAlertDescar = false;
  }
  viewReserverModal(){
    if (this.newOrder.mesaModels.id != undefined && this.newOrder.mesaModels.nombre != undefined) {
      this.VisibleAlert = false;
      this.VisibleAlertDescar = false;

      //Cambiar estado de la mesa reservada - modal mostrando lista de con la información de las reservas
      this.idMesa = this.newOrder.mesaModels.id;
      this.newOrder.reserveDisabled = true;
      this.newOrder.assignmentDisabled = false;
      this.newOrder.orderDisabled = false;
    }
    else {
      this.VisibleAlert = false;
      this.VisibleAlertDescar = false;
      this.newOrder.reserveDisabled = true;
      this.newOrder.assignmentDisabled = true;
      this.newOrder.orderDisabled = false;
    }
  }
  viewCancelModal() {
    this.VisibleAlert = false;
    this.VisibleAlertDescar = false;

    //Aquí va logica para cambiar el estado de la mesa a disponible - servicio
  }
  viewOkModal() {
    if (this.newOrder.mesaModels.id != undefined && this.newOrder.mesaModels.nombre != undefined) {
      this.VisibleAlert = false;
      this.VisibleAlertDescar = false;
      this.newOrder.assignmentDisabled = false;
      this.newOrder.orderDisabled = true;

      //Cambiar estado de la mesa
    }
    else {
      this.VisibleAlert = false;
      this.VisibleAlertDescar = false;
    }
  }
  viewOkSuccessModal(){
    if (this.newOrder.mesaModels.id != undefined && this.newOrder.mesaModels.nombre != undefined) {
      this.VisibleAlert = false;
      this.VisibleAlertDescar = false;
      this.newOrder.assignmentDisabled = false;
      this.newOrder.orderDisabled = true;

      //Cambiar estado de la mesa
    }
    else {
      this.VisibleAlert = false;
      this.VisibleAlertDescar = false;
    }
  }
}
