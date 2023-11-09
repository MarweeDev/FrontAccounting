import { Component, OnInit } from '@angular/core';
import { NeworderComponent } from '../../pages/neworder/neworder.component';
import { ProductDTO } from '../../../../core/models/product';
import { CategoriaProductoDTO } from '../../../../core/models/categoriaProducto';
import { DataSharedServicesService } from 'src/app/shared/directives/data-shared-services.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  VisibleAlert : boolean = false;

  valueCount : number = 0;
  _btn_modal_add : boolean = true;
  _modal_add : boolean = false;
  heightAuto : string = "height: auto;";

  titleBtnPrev : string = "Default";

  idMesa : number = 0;
  ListProduct: ProductDTO[] = [];
  totalProduct: number = 0;

  //#region propietari
  ListFilter : CategoriaProductoDTO[] = [];
  //#endregion

  constructor(private newOrder : NeworderComponent, private DataShared: DataSharedServicesService) {
    this.titleBtnPrev = "#" + newOrder.mesaModels.id + " - " + newOrder.mesaModels.nombre;
    this.idMesa = Number(newOrder.mesaModels.id);
  }

  ngOnInit(): void {
    this.OnSetValueList();
  }

  OnSetValueList(){
    //Cargar filtros
    this.ListFilter = [
      { id: 1, nombre: 'Entrada' },
      { id: 2, nombre: 'Platos fuertes' },
      { id: 3, nombre: 'Bebidas' }
    ];

    this.DataShared.OnSetList(this.ListFilter); 
  }

  OnTotal(){
    let arrayValue : number[] = [];
    for (var i=0; i<this.ListProduct.length; i++) {
      let price = Number(this.ListProduct[i].precio?.toString().replace('$','').replace('.','')) * Number(this.ListProduct[i]?.id_estado);
      arrayValue.push(price);
    } 
    this.totalProduct = Number(arrayValue.reduce((acumulador, numero) => acumulador + numero, 0));
  }

  OnValidateAddItem(e:any, input:any){
    let elementTitle :any = document.getElementById('card-title-' + e.target.id)?.style;
    let elementCard :any = document.getElementById('card-' + e.target.id)?.classList;
    if (elementTitle != undefined && input != undefined) {
      if (input.value > 0) { 
        elementTitle.display = "unset";
        elementCard.add("card-hover");
      }
      else {
        elementTitle.display = "none";
        elementCard.remove("card-hover");
      }
    }

    let count :any = document.getElementsByClassName('input-count');
    if (count != undefined) {
      let arrayValue : number[] = [];
      for (var i=0; i<count.length; i++) {
        arrayValue.push(Number(count[i].value));
      }
      this.valueCount = arrayValue.reduce((acumulador, numero) => acumulador + numero, 0);
    }
  }

  additem(e:any) {
    let element :any = document.getElementById('input-' + e.target.id);
    if (element != undefined) {
      if (element.value < 10) { 
        element.value = Number(element.value) + 1;
        this.OnValidateAddItem(e, element);

        let exist = this.ListProduct.filter(item => item.id == e.target.attributes['id'].value).length;
        if (exist == 0) 
        {
          const product = new ProductDTO();
          product.id = e.target.attributes['id'].value;
          product.nombre = e.target.attributes['name'].value;
          product.precio = e.target.attributes['price'].value;
          product.id_estado = Number(element.value);
          this.ListProduct?.push(product);
        }
        else {
          let row = this.ListProduct.findIndex(item => item.id == e.target.attributes['id'].value);
          this.ListProduct[row].id_estado = Number(element.value);
        }

        this.OnTotal();
      }
    }
  }

  deleteitem(e:any) {
    let element :any = document.getElementById('input-' + e.target.id);
    if (element != undefined) {
      if (element.value > 0) { 
        element.value = Number(element.value) - 1;
        this.OnValidateAddItem(e, element);

        let exist = this.ListProduct.filter(item => item.id == e.target.attributes['id'].value).length;
        if (exist > 0) 
        {
          let row = this.ListProduct.findIndex(item => item.id == e.target.attributes['id'].value);
          this.ListProduct[row].id_estado = Number(element.value);
        }

        this.OnTotal();
      }
    }
  }

  OnClose() {
    this._btn_modal_add = true;
    this._modal_add = false;
    this.heightAuto = "height: auto;";
  }
  OnOpen() {
    this._btn_modal_add = false;
    this._modal_add = true;
    this.heightAuto = "container-add-open";
  }
  viewPrev() {
    this.newOrder.assignmentDisabled = true;
    this.newOrder.orderDisabled = false;
  }
  viewOk() {
    this.viewPrev();
    this.newOrder.VisibleToask = true;
    setTimeout(() => {
      this.newOrder.VisibleToask = false;
    }, 3000);
  }
  viewCancel() {
    this.VisibleAlert = true;
  }

  //esto tiene que ir en el componente creado en shared
  viewOkModal() {
    this.VisibleAlert = false;
    this.newOrder.assignmentDisabled = true;
    this.newOrder.orderDisabled = false;
  }
  viewCancelModal() {
    this.VisibleAlert = false;
  }
}