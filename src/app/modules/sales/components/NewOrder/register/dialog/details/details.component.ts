import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from 'src/app/core/services/order/order.service';
import { RegisterComponent } from '../../register.component';
import { ToastService } from 'src/app/shared/directives/toast.service';
import { OrderDTO } from 'src/app/core/models/order';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  @Input() orderCode?: any;
  
  estado : any;
  order : any;
  ListOrder: any[] =[];
  modal: boolean = false;

  constructor(private router:Router, 
    private toastService: ToastService,
    private url: ActivatedRoute, 
    private ApiOrder: OrderService,
    private registercomponent: RegisterComponent) {
    //this.getUrl();
  }

  ngOnInit(): void {
    
  }

  ngOnChanges() : void {
    this.order = this.orderCode;
  }

  ngAfterContentInit():void {
    this.ApiOrder.getID(this.order).subscribe(data => {
      this.ListOrder = data.result;
      this.estado = this.ListOrder[0].estado;
    },error => {
      console.log('Error get: ', error)
    });
  }

  getUrl(){
    const urlSegments = this.url.snapshot.url;
    this.order = urlSegments[urlSegments.length - 1].path;
  }

  getConverPrice(e:any){
    var price = Number(e);
    return price;
  }

  getPayOrder(code:any){
    this.router.navigate(['/sales/payments', code]);
  }

   getUpdateOrder(code:any){
    this.router.navigate(['/sales/order/edit', code]);
  }

  cancel(){
    //this.router.navigate(['sales/register']);
    this.registercomponent.visibleDetails = false;
  }

  getNullOrder(){
    this.modal = true;
  }

  okModalOrder(){
    let input : any = document.getElementById('input_description');

    const orderData: OrderDTO = {
      codigo: this.order,
      observacion: input.value
    };

    if(input != undefined && input.value != "") {
      this.ApiOrder.putNull(orderData).subscribe(data => {

        let code = this.ListOrder[0]?.codigo;
        this.registercomponent.onLoadOrder();
        this.modal = false;
        this.cancel();

        this.toastService.showToast({
          title: 'Proceso exitoso',
          message: 'Orden ' + code + ' anulada.',
          type: 'success',
          timeout: 5000,
        });

      },error => {
        this.toastService.showToast({
          title: 'Error ' + error.status,
          message: error.message,
          type: 'error',
          timeout: 3000
        });
      });      
    }
  }

  cancelModalOrder(){
    this.modal = false;
  }

}
