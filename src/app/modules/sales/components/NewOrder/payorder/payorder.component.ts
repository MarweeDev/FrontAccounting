import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { OrderDTO } from 'src/app/core/models/order';
import { OrderService } from 'src/app/core/services/order/order.service';
import { TypepayService } from 'src/app/core/services/typePay/typepay.service';
import { DataSharedServicesService } from 'src/app/shared/directives/data-shared-services.service';

@Component({
  selector: 'app-payorder',
  templateUrl: './payorder.component.html',
  styleUrls: ['./payorder.component.css']
})
export class PayorderComponent implements OnInit {

  estado : any;
  order : any;
  ListOrder: any[] =[];
  totalProduct: string = "0";
  ListTypePay : any[] = [];
  ListSubTypePay : any[] = [];
  visiblesubtype : boolean = false;

  constructor(
    private route : ActivatedRoute,
    private app: AppComponent, 
    private DataShared: DataSharedServicesService, 
    private router:Router, 
    private url: ActivatedRoute, 
    private ApiOrder: OrderService,
    private ApiTypePay: TypepayService) 
  {
    
    this.ApiTypePay.get().subscribe(data => {
      this.ListTypePay = data.result;
    },error => {
      console.log('Error get: ', error)
    });
  }

  ngOnInit(): void {
    
  }

  ngAfterContentInit():void {
    //Opciones para el nav
    this.app.listNav = [
      { nombre: 'Cancelar pago', url: 'sales/neworder/register', type: "btn-primary"},
      { nombre: 'Nueva orden', url: 'sales/neworder/order', icon: 'fa-solid fa-plus', type: "btn-success"},
    ];
    this.DataShared.OnSetNav(this.app.listNav);

    //Cargar breadcrumb
    this.route.data.subscribe(data => {
      this.DataShared.OnSetBreadcrumb(data['breadcrumb']);
    });

    //Cargar orden
    const urlSegments = this.url.snapshot.url;
    this.order = urlSegments[urlSegments.length - 1].path;
    this.ApiOrder.getID(this.order).subscribe(data => {
      this.ListOrder = data.result;
      this.estado = this.ListOrder[0].estado;
      this.OnTotal();
    },error => {
      console.log('Error get: ', error)
    });
  }

  changeType(event: any): void {
    const selectedId = event.target.value;
    this.getSubTypePay(selectedId);
  }

  getSubTypePay(id:any){
    this.ApiTypePay.getSub(id).subscribe(data => {
      this.ListSubTypePay = data.result;
      if(this.ListSubTypePay.length > 0){
        this.visiblesubtype = true;
      }
      else {
        this.visiblesubtype = false;
      }
    },error => {
      console.log('Error get: ', error)
    });
  }

  getConverPrice(e:any){
    var price = Number(e);
    return price;
  }

  OnTotal(){
    let arrayValue : number[] = [];
    for (var i=0; i<this.ListOrder.length; i++) {
      let price = Number(this.ListOrder[i].precio?.toString().replace('$','').replace('.','')) * Number(this.ListOrder[i]?.cantidad);
      arrayValue.push(price);
    } 
    this.totalProduct = Number(arrayValue.reduce((acumulador, numero) => acumulador + numero, 0)).toString();
    this.totalProduct = this.OnConvertNumberPrice(this.totalProduct);
  }

  OnConvertNumberPrice(valor:any): string{
    let convertTotal = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Number(valor));
    return convertTotal;
  }

  viewPrev() {
  }

  viewOk() {
    let elementType :any = document.getElementById('selectType');
    let elementSubType :any = document.getElementById('selectSubType');

    const orderData: OrderDTO = {
      codigo: this.order,
      id_tipopago: elementType?.value,
      id_subtipopago: elementSubType?.value,
    };
    this.ApiOrder.putStatus(orderData).subscribe(() => {
      this.viewCancel();
    },error => {
      console.log('Error get: ', error)
    });
    
  }

  viewCancel(){
    this.router.navigate(['sales/neworder/register']);
  }
}
