import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from 'src/app/core/services/order/order.service';
import { RegisterComponent } from '../../register.component';
import { ToastService } from 'src/app/shared/directives/toast.service';
import { OrderDTO } from 'src/app/core/models/order';
import { PrintService } from 'src/app/core/services/peripherals/print.service';
import { PeripheralLogEntry, PeripheralLogService } from 'src/app/core/services/peripherals/peripheral-log.service';

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
  peripheralLogs: PeripheralLogEntry[] = [];

  constructor(private router:Router, 
    private toastService: ToastService,
    private url: ActivatedRoute, 
    private ApiOrder: OrderService,
    private printService: PrintService,
    private peripheralLogService: PeripheralLogService,
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
      this.loadPeripheralLogs();
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

  printReceipt(): void {
    if (!this.ListOrder?.length) return;

    this.printService.printOrder(this.ListOrder).subscribe(result => {
      this.peripheralLogService.add({
        orderCode: this.order,
        type: 'print',
        status: result.success ? 'success' : 'failed',
        message: result.message,
        deviceMode: result.mode,
        payload: result
      });
      this.peripheralLogs = this.peripheralLogService.getByOrder(this.order);
      this.toastService.showToast({
        title: result.success ? 'Impresion enviada' : 'Impresion del navegador',
        message: result.message,
        type: result.success ? 'success' : 'warning',
        timeout: 3500
      });
    });
  }

  private loadPeripheralLogs(): void {
    this.peripheralLogService.getByOrder$(this.order).subscribe(logs => {
      this.peripheralLogs = logs;
    });
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
