import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { ShoppingDTO } from 'src/app/core/models/shopping';
import { ShoppingService } from 'src/app/core/services/shopping/shopping.service';
import { DataSharedServicesService } from 'src/app/shared/directives/data-shared-services.service';
import { ToastService } from 'src/app/shared/directives/toast.service';

@Component({
  selector: 'app-view-shopping',
  templateUrl: './view-shopping.component.html',
  styleUrls: ['./view-shopping.component.css']
})
export class ViewShoppingComponent implements OnInit {
  searchTerm = '';
  ListOrder: ShoppingDTO[] = [];
  FilterListOrder: ShoppingDTO[] = [];
  currentPage = 1;
  itemsPorPagina = 10;
  TotalPag = 0;

  constructor(
    private route: ActivatedRoute,
    private app: AppComponent,
    private dataShared: DataSharedServicesService,
    private router: Router,
    private shoppingService: ShoppingService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.app.listNav = [
      { nombre: 'Nueva compra', url: 'shopping/register/add', icon: 'fa-solid fa-plus', type: 'btn-success' }
    ];
    this.dataShared.OnSetNav(this.app.listNav);

    this.route.data.subscribe(data => {
      this.dataShared.OnSetBreadcrumb(data['breadcrumb']);
    });

    this.onLoadOrder();
  }

  OnSearchChange(search: string): void {
    this.searchTerm = search;
    this.currentPage = 1;
    this.applyFilters();
  }

  onLoadOrder(): void {
    this.shoppingService.get().subscribe({
      next: data => {
        this.ListOrder = data.result || [];
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
      ? this.ListOrder
      : this.ListOrder.filter(item => {
        return [
          item.codigo,
          item.proveedor,
          item.nit,
          item.total_compra?.toString()
        ].some(value => value?.toLowerCase().includes(term));
      });

    this.TotalPag = Math.ceil(list.length / this.itemsPorPagina);
    const startIndex = (this.currentPage - 1) * this.itemsPorPagina;
    this.FilterListOrder = list.slice(startIndex, startIndex + this.itemsPorPagina);
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

  getDetailsOrder(id?: number): void {
    if (id) {
      this.router.navigate(['/shopping/register/detail', id]);
    }
  }

  editShopping(event: MouseEvent, id?: number): void {
    event.stopPropagation();
    if (id) {
      this.router.navigate(['/shopping/register/edit', id]);
    }
  }

  deleteShopping(event: MouseEvent, id?: number): void {
    event.stopPropagation();
    if (!id || !window.confirm('¿Seguro desea anular esta compra?')) return;

    this.shoppingService.delete(id).subscribe({
      next: () => this.onLoadOrder(),
      error: error => this.toastService.showToast({
        title: 'Error ' + error.status,
        message: error.error?.message || error.message,
        type: 'error',
        timeout: 3000
      })
    });
  }
}
