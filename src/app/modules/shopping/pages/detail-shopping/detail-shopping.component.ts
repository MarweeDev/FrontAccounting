import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { ShoppingDTO } from 'src/app/core/models/shopping';
import { ShoppingService } from 'src/app/core/services/shopping/shopping.service';
import { PeripheralService, PeripheralStatus } from 'src/app/core/services/peripherals/peripheral.service';
import { PrintService } from 'src/app/core/services/peripherals/print.service';
import { PeripheralLogEntry, PeripheralLogService } from 'src/app/core/services/peripherals/peripheral-log.service';
import { InternalDocumentService } from 'src/app/core/services/documents/internal-document.service';
import { DataSharedServicesService } from 'src/app/shared/directives/data-shared-services.service';
import { ToastService } from 'src/app/shared/directives/toast.service';

@Component({
  selector: 'app-detail-shopping',
  templateUrl: './detail-shopping.component.html',
  styleUrls: ['./detail-shopping.component.css']
})
export class DetailShoppingComponent implements OnInit {
  shopping?: ShoppingDTO;
  peripheralStatus?: PeripheralStatus;
  peripheralLogs: PeripheralLogEntry[] = [];
  visiblePeripheralLogModal = false;
  peripheralEnabled = false;
  printing = false;
  sendingEmail = false;
  emailTarget = '';

  constructor(
    private route: ActivatedRoute,
    private app: AppComponent,
    private dataShared: DataSharedServicesService,
    private shoppingService: ShoppingService,
    private peripheralService: PeripheralService,
    private printService: PrintService,
    private internalDocumentService: InternalDocumentService,
    private peripheralLogService: PeripheralLogService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.app.listNav = [
      { nombre: 'Volver', url: 'shopping/register', type: 'btn-origin' },
      { nombre: 'Editar', url: `shopping/register/edit/${id}`, icon: 'fa-solid fa-pencil', type: 'btn-success' }
    ];
    this.dataShared.OnSetNav(this.app.listNav);
    this.dataShared.OnSetBreadcrumb('Compras/Detalle');
    this.loadPeripheralStatus();
    this.loadShopping();
  }

  loadShopping(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.shoppingService.getID(id).subscribe({
      next: data => {
        this.shopping = data.result;
        this.loadPeripheralLogs();
      },
      error: error => this.toastService.showToast({
        title: 'Error ' + error.status,
        message: error.error?.message || error.message,
        type: 'error',
        timeout: 3000
      })
    });
  }

  get totalItems(): number {
    return this.shopping?.items?.reduce((sum, item) => sum + Number(item.cantidad || 0), 0) || 0;
  }

  loadPeripheralStatus(): void {
    this.peripheralEnabled = this.peripheralService.isEnabled();
    if (!this.peripheralEnabled) {
      this.peripheralStatus = undefined;
      return;
    }

    this.peripheralService.getStatus().subscribe(status => {
      this.peripheralStatus = status;
    });
  }

  printSupport(): void {
    if (!this.shopping) return;

    this.printing = true;
    this.printService.printShopping(this.shopping).subscribe(result => {
      this.printing = false;
      this.peripheralLogService.add({
        orderCode: this.shopping?.codigo,
        type: 'print',
        status: result.success ? 'success' : 'failed',
        message: result.message,
        deviceMode: result.mode,
        payload: result
      });
      this.loadPeripheralLogs();
      this.toastService.showToast({
        title: result.success ? 'Impresion enviada' : 'Impresion del navegador',
        message: result.message,
        type: result.success ? 'success' : 'warning',
        timeout: 3500
      });
      this.loadPeripheralStatus();
    });
  }

  sendSupportEmail(): void {
    if (!this.shopping || !this.emailTarget) {
      this.toastService.showToast({
        title: 'Correo requerido',
        message: 'Ingresa el correo destino para enviar el soporte interno.',
        type: 'warning',
        timeout: 3000
      });
      return;
    }

    this.sendingEmail = true;
    this.internalDocumentService.sendEmail({
      documentType: 'shopping-support',
      reference: this.shopping.codigo || '',
      email: this.emailTarget,
      payload: this.shopping
    }).subscribe({
      next: data => {
        this.sendingEmail = false;
        this.toastService.showToast({
          title: 'Soporte enviado',
          message: data.message || 'El soporte interno fue enviado correctamente.',
          type: 'success',
          timeout: 3500
        });
      },
      error: error => {
        this.sendingEmail = false;
        this.toastService.showToast({
          title: 'Error ' + error.status,
          message: error.error?.message || error.message,
          type: 'error',
          timeout: 3000
        });
      }
    });
  }

  openPeripheralLogModal(): void {
    this.visiblePeripheralLogModal = true;
  }

  closePeripheralLogModal(): void {
    this.visiblePeripheralLogModal = false;
  }

  private loadPeripheralLogs(): void {
    if (!this.shopping?.codigo) return;
    this.peripheralLogService.getByOrder$(this.shopping.codigo).subscribe(logs => {
      this.peripheralLogs = logs;
    });
  }
}
