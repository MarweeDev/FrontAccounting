import { Component } from '@angular/core';
import { NeworderComponent } from '../../pages/neworder/neworder.component';
import { DataSharedServicesService } from 'src/app/shared/directives/data-shared-services.service';

@Component({
  selector: 'app-reserve',
  templateUrl: './reserve.component.html',
  styleUrls: ['./reserve.component.css']
})
export class ReserveComponent {

  titleBtnPrev : string = "Default";

  idMesa : number = 0;

  constructor(private newOrder : NeworderComponent, private DataShared: DataSharedServicesService) {
    this.titleBtnPrev = "#" + newOrder.mesaModels.id + " - " + newOrder.mesaModels.nombre;
    this.idMesa = Number(newOrder.mesaModels.id);
  }

  ngOnInit(): void {
    this.OnSetValueList();
  }

  OnSetValueList(){
    //Cargar filtros
    let ListFilter = [
      { id: 0, nombre: 'Sin filtros' }
    ];

    this.DataShared.OnSetList(ListFilter); 
  }

  viewPrev() {
    this.newOrder.assignmentDisabled = true;
    this.newOrder.orderDisabled = false;
    this.newOrder.reserveDisabled = false;
  }

  OnCancelReverse(e:any) {
    //reinicar la carga de la lista
  }

  OnOkReverse(e:any) {
    this.newOrder.assignmentDisabled = false;
    this.newOrder.orderDisabled = true;
    this.newOrder.reserveDisabled = false;
  }
}
