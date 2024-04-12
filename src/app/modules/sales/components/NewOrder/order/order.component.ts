import { Component, OnInit } from '@angular/core';
import { NeworderComponent } from '../../../pages/neworder/neworder.component';
import { ProductDTO } from '../../../../../core/models/product';
import { CategoriaProductoDTO } from '../../../../../core/models/categoriaProducto';
import { AppComponent } from 'src/app/app.component';
import { DataSharedServicesService } from 'src/app/shared/directives/data-shared-services.service';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/core/services/category/category.service'
import { ProductService } from 'src/app/core/services/product/product.service';
import { OrderDTO } from 'src/app/core/models/order';
import { OrderService } from 'src/app/core/services/order/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  searchTerm : string = '';

  selectedId: number | string = 0;

  btn_pay : boolean = true;

  VisibleAlert : boolean = false;

  valueCount : number = 0;

  _btn_modal_add : boolean = false;
  _modal_add : boolean = true;

  heightAuto : string = "container-add container-add-open";

  titleBtnPrev : string = "Default";
  titleOrder ?: string = "Default";

  numberMesa : number = 0;
  idMesa : number = 0;
  NameClient ?: string = "name";
  ListProduct: ProductDTO[] = [];
  ListOrder: OrderDTO[] =[];
  codeOrder: string = "0";
  totalProduct: string = "0";

  //#region propietari
  ListFilter : CategoriaProductoDTO[] = [];
  ListProductData: ProductDTO[] = [];
  //#endregion

  constructor(private newOrder : NeworderComponent, 
    private app: AppComponent, 
    private DataShared: DataSharedServicesService,
    private router: Router,
    private ApiCateg: CategoryService,
    private ApiProduct: ProductService,
    private ApiOrder: OrderService) 
    {
    this.titleBtnPrev = "#" + newOrder.mesaModels.numero + " - " + newOrder.mesaModels.nombre;
    this.titleOrder = newOrder.mesaModels.nombre;
    this.numberMesa = Number(newOrder.mesaModels.numero);
    this.idMesa = Number(1); //Number(newOrder.mesaModels.id);
    this.NameClient = this.newOrder.orderModels.nombre_cliente;
  }

  ngOnInit(): void {
    this.OnSetValueList();
    this.OnReloadSearch();
  }

  ngAfterContentInit():void {
    //Opciones para el nav
    this.app.listNav = [
      { nombre: 'Nuevo producto', url: 'sales/neworder/order/add', icon: 'fa-solid fa-plus'},
    ];
    this.DataShared.OnSetNav(this.app.listNav);

    this.ApiOrder.getCodeOrder().subscribe(data => {
      this.codeOrder = data.status;
    });
  }

  OnValidateCheck() {
    let element: any = document.getElementById('input-pay');
    let elementLabel: any = document.getElementById('label-pay')?.classList;
    let elementIcon: any = document.getElementById('icon-pay')?.classList;
    if(element.checked){
      elementLabel.add("label-active");
      elementIcon.remove("fa-regular");
      elementIcon.add("fa-solid");
      this.btn_pay = false;
    }
    else {
      elementLabel.remove("label-active");
      elementIcon.remove("fa-solid");
      elementIcon.add("fa-regular");
      this.btn_pay = true;
    }
  }

  OnReloadSearch() {
    this.DataShared.OnGet().subscribe((list: any) => {
      this.searchTerm = list;

      if (list == undefined || list == null || list == "") {
        this.ListProductData.forEach(item => {
          let element :any = document.getElementById('card-order-' + item.id);
          if(element != null)
            element.removeAttribute("style");
        });
      }
      else {
        let rows = this.ListProductData.filter(item => !item.nombre?.toLowerCase().includes(list.toLowerCase()));
        if(rows.length > 0) {
          rows.forEach(item => {
            let element :any = document.getElementById('card-order-' + item.id);
            element.style = "display: none;"
          });
        }
      }
    });
  }

  OnSetValueList(){
    //Cargar filtros
    if(this.selectedId === 0) {
      this.ApiCateg.get().subscribe(data => {
        this.ListFilter = data.category
      },
      error => {
        console.log('Error: ', error)
      });
    }

    //Cargar productos
    if (this.selectedId != 0) {
      this.ApiProduct.getCateg(this.selectedId).subscribe(data => {
        this.ListProductData = data.product
      },
      error => {
        console.log('Error: ', error)
      });
    }
    else {
      this.ApiProduct.get().subscribe(data => {
        this.ListProductData = data.product
      },
      error => {
        console.log('Error: ', error)
      });
    }
    
  }

  onSelectChange(event: any) {
    // Obtén el valor seleccionado y guárdalo en la propiedad selectedId
    this.selectedId = event.target.value;
    this.OnSetValueList();
    
    setTimeout(() => {
      this.OnValidateRefresh();
    }, 100);
  }

  OnTotal(){
    let arrayValue : number[] = [];
    for (var i=0; i<this.ListProduct.length; i++) {
      let price = Number(this.ListProduct[i].precio?.toString().replace('$','').replace('.','')) * Number(this.ListProduct[i]?.id_estado);
      arrayValue.push(price);
    } 
    this.totalProduct = Number(arrayValue.reduce((acumulador, numero) => acumulador + numero, 0)).toString();
    this.totalProduct = this.OnConvertNumberPrice(this.totalProduct);
  }

  OnValidateRefresh() {
    console.log(this.ListProduct);
    this.ListProduct.forEach(item => {
      let elementTitle :any = document.getElementById('card-title-' + item.id)?.style;
      let elementCard :any = document.getElementById('card-order-' + item.id)?.classList;
      let input :any = document.getElementById('input-' + item.id);
      if (elementTitle != undefined) {
        elementTitle.display = "unset";
        elementCard.add("card-hover");
        input.value = item.id_estado;
      }
    });
    
  }

  OnValidateAddItem(e:any, input:any){
    let elementTitle :any = document.getElementById('card-title-' + e.target.id)?.style;
    let elementCard :any = document.getElementById('card-order-' + e.target.id)?.classList;
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

  OnConvertNumberPrice(valor:any): string{
    let convertTotal = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Number(valor));
    return convertTotal;
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
          product.precio = e.target.attributes['value'].value;
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

        if(element.value == 0){
            let newList = this.ListProduct.filter(item => item.id !== e.target.attributes['id'].value);
            this.ListProduct = newList;
        }
        else {
          let exist = this.ListProduct.filter(item => item.id == e.target.attributes['id'].value).length;
          if (exist > 0) 
          {
            let row = this.ListProduct.findIndex(item => item.id == e.target.attributes['id'].value);
            this.ListProduct[row].id_estado = Number(element.value);
          }
        }

        this.OnTotal();
      }
    }
  }

  //#region agregar y eliminar desde la orden
  additemOrder(e:any) {
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
          product.precio = e.target.attributes['value'].value;
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
  deleteitemOrder(e:any) {
    let element :any = document.getElementById('input-' + e);
    if (element != undefined) {
      if (element.value > 0) { 
        element.value = Number(element.value) - 1;
        this.OnValidateAddItemOrder(e, element);

        if(element.value == 0){
            let newList = this.ListProduct.filter(item => item.id !== e);
            this.ListProduct = newList;
        }
        else {
          let exist = this.ListProduct.filter(item => item.id == e).length;
          if (exist > 0) 
          {
            let row = this.ListProduct.findIndex(item => item.id == e);
            this.ListProduct[row].id_estado = Number(element.value);
          }
        }

        this.OnTotal();
      }
    }
  }
  OnValidateAddItemOrder(e:any, input:any){
    let elementTitle :any = document.getElementById('card-title-' + e)?.style;
    let elementCard :any = document.getElementById('card-order-' + e)?.classList;
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
  //#endregion

  OnClose() {
    this._btn_modal_add = true;
    this._modal_add = false;
    this.heightAuto = "container-add";
  }
  OnOpen() {
    this._btn_modal_add = false;
    this._modal_add = true;
    this.heightAuto = "container-add container-add-open";
  }
  viewPrev() {
    this.newOrder.assignmentDisabled = true;
    this.newOrder.orderDisabled = false;
  }

  viewOk() {
    debugger;
    if(this.codeOrder != "0") {
      if(this.ListProduct.length > 0){

        this.ListProduct.forEach(item => {
          let order = new OrderDTO();
          order.codigo = this.codeOrder;
          order.id_mesa = this.idMesa;
          order.id_usuario = 1;
          order.id_estadoorden = 7;
          order.id_tipopago = 1;
          order.id_producto = item.id;
          order.cantidad = item.id_estado; //id_estado se uso para guardar la cantidad
  
          this.ListOrder.push(order);
        });
        
        if(this.ListOrder.length > 0) 
        {
          this.ApiOrder.post(this.ListOrder).subscribe(data => {
            console.log("Exito: ", data)

            this.viewPrev();
            this.newOrder.VisibleToask = true;
            setTimeout(() => {
              this.newOrder.VisibleToask = false;
            }, 3000);
          },error => {
            console.log('Error post: ', error)
          });
          
        }

      }
    }
  }

  viewPay() {
    this.router.navigate(['/sales/activeservices']);
    localStorage.setItem("servicesPendingDisabled", "false");
    localStorage.setItem("PayPendingDisabled", "true");
  }
  viewCancel() {
    //this.VisibleAlert = true;
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


  //Contexto menu
  mostrarContextMenu = false;
  x = 0;
  y = 0;
  idTarget : any;
  idElement = 0;

  mostrarMenu(event: MouseEvent): void {
    debugger;
    event.preventDefault();
    this.mostrarContextMenu = true;

    // Obtener la posición del clic derecho
    this.x = event.clientX - 20;
    this.y = event.clientY / 3;
    this.idTarget = event.currentTarget;
    this.idElement = this.idTarget.attributes['id'].value.replace('card-order-', '');

    this.configurarPosicionMenu();

    // Agregar un manejador de clic para cerrar el menú contextual
    document.addEventListener('click', this.cerrarMenu);
  }

  private configurarPosicionMenu(): void {
    setTimeout(() => {
      let element :any = document.getElementById("contextmenu");
      if (element) {
        element.style.left = `${this.x}px`;
        element.style.top = `${this.y}px`;
        element.style.opacity = '1';
      }
    });
  }

  cerrarMenu = (): void => {
    this.mostrarContextMenu = false;
    document.removeEventListener('click', this.cerrarMenu);
  };

  realizarAccion(option:string): void {
    this.router.navigate([option + this.idElement]);
    this.cerrarMenu();
  }

  descartItem() {

    if(this.idElement){
      const confirmacion = window.confirm("¿Seguro quiere descartar este elemento?");

    }

  }

  deleteItem() {

    if(this.idElement){
      const confirmacion = window.confirm("¿Seguro quiere eliminar este elemento?");
    }

  }
}
