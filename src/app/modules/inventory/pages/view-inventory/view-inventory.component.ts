import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { StockDTO } from 'src/app/core/models/stock';
import { StockService } from 'src/app/core/services/stock/stock.service';
import { DataSharedServicesService } from 'src/app/shared/directives/data-shared-services.service';
import { ToastService } from 'src/app/shared/directives/toast.service';

@Component({
  selector: 'app-view-inventory',
  templateUrl: './view-inventory.component.html',
  styleUrls: ['./view-inventory.component.css']
})
export class ViewInventoryComponent implements OnInit {
  searchTerm = '';
  ListStock: StockDTO[] = [];
  FilterListStock: StockDTO[] = [];
  currentPage = 1;
  itemsPorPagina = 10;
  TotalPag = 0;
  editingStockId: number | null = null;
  editQuantity = 0;
  isSaving = false;

  constructor(
    private route: ActivatedRoute,
    private app: AppComponent,
    private dataShared: DataSharedServicesService,
    private stockService: StockService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.app.listNav = [
      { nombre: 'Refrescar', url: 'inventory/register', icon: 'fa-solid fa-rotate-right', type: 'btn-success' }
    ];
    this.dataShared.OnSetNav(this.app.listNav);

    this.route.data.subscribe(data => {
      this.dataShared.OnSetBreadcrumb(data['breadcrumb']);
    });

    this.onLoadStock();
  }

  OnSearchChange(search: string): void {
    this.searchTerm = search;
    this.currentPage = 1;
    this.applyFilters();
  }

  onLoadStock(): void {
    this.stockService.get().subscribe({
      next: data => {
        this.ListStock = data.result || [];
        this.applyFilters();
      },
      error: error => this.toastService.showToast({
        title: 'Error ' + error.status,
        message: error.error?.message || error.message,
        type: 'error',
        timeout: 3000
      })
    });
  }

  applyFilters(): void {
    const term = this.searchTerm.toLowerCase();
    const list = !term
      ? this.ListStock
      : this.ListStock.filter(item => {
        return [
          item.producto,
          item.referencia,
          item.categoria,
          item.cantidad?.toString()
        ].some(value => value?.toLowerCase().includes(term));
      });

    this.TotalPag = Math.ceil(list.length / this.itemsPorPagina);
    const startIndex = (this.currentPage - 1) * this.itemsPorPagina;
    this.FilterListStock = list.slice(startIndex, startIndex + this.itemsPorPagina);
  }

  onSelectInit(event?: Event): void {
    const value = (event?.target as HTMLSelectElement)?.value;
    this.itemsPorPagina = Number(value || this.itemsPorPagina);
    this.currentPage = 1;
    this.applyFilters();
  }

  nextPage(): void {
    if (this.currentPage < this.TotalPag) {
      this.currentPage++;
      this.applyFilters();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyFilters();
    }
  }

  startEdit(item: StockDTO): void {
    this.editingStockId = item.id || null;
    this.editQuantity = Number(item.cantidad || 0);
  }

  cancelEdit(): void {
    this.editingStockId = null;
    this.editQuantity = 0;
  }

  saveStock(item: StockDTO): void {
    if (!item.id || this.isSaving) return;

    this.isSaving = true;
    this.stockService.put(item.id, {
      ...item,
      cantidad: Number(this.editQuantity || 0)
    }).subscribe({
      next: () => {
        this.toastService.showToast({
          title: 'Inventario actualizado',
          message: 'La cantidad del producto fue ajustada correctamente.',
          type: 'success',
          timeout: 3000
        });
        this.cancelEdit();
        this.onLoadStock();
        this.isSaving = false;
      },
      error: error => {
        this.toastService.showToast({
          title: 'Error ' + error.status,
          message: error.error?.message || error.message,
          type: 'error',
          timeout: 3000
        });
        this.isSaving = false;
      }
    });
  }

  getStockStatus(item: StockDTO): string {
    const quantity = Number(item.cantidad || 0);
    if (quantity < 0) return 'negative';
    if (quantity <= 5) return 'low';
    return 'ok';
  }

  getStockLabel(item: StockDTO): string {
    const status = this.getStockStatus(item);
    if (status === 'negative') return 'Negativo';
    if (status === 'low') return 'Bajo';
    return 'Disponible';
  }
}
