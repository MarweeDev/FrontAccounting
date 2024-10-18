import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { OrderDTO } from 'src/app/core/models/order';
import { OrderService } from 'src/app/core/services/order/order.service';
import { TypepayService } from 'src/app/core/services/typePay/typepay.service';
import { DataSharedServicesService } from 'src/app/shared/directives/data-shared-services.service';
import { ToastService } from 'src/app/shared/directives/toast.service';

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
    private toastService: ToastService,
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
      { nombre: 'Volver', url: 'sales/neworder/register', type: "btn-origin"},
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

  closeBefore() {
    let elementBefore :any = document.getElementById('col_final');
    if (elementBefore != undefined) {

    }
  }

  viewOk() {
    let elementType :any = document.getElementById('selectType');
    let elementSubType :any = document.getElementById('selectSubType');
    let elementBefore :any = document.getElementById('col_final')?.classList;
    let subtype = 1; //1: no definido

    if (elementBefore != undefined) {
      elementBefore.remove('completed');
      elementBefore.remove('notcompleted');
      elementBefore.add('process');

      if (elementSubType?.value != undefined) {
        subtype = elementSubType?.value;
      }
  
      const orderData: OrderDTO = {
        codigo: this.order,
        id_tipopago: elementType?.value,
        id_subtipopago: subtype,
      };
      
      this.ApiOrder.putStatus(orderData).subscribe(() => {
        setTimeout(() => {
          elementBefore.remove('process');
          elementBefore.remove('notcompleted');
          elementBefore.add('completed');
        }, 3000);

        setTimeout(() => {
          elementBefore.remove('process');
          elementBefore.remove('notcompleted');
          elementBefore.add('completed');

          this.viewCancel();

          this.toastService.showToast({
            title: 'Proceso exitoso',
            message: 'Pago de la orden se completo.',
            type: 'success',
            timeout: 5000,
          });
        }, 5000);
      },error => {
        elementBefore.remove('process');
        elementBefore.remove('completed');
        elementBefore.add('notcompleted');

        setTimeout(() => {
          elementBefore.remove('notcompleted');
        }, 3000);

        this.toastService.showToast({
          title: 'Error ' + error.status,
          message: error.message,
          type: 'error',
          timeout: 3000
        });
      });
    }
  }

  viewCancel(){
    this.router.navigate(['sales/neworder/register']);
  }
}
