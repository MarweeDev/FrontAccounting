import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { OrderDTO } from 'src/app/core/models/order';
import { OrderService } from 'src/app/core/services/order/order.service';
import { PeripheralLogEntry, PeripheralLogService, PeripheralLogStatus, PeripheralLogType } from 'src/app/core/services/peripherals/peripheral-log.service';
import { PeripheralService, PeripheralStatus } from 'src/app/core/services/peripherals/peripheral.service';
import { PrintService } from 'src/app/core/services/peripherals/print.service';
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
  paymentCompleted: boolean = false;
  printing: boolean = false;
  peripheralStatus?: PeripheralStatus;
  paymentTerminalModalVisible = false;
  simulatedPaymentStatus: 'idle' | 'pending' | 'approved' | 'rejected' | 'cancelled' = 'idle';
  simulatedPaymentMessage = 'Esperando lectura de tarjeta...';
  processingPayment = false;
  operationMessage = '';
  peripheralLogs: PeripheralLogEntry[] = [];

  constructor(
    private toastService: ToastService,
    private route : ActivatedRoute,
    private app: AppComponent, 
    private DataShared: DataSharedServicesService, 
    private router:Router, 
    private url: ActivatedRoute, 
    private ApiOrder: OrderService,
    private ApiTypePay: TypepayService,
    private peripheralService: PeripheralService,
    private printService: PrintService,
    private peripheralLogService: PeripheralLogService) 
  {
    
    this.ApiTypePay.get().subscribe(data => {
      this.ListTypePay = data.result;
    },error => {
      console.log('Error get: ', error)
    });
  }

  ngOnInit(): void {
    this.loadPeripheralStatus();
  }

  ngAfterContentInit():void {
    //Opciones para el nav
    this.app.listNav = [
      { nombre: 'Volver', url: 'sales/register', type: "btn-origin"},
      { nombre: 'Nueva orden', url: 'sales/order', icon: 'fa-solid fa-plus', type: "btn-success"},
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
      this.refreshPeripheralLogs();
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
    let subtype = 1; //1: no definido

    if (elementSubType?.value != undefined) {
      subtype = elementSubType?.value;
    }

    const orderData: OrderDTO = {
      codigo: this.order,
      id_tipopago: elementType?.value,
      id_subtipopago: subtype,
    };

    if (this.isPaymentTerminalFlow(elementType)) {
      this.openPaymentTerminal(orderData);
      return;
    }

    this.completePayment(orderData);
  }

  completePayment(orderData: OrderDTO): void {
    let elementBefore :any = document.getElementById('col_final')?.classList;

    if (elementBefore != undefined && !this.processingPayment) {
      this.processingPayment = true;
      elementBefore.remove('completed');
      elementBefore.remove('notcompleted');
      elementBefore.add('process');
      
      this.ApiOrder.putStatus(orderData).subscribe(() => {
        setTimeout(() => {
          elementBefore.remove('process');
          elementBefore.remove('notcompleted');
          elementBefore.add('completed');
          this.operationMessage = 'Pago registrado. Preparando comprobante interno...';
        }, 3000);

        setTimeout(() => {
          elementBefore.remove('process');
          elementBefore.remove('notcompleted');
          elementBefore.add('completed');

          this.paymentCompleted = true;
          this.operationMessage = 'Pago registrado correctamente.';
          this.logPeripheral('payment', 'approved', 'Pago registrado en la plataforma despues de respuesta del datáfono.');

          this.toastService.showToast({
            title: 'Proceso exitoso',
            message: 'Pago registrado. La impresion se intentara sin bloquear la caja.',
            type: 'success',
            timeout: 5000,
          });

          this.processingPayment = false;
          this.printReceipt(true);

          setTimeout(() => {
            elementBefore.remove('completed');
          }, 1200);
        }, 5000);
      },error => {
        this.processingPayment = false;
        this.operationMessage = 'No fue posible registrar el pago.';
        this.logPeripheral('payment', 'failed', error.error?.message || error.message || 'Error al registrar pago.');
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
    this.router.navigate(['sales/register']);
  }

  loadPeripheralStatus(): void {
    this.peripheralService.getStatus().subscribe(status => {
      this.peripheralStatus = status;
    });
  }

  toggleSimulation(): void {
    const nextMode = this.peripheralStatus?.mode === 'simulation' ? 'local-agent' : 'simulation';
    this.peripheralService.setMode(nextMode);
    this.paymentTerminalModalVisible = false;
    this.simulatedPaymentStatus = nextMode === 'simulation' ? 'pending' : 'idle';
    this.loadPeripheralStatus();
  }

  openPaymentTerminal(orderData?: OrderDTO): void {
    if (this.peripheralStatus?.mode !== 'simulation') {
      this.completePayment(orderData || this.getOrderDataFromForm());
      return;
    }

    this.paymentTerminalModalVisible = true;
    this.simulatedPaymentStatus = 'pending';
    this.simulatedPaymentMessage = 'Esperando lectura de tarjeta...';
  }

  approveTerminal(): void {
    this.simulatedPaymentStatus = 'approved';
    this.simulatedPaymentMessage = 'Pago aprobado. Cerrando datáfono...';
    this.logPeripheral('payment', 'approved', 'Datáfono simulado aprobo la transaccion.');
    setTimeout(() => {
      this.paymentTerminalModalVisible = false;
      this.completePayment(this.getOrderDataFromForm());
    }, 900);
  }

  rejectTerminal(): void {
    this.simulatedPaymentStatus = 'rejected';
    this.simulatedPaymentMessage = 'Pago rechazado por el datáfono simulado.';
    this.logPeripheral('payment', 'rejected', 'Datáfono simulado rechazo la transaccion.');
  }

  cancelTerminal(): void {
    this.simulatedPaymentStatus = 'cancelled';
    this.simulatedPaymentMessage = 'Transaccion cancelada en datáfono simulado.';
    this.logPeripheral('payment', 'cancelled', 'Transaccion cancelada en datáfono simulado.');
    setTimeout(() => {
      this.paymentTerminalModalVisible = false;
      this.operationMessage = 'Transaccion cancelada. La orden sigue pendiente y puedes intentar otro medio de pago.';
    }, 700);
  }

  closeTerminal(): void {
    this.paymentTerminalModalVisible = false;
  }

  private getOrderDataFromForm(): OrderDTO {
    let elementType :any = document.getElementById('selectType');
    let elementSubType :any = document.getElementById('selectSubType');
    return {
      codigo: this.order,
      id_tipopago: elementType?.value,
      id_subtipopago: elementSubType?.value || 1,
    };
  }

  private isPaymentTerminalFlow(elementType: HTMLSelectElement): boolean {
    const selectedText = elementType?.selectedOptions?.[0]?.text?.toLowerCase() || '';
    return this.peripheralStatus?.mode === 'simulation'
      && (selectedText.includes('tarjeta') || selectedText.includes('datafono') || selectedText.includes('datáfono') || selectedText.includes('credito') || selectedText.includes('débito') || selectedText.includes('debito'));
  }

  printReceipt(returnToRegister: boolean = false): void {
    if (!this.ListOrder?.length) {
      if (returnToRegister) this.viewCancel();
      return;
    }

    this.printing = true;
    this.operationMessage = this.peripheralStatus?.mode === 'simulation'
      ? 'Enviando comprobante a impresora simulada...'
      : 'Enviando comprobante a impresora...';

    this.printService.printOrder(this.ListOrder).subscribe(result => {
      this.printing = false;
      this.operationMessage = result.success
        ? result.message
        : 'Agente local no disponible. Se abrio impresion del navegador.';
      this.logPeripheral('print', result.success ? 'success' : 'failed', result.message, result);
      this.toastService.showToast({
        title: result.mode === 'simulation' ? 'Impresion simulada' : result.success ? 'Impresion enviada' : 'Impresion del navegador',
        message: result.message,
        type: result.success ? 'success' : 'warning',
        timeout: 3500
      });
      this.loadPeripheralStatus();
      if (returnToRegister) {
        setTimeout(() => this.viewCancel(), 900);
      }
    });
  }

  private logPeripheral(type: PeripheralLogType, status: PeripheralLogStatus, message: string, payload?: any): void {
    this.peripheralLogService.add({
      orderCode: this.order,
      type,
      status,
      message,
      deviceMode: this.peripheralStatus?.mode,
      payload
    });
    this.refreshPeripheralLogs();
  }

  private refreshPeripheralLogs(): void {
    this.peripheralLogs = this.peripheralLogService.getByOrder(this.order);
  }
}
