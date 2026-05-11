import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { OrderDTO } from 'src/app/core/models/order';
import { PaymentMethodConfigDTO } from 'src/app/core/models/paymentMethod';
import { OrderService } from 'src/app/core/services/order/order.service';
import { PaymentMethodService } from 'src/app/core/services/payment-method/payment-method.service';
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
  estado: any;
  order: any;
  ListOrder: any[] = [];
  totalProduct = '0';
  ListTypePay: any[] = [];
  ListSubTypePay: any[] = [];
  visiblesubtype = false;
  paymentMethods: PaymentMethodConfigDTO[] = [];
  selectedPaymentMethod?: PaymentMethodConfigDTO;
  paymentReference = '';
  paymentConfirmed = false;
  cashReceived: number | null = null;
  paymentMethodModalVisible = false;
  paymentCompleted = false;
  printing = false;
  peripheralStatus?: PeripheralStatus;
  paymentTerminalModalVisible = false;
  simulatedPaymentStatus: 'idle' | 'pending' | 'approved' | 'rejected' | 'cancelled' = 'idle';
  simulatedPaymentMessage = 'Esperando lectura de tarjeta...';
  processingPayment = false;
  operationMessage = '';
  peripheralLogs: PeripheralLogEntry[] = [];

  constructor(
    private toastService: ToastService,
    private route: ActivatedRoute,
    private app: AppComponent,
    private DataShared: DataSharedServicesService,
    private router: Router,
    private url: ActivatedRoute,
    private ApiOrder: OrderService,
    private ApiTypePay: TypepayService,
    private paymentMethodService: PaymentMethodService,
    private peripheralService: PeripheralService,
    private printService: PrintService,
    private peripheralLogService: PeripheralLogService
  ) {
    this.ApiTypePay.get().subscribe(data => {
      this.ListTypePay = data.result || [];
      this.loadPaymentMethods();
    }, error => {
      console.log('Error get: ', error);
    });
  }

  ngOnInit(): void {
    this.loadPeripheralStatus();
  }

  ngAfterContentInit(): void {
    this.app.listNav = [
      { nombre: 'Volver', url: 'sales/register', type: 'btn-origin' },
      { nombre: 'Nueva orden', url: 'sales/order', icon: 'fa-solid fa-plus', type: 'btn-success' },
    ];
    this.DataShared.OnSetNav(this.app.listNav);

    this.route.data.subscribe(data => {
      this.DataShared.OnSetBreadcrumb(data['breadcrumb']);
    });

    const urlSegments = this.url.snapshot.url;
    this.order = urlSegments[urlSegments.length - 1].path;
    this.ApiOrder.getID(this.order).subscribe(data => {
      this.ListOrder = data.result;
      this.estado = this.ListOrder[0].estado;
      this.OnTotal();
      this.refreshPeripheralLogs();
    }, error => {
      console.log('Error get: ', error);
    });
  }

  loadPaymentMethods(): void {
    this.paymentMethodService.getMethods().subscribe({
      next: data => {
        this.paymentMethods = (data.result || []).filter(item => item.enabled !== false);
        if (this.paymentMethods.length > 0) this.selectPaymentMethod(this.paymentMethods[0]);
      },
      error: () => {
        this.paymentMethods = this.ListTypePay.map((item, index) => ({
          id: item.id,
          name: item.nombre,
          method_type: this.inferMethodType(item.nombre),
          icon: this.iconFor(this.inferMethodType(item.nombre)),
          priority: index + 1,
          id_tipopago_legacy: item.id,
          id_subtipopago_legacy: 1,
          enabled: true
        }));
        if (this.paymentMethods.length > 0) this.selectPaymentMethod(this.paymentMethods[0]);
      }
    });
  }

  selectPaymentMethod(method: PaymentMethodConfigDTO): void {
    this.selectedPaymentMethod = method;
    this.paymentReference = '';
    this.paymentConfirmed = !method.requires_confirmation;
    this.cashReceived = null;
    this.ListSubTypePay = [];
    this.visiblesubtype = false;
    if (method.id_tipopago_legacy && this.shouldShowLegacySubtype(method)) {
      this.getSubTypePay(method.id_tipopago_legacy);
    }
    this.paymentMethodModalVisible = false;
  }

  openPaymentMethodModal(): void {
    this.paymentMethodModalVisible = true;
  }

  closePaymentMethodModal(): void {
    this.paymentMethodModalVisible = false;
  }

  getSubTypePay(id: any): void {
    this.ApiTypePay.getSub(id).subscribe(data => {
      this.ListSubTypePay = data.result || [];
      this.visiblesubtype = this.ListSubTypePay.length > 0;
    }, error => {
      console.log('Error get: ', error);
    });
  }

  getConverPrice(e: any): number {
    return Number(e);
  }

  OnTotal(): void {
    const total = this.ListOrder.reduce((sum, item) => {
      const price = Number(item.precio?.toString().replace('$', '').replace('.', '') || 0) * Number(item?.cantidad || 0);
      return sum + price;
    }, 0);
    this.totalProduct = this.OnConvertNumberPrice(total);
  }

  OnConvertNumberPrice(valor: any): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Number(valor));
  }

  viewOk(): void {
    const method = this.selectedPaymentMethod || this.paymentMethods[0];
    const elementSubType: any = document.getElementById('selectSubType');
    const subtype = elementSubType?.value || method?.id_subtipopago_legacy || 1;

    if (!method) {
      this.toastService.showToast({ title: 'Medio requerido', message: 'Selecciona un medio de pago.', type: 'warning', timeout: 3000 });
      return;
    }

    if (method.requires_reference && !this.paymentReference.trim()) {
      this.toastService.showToast({ title: 'Referencia requerida', message: 'Ingresa la referencia o comprobante del pago recibido.', type: 'warning', timeout: 3000 });
      return;
    }

    if (method.requires_confirmation && !this.paymentConfirmed) {
      this.toastService.showToast({ title: 'Confirmacion pendiente', message: 'Confirma que el pago fue recibido antes de cerrar la orden.', type: 'warning', timeout: 3000 });
      return;
    }

    const orderData: OrderDTO = {
      codigo: this.order,
      id_tipopago: method.id_tipopago_legacy || this.getDefaultLegacyPayId(),
      id_subtipopago: subtype,
    };

    if (this.isPaymentTerminalFlow(method)) {
      this.openPaymentTerminal(orderData);
      return;
    }

    this.completePayment(orderData);
  }

  completePayment(orderData: OrderDTO): void {
    const elementBefore: any = document.getElementById('col_final')?.classList;

    if (elementBefore !== undefined && !this.processingPayment) {
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
          this.savePaymentTransaction();
          this.toastService.showToast({
            title: 'Proceso exitoso',
            message: 'Pago registrado. La impresion se intentara sin bloquear la caja.',
            type: 'success',
            timeout: 5000,
          });
          this.processingPayment = false;
          this.printReceipt(true);

          setTimeout(() => elementBefore.remove('completed'), 1200);
        }, 5000);
      }, error => {
        this.processingPayment = false;
        this.operationMessage = 'No fue posible registrar el pago.';
        this.logPeripheral('payment', 'failed', error.error?.message || error.message || 'Error al registrar pago.');
        elementBefore.remove('process');
        elementBefore.remove('completed');
        elementBefore.add('notcompleted');
        setTimeout(() => elementBefore.remove('notcompleted'), 3000);
        this.toastService.showToast({ title: 'Error ' + error.status, message: error.message, type: 'error', timeout: 3000 });
      });
    }
  }

  viewCancel(): void {
    this.router.navigate(['sales/register']);
  }

  loadPeripheralStatus(): void {
    this.peripheralService.getStatus().subscribe(status => {
      this.peripheralStatus = status;
    });
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
      this.operationMessage = result.success ? result.message : 'Agente local no disponible. Se abrio impresion del navegador.';
      this.logPeripheral('print', result.success ? 'success' : 'failed', result.message, result);
      this.toastService.showToast({
        title: result.mode === 'simulation' ? 'Impresion simulada' : result.success ? 'Impresion enviada' : 'Impresion del navegador',
        message: result.message,
        type: result.success ? 'success' : 'warning',
        timeout: 3500
      });
      this.loadPeripheralStatus();
      if (returnToRegister) setTimeout(() => this.viewCancel(), 900);
    });
  }

  get paymentAmountNumber(): number {
    return this.ListOrder.reduce((sum, item) => sum + (Number(item.precio || 0) * Number(item.cantidad || 0)), 0);
  }

  get cashChange(): number {
    return Math.max(Number(this.cashReceived || 0) - this.paymentAmountNumber, 0);
  }

  get cashSuggestion(): string {
    const received = Number(this.cashReceived || 0);
    const total = this.paymentAmountNumber;
    if (!this.selectedPaymentMethod || this.selectedPaymentMethod.method_type !== 'cash' || received <= total) return '';

    const candidates = [100, 200, 500, 1000, 2000, 5000, 10000];
    const currentChange = received - total;
    const currentScore = this.roundnessScore(currentChange);
    const best = candidates
      .map(extra => ({ extra, change: received + extra - total, score: this.roundnessScore(received + extra - total) }))
      .filter(item => item.score > currentScore && item.change > 0)
      .sort((a, b) => b.score - a.score || a.extra - b.extra)[0];

    if (!best) return '';
    return `Si el cliente tiene ${this.formatCurrency(best.extra)}, devuelve ${this.formatCurrency(best.change)} exactos.`;
  }

  private roundnessScore(value: number): number {
    if (value % 10000 === 0) return 5;
    if (value % 5000 === 0) return 4;
    if (value % 2000 === 0) return 3;
    if (value % 1000 === 0) return 2;
    if (value % 500 === 0) return 1;
    return 0;
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value || 0);
  }

  private getOrderDataFromForm(): OrderDTO {
    const elementSubType: any = document.getElementById('selectSubType');
    const method = this.selectedPaymentMethod || this.paymentMethods[0];
    return {
      codigo: this.order,
      id_tipopago: method?.id_tipopago_legacy || this.getDefaultLegacyPayId(),
      id_subtipopago: elementSubType?.value || method?.id_subtipopago_legacy || 1,
    };
  }

  private isPaymentTerminalFlow(method: PaymentMethodConfigDTO): boolean {
    const selectedText = `${method.name || ''}`.toLowerCase();
    return this.peripheralStatus?.mode === 'simulation'
      && (method.method_type === 'terminal' || selectedText.includes('tarjeta') || selectedText.includes('datafono') || selectedText.includes('datáfono') || selectedText.includes('débito') || selectedText.includes('debito'));
  }

  private shouldShowLegacySubtype(method: PaymentMethodConfigDTO): boolean {
    const selectedText = `${method.name || ''}`.toLowerCase();
    return method.method_type === 'terminal'
      || selectedText.includes('tarjeta')
      || selectedText.includes('datafono')
      || selectedText.includes('datáfono');
  }

  private savePaymentTransaction(): void {
    const method = this.selectedPaymentMethod;
    if (!method) return;

    this.paymentMethodService.saveTransaction({
      codigo_orden: this.order,
      id_payment_method_config: method.id || null,
      method_name: method.name,
      method_type: method.method_type,
      reference: this.paymentReference || null,
      account_value: method.account_value || null,
      confirmation_status: method.requires_confirmation ? 'confirmed_manual' : 'confirmed',
      amount: this.paymentAmountNumber,
      payload: {
        account_label: method.account_label,
        qr_value: method.qr_value,
        instructions: method.instructions
      }
    }).subscribe({ error: () => null });
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

  private getDefaultLegacyPayId(): number {
    return Number(this.ListTypePay.find(item => ![1, 5].includes(Number(item.id)))?.id || this.ListTypePay[0]?.id || 1);
  }

  private inferMethodType(name: string): string {
    const value = `${name || ''}`.toLowerCase();
    if (value.includes('credito') || value.includes('crédito')) return 'credit';
    if (value.includes('tarjeta') || value.includes('datafono') || value.includes('datáfono')) return 'terminal';
    if (value.includes('transfer')) return 'transfer';
    if (value.includes('qr')) return 'qr';
    if (value.includes('nequi') || value.includes('daviplata')) return 'wallet';
    return 'cash';
  }

  private iconFor(type: string): string {
    const icons: Record<string, string> = {
      cash: 'fa-solid fa-money-bill-wave',
      terminal: 'fa-solid fa-credit-card',
      transfer: 'fa-solid fa-building-columns',
      qr: 'fa-solid fa-qrcode',
      breb: 'fa-solid fa-bolt',
      wallet: 'fa-solid fa-mobile-screen-button',
      link: 'fa-solid fa-link',
      credit: 'fa-solid fa-handshake',
      mixed: 'fa-solid fa-layer-group'
    };
    return icons[type] || 'fa-solid fa-wallet';
  }
}
