import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { DataSharedServicesService } from 'src/app/shared/directives/data-shared-services.service';

interface AiDemoCard {
  title: string;
  icon: string;
  status: string;
  value: string;
  detail: string;
  action: string;
}

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {
  loading = false;
  orders: any[] = [
    { total: 48000 },
    { total: 52000 },
    { total: 156000 },
    { total: 39000 },
    { total: 62000 }
  ];
  shoppings: any[] = [
    { total_compra: 28000 },
    { total_compra: 175000 },
    { total_compra: 42000 }
  ];
  stock: any[] = [
    { producto: 'Producto demo A', cantidad: 3 },
    { producto: 'Producto demo B', cantidad: 18 },
    { producto: 'Producto demo C', cantidad: 5 },
    { producto: 'Producto demo D', cantidad: 11 }
  ];
  cards: AiDemoCard[] = [];

  constructor(
    private route : ActivatedRoute,
    private app: AppComponent, 
    private DataShared: DataSharedServicesService,
    private router: Router) 
  {
  }

  ngOnInit(): void {
    this.loadDemoData();
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

  loadDemoData(): void {
    this.cards = this.buildCards();
    this.loading = false;
  }

  private buildCards(): AiDemoCard[] {
    const salesTotals = this.orders.map(item => this.toNumber(item.total));
    const shoppingTotals = this.shoppings.map(item => this.toNumber(item.total_compra));
    const averageSale = this.average(salesTotals);
    const averageShopping = this.average(shoppingTotals);
    const unusualSales = this.orders.filter(item => this.toNumber(item.total) > averageSale * 1.5).length;
    const highShoppings = this.shoppings.filter(item => this.toNumber(item.total_compra) > averageShopping * 1.5).length;
    const lowStock = this.stock.filter(item => Number(item.cantidad || 0) <= 5).length;
    const totalSales = salesTotals.reduce((sum, value) => sum + value, 0);
    const totalShopping = shoppingTotals.reduce((sum, value) => sum + value, 0);
    const cashSignal = totalSales - totalShopping;

    return [
      {
        title: 'Ventas inusuales',
        icon: 'fa-solid fa-chart-line',
        status: 'Regla local',
        value: `${unusualSales}`,
        detail: unusualSales
          ? 'Hay ordenes por encima del promedio esperado para revisar precios, cantidades o demanda.'
          : 'No se detectan picos fuertes con la regla local actual.',
        action: 'Futuro: explicar causas y sugerir combos o ajustes de inventario.'
      },
      {
        title: 'Productos con bajo movimiento',
        icon: 'fa-solid fa-box-open',
        status: 'Regla local',
        value: `${lowStock}`,
        detail: lowStock
          ? 'Hay productos con existencia baja o critica segun el umbral local de 5 unidades.'
          : 'No hay alertas de stock bajo con los datos actuales.',
        action: 'Futuro: priorizar compras segun rotacion y margen.'
      },
      {
        title: 'Gastos altos',
        icon: 'fa-solid fa-receipt',
        status: 'Regla local',
        value: `${highShoppings}`,
        detail: highShoppings
          ? 'Algunas compras/gastos superan el comportamiento promedio registrado.'
          : 'Los gastos registrados se mantienen dentro del rango esperado.',
        action: 'Futuro: resumir proveedores, rubros y desviaciones.'
      },
      {
        title: 'Sugerencias de caja',
        icon: 'fa-solid fa-wallet',
        status: 'Plantilla local',
        value: this.formatMoney(cashSignal),
        detail: cashSignal >= 0
          ? 'La senal simple de caja queda positiva al comparar ventas y compras cargadas.'
          : 'La senal simple de caja queda negativa; conviene revisar gastos recientes.',
        action: 'Futuro: proponer cierre, alertas y preguntas en lenguaje natural.'
      }
    ];
  }

  private average(values: number[]): number {
    if (!values.length) return 0;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
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
