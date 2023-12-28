import { Component, OnInit } from '@angular/core';
import { NeworderComponent } from '../../../pages/neworder/neworder.component';
import { ProductDTO } from '../../../../../core/models/product';
import { DataSharedServicesService } from 'src/app/shared/directives/data-shared-services.service';
import { EstadoDTO } from 'src/app/core/models/estado';
import { MesaDTO } from 'src/app/core/models/mesa';

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.css']
})
export class AssignmentComponent implements OnInit {

  searchTerm : string = '';

  VisibleAlert : boolean = false;
  VisibleAlertDescar : boolean = false;
  VisibleAlertClient : boolean = false;
  fecha ?: string;
  idMesa : number = 0;
  ListProduct: ProductDTO[] = [];
  valueCount : boolean = false;

  //#region propietari
  ListFilter : EstadoDTO[] = [];
  ListMesaData : MesaDTO[] = [];
  //#endregion

  constructor(private newOrder : NeworderComponent, private DataShared: DataSharedServicesService) {
    const DateTime = new Date();
    this.fecha = DateTime.getDate() + "-" + Number(DateTime.getMonth() + 1) + "-" + DateTime.getFullYear();
  }

  ngOnInit(): void {
    this.OnSetValueList();
    this.OnReloadSearch();
  }

  OnReloadSearch() {
    this.DataShared.OnGet().subscribe((list: any) => {
      this.searchTerm = list;

      if (list == undefined || list == null || list == "") {
        this.ListMesaData.forEach(item => {
          let element :any = document.getElementById('card-assig-' + item.id);
          if(element != null)
            element.removeAttribute("style");
        });
      }
      else {
        let rows = this.ListMesaData.filter(item => !item.nombre?.toLowerCase().includes(list.toLowerCase()));
        if(rows.length > 0) {
          rows.forEach(item => {
            let element :any = document.getElementById('card-assig-' + item.id);
            element.style = "display: none;"
          });
        }
      }
    });
  }

  OnSetValueList(){
    //Cargar filtros
    this.ListFilter = [
      { id: 4, nombre: 'Disponible' },
      { id: 5, nombre: 'Reservado' },
      { id: 6, nombre: 'Descatado' }
    ];

    //Cargar mesas
    this.ListMesaData = [
      { id: 1, numero: 10, nombre: 'Mesa familiar', capacidad: 6, estado_mesa : 4  },
      { id: 2, numero: 1, nombre: 'Mesa doble', capacidad: 2, estado_mesa : 5  },
      { id: 3, numero: 5, nombre: 'Mesa barra', capacidad: 4, estado_mesa : 6  },
    ]; 
  }

  viewNext(e:any, status:any, name:any, number:any) {
    if(e.target.attributes['id'].value != undefined && status != undefined && name != undefined && number != undefined) {
      
      this.newOrder.mesaModels.id = e.target.attributes['id'].value.replace("card-", "");
      this.newOrder.mesaModels.numero = number;
      this.newOrder.mesaModels.nombre = name;
      
      switch (status.toString()) {
        case "4": //Disponible
          this.VisibleAlert = false;
          this.VisibleAlertDescar = false;
          this.VisibleAlertClient = true;
          break;

        case "5": //Reservado
          this.VisibleAlert = true;
          this.VisibleAlertDescar = false;
          this.VisibleAlertClient = false;
          break;
        
        case "6": //Descartado
          this.VisibleAlert = false;
          this.VisibleAlertDescar = true;
          this.VisibleAlertClient = false;
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
    this.VisibleAlertClient = false;
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
  viewOkClientModal() {
    let element :any = document.getElementById('txt_client');
    let elementSpan :any = document.getElementById('alert_txt_client');
    if (element != undefined && elementSpan != undefined) {
      if (this.newOrder.mesaModels.id != undefined && this.newOrder.mesaModels.nombre != undefined) {

        if (element.value != undefined && element.value != "") {
          this.VisibleAlert = false;
          this.VisibleAlertDescar = false;
          this.VisibleAlertClient = false;
          this.newOrder.assignmentDisabled = false;
          this.newOrder.orderDisabled = true;
          this.newOrder.orderModels.nombre_cliente = element.value;
          elementSpan.style = "display: none;";
        }
        else {
          elementSpan.style = "display: unset;";
          setTimeout(() => {
            elementSpan.style = "display: none;";
          }, 3000);
        }
      }
      else {
        this.viewOkModal();
      }
    }
  }
  OnGetStatus(estado: any): string {
    let row = this.ListFilter.filter(item => item.id == estado);
    let result = "";
    if(row != null && row[0].nombre != undefined && row[0].nombre != ""){
      result = row[0].nombre;
    }

    return result; 
  }
  OnGetClass(clase: any): string {
    switch (clase) {
      case 4:
        return "txt-success";
      case 5:
        return "txt-warning";
      case 6:
        return "txt-danger";
      default:
        return "txt-info";
    }
  }
}
