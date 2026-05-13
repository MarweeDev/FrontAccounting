import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { AppComponent } from 'src/app/app.component';
import { ReportsService, ReportFilters } from 'src/app/core/services/reports/reports.service';
import { DataSharedServicesService } from 'src/app/shared/directives/data-shared-services.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {
  loading = false;
  activeReport = 'sales';
  filters: ReportFilters = {
    dateFrom: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10),
    dateTo: new Date().toISOString().slice(0, 10)
  };
  rows: any[] = [];
  summaryCards: any[] = [];
  reportOptions = [
    { id: 'sales', label: 'Ventas generales', icon: 'fa-solid fa-chart-line' },
    { id: 'salesByProduct', label: 'Ventas por producto', icon: 'fa-solid fa-box' },
    { id: 'salesBySeller', label: 'Ventas por vendedor', icon: 'fa-solid fa-user-tie' },
    { id: 'inventory', label: 'Inventario actual', icon: 'fa-solid fa-boxes-stacked' },
    { id: 'inventoryMovement', label: 'Movimiento inventario', icon: 'fa-solid fa-arrow-right-arrow-left' }
  ];

  constructor(
    private route : ActivatedRoute,
    private app: AppComponent, 
    private DataShared: DataSharedServicesService,
    private reportsService: ReportsService,
    private router: Router) 
  {
  }

  ngOnInit(): void {
    this.loadReport();
  }

  ngAfterContentInit():void {
    //Opciones para el nav
    this.app.listNav = [
      { nombre: 'Refrescar', url: 'reports/general', icon: 'fa-solid fa-rotate-right', type: "btn-success"},
    ];
    this.DataShared.OnSetNav(this.app.listNav);

    //Cargar breadcrumb
    this.route.data.subscribe(data => {
      this.DataShared.OnSetBreadcrumb(data['breadcrumb']);
    });
  }

  setReport(reportId: string): void {
    this.activeReport = reportId;
    this.loadReport();
  }

  loadReport(): void {
    this.loading = true;
    const request = this.activeReport === 'salesByProduct'
      ? this.reportsService.salesByProduct(this.filters)
      : this.activeReport === 'salesBySeller'
        ? this.reportsService.salesBySeller(this.filters)
        : this.activeReport === 'inventory'
          ? this.reportsService.inventory(this.filters)
          : this.activeReport === 'inventoryMovement'
            ? this.reportsService.inventoryMovement(this.filters)
            : this.reportsService.sales(this.filters);

    request.subscribe({
      next: data => {
        this.rows = data.result || [];
        this.summaryCards = this.buildSummary(this.rows);
        this.loading = false;
      },
      error: () => {
        this.rows = [];
        this.summaryCards = this.buildSummary([]);
        this.loading = false;
      }
    });
  }

  exportExcel(): void {
    const sheet = XLSX.utils.json_to_sheet(this.rows);
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, 'Reporte');
    XLSX.writeFile(book, `marwee-${this.activeReport}-${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  getColumns(): string[] {
    return this.rows.length ? Object.keys(this.rows[0]) : [];
  }

  private buildSummary(rows: any[]): any[] {
    const total = rows.reduce((sum, item) => sum + this.toNumber(item.total || item.valor_total || item.final_quantity), 0);
    return [
      { label: 'Registros', value: rows.length, icon: 'fa-solid fa-list-check' },
      { label: 'Valor total', value: this.formatMoney(total), icon: 'fa-solid fa-coins' },
      { label: 'Periodo', value: `${this.filters.dateFrom || '-'} / ${this.filters.dateTo || '-'}`, icon: 'fa-solid fa-calendar-days' }
    ];
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
}
