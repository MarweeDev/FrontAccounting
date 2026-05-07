import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { ShoppingDTO } from 'src/app/core/models/shopping';
import { ShoppingService } from 'src/app/core/services/shopping/shopping.service';
import { DataSharedServicesService } from 'src/app/shared/directives/data-shared-services.service';
import { ToastService } from 'src/app/shared/directives/toast.service';

@Component({
  selector: 'app-detail-shopping',
  templateUrl: './detail-shopping.component.html',
  styleUrls: ['./detail-shopping.component.css']
})
export class DetailShoppingComponent implements OnInit {
  shopping?: ShoppingDTO;

  constructor(
    private route: ActivatedRoute,
    private app: AppComponent,
    private dataShared: DataSharedServicesService,
    private shoppingService: ShoppingService,
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
    this.loadShopping();
  }

  loadShopping(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.shoppingService.getID(id).subscribe({
      next: data => this.shopping = data.result,
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
}
