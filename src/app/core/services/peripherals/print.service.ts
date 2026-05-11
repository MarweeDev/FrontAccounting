import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { PeripheralService, PrintJob, PrintJobLine } from './peripheral.service';

@Injectable({
  providedIn: 'root'
})
export class PrintService {
  readonly internalDisclaimer = 'Comprobante interno. No es factura fiscal.';

  constructor(private peripheralService: PeripheralService) { }

  printOrder(orderRows: any[]): Observable<{ mode: string; success: boolean; message: string }> {
    const job = this.buildOrderJob(orderRows);
    return this.peripheralService.print(job).pipe(
      tap(result => {
        if (!result.success) {
          this.printInBrowser(job);
        }
      })
    );
  }

  printShopping(shopping: any): Observable<{ mode: string; success: boolean; message: string }> {
    const job = this.buildShoppingJob(shopping);
    return this.peripheralService.print(job).pipe(
      tap(result => {
        if (!result.success) {
          this.printInBrowser(job);
        }
      })
    );
  }

  buildOrderJob(orderRows: any[]): PrintJob {
    const first = orderRows[0] || {};
    const lines: PrintJobLine[] = orderRows.map(item => ({
      description: item.producto || 'Producto',
      quantity: Number(item.cantidad || 0),
      unitValue: this.toNumber(item.precio),
      total: this.toNumber(item.precio) * Number(item.cantidad || 0)
    }));
    const total = lines.reduce((sum, item) => sum + item.total, 0);

    return {
      documentType: 'order-receipt',
      title: 'Comprobante de venta',
      reference: first.codigo || '',
      customerName: first.cliente,
      createdAt: first.fecha,
      paymentMethod: first.tipopago || first.tipo_pago || first.medio_pago,
      lines,
      totals: [{ label: 'Total', value: total }],
      disclaimer: this.internalDisclaimer
    };
  }

  buildShoppingJob(shopping: any): PrintJob {
    const lines: PrintJobLine[] = (shopping?.items || []).map((item: any) => ({
      description: item.producto || `Producto ${item.id_producto}`,
      quantity: Number(item.cantidad || 0),
      unitValue: this.toNumber(item.valor_unitario),
      total: this.toNumber(item.total || Number(item.cantidad || 0) * Number(item.valor_unitario || 0))
    }));
    const total = this.toNumber(shopping?.total_compra || lines.reduce((sum, item) => sum + item.total, 0));

    return {
      documentType: 'shopping-support',
      title: 'Soporte interno de compra/gasto',
      reference: shopping?.codigo || '',
      providerName: shopping?.proveedor,
      createdAt: shopping?.fecha_creacion,
      lines,
      totals: [{ label: 'Total', value: total }],
      disclaimer: this.internalDisclaimer
    };
  }

  private printInBrowser(job: PrintJob): void {
    const popup = window.open('', '_blank', 'width=420,height=640');
    if (!popup) return;

    popup.document.write(this.getPrintHtml(job));
    popup.document.close();
    popup.focus();
    popup.print();
  }

  private getPrintHtml(job: PrintJob): string {
    const rows = job.lines.map(item => `
      <tr>
        <td>${this.escape(item.description)}</td>
        <td>${item.quantity}</td>
        <td>${this.formatMoney(item.unitValue)}</td>
        <td>${this.formatMoney(item.total)}</td>
      </tr>
    `).join('');
    const totals = job.totals.map(item => `
      <div class="total-row"><span>${this.escape(item.label)}</span><strong>${this.formatMoney(item.value)}</strong></div>
    `).join('');

    return `
      <!doctype html>
      <html>
      <head>
        <title>${this.escape(job.title)}</title>
        <style>
          body { font-family: Arial, sans-serif; color: #222; margin: 24px; }
          h1 { font-size: 20px; margin: 0 0 6px; }
          .muted, .disclaimer { color: #5f6b7a; font-size: 12px; }
          .meta { margin: 16px 0; font-size: 12px; line-height: 1.6; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th, td { border-bottom: 1px solid #ddd; padding: 8px 4px; text-align: left; }
          th { color: #1b685f; }
          .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 15px; }
          .disclaimer { border-top: 1px solid #ddd; margin-top: 18px; padding-top: 12px; font-weight: 700; }
        </style>
      </head>
      <body>
        <h1>${this.escape(job.title)}</h1>
        <div class="muted">Referencia ${this.escape(job.reference)}</div>
        <div class="meta">
          ${job.customerName ? `<div><strong>Cliente:</strong> ${this.escape(job.customerName)}</div>` : ''}
          ${job.providerName ? `<div><strong>Proveedor:</strong> ${this.escape(job.providerName)}</div>` : ''}
          ${job.createdAt ? `<div><strong>Fecha:</strong> ${this.escape(job.createdAt)}</div>` : ''}
          ${job.paymentMethod ? `<div><strong>Medio de pago:</strong> ${this.escape(job.paymentMethod)}</div>` : ''}
        </div>
        <table>
          <thead><tr><th>Detalle</th><th>Cant.</th><th>Valor</th><th>Total</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        ${totals}
        <div class="disclaimer">${this.escape(job.disclaimer)}</div>
      </body>
      </html>
    `;
  }

  private toNumber(value: any): number {
    if (typeof value === 'number') return value;
    return Number(value?.toString().replace('$', '').replace(/\./g, '').replace(/,/g, '') || 0);
  }

  private formatMoney(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value || 0);
  }

  private escape(value: any): string {
    return `${value || ''}`
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
