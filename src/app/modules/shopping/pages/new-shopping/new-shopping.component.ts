import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { ProductDTO } from 'src/app/core/models/product';
import { ShoppingDTO } from 'src/app/core/models/shopping';
import { ProductService } from 'src/app/core/services/product/product.service';
import { ShoppingService } from 'src/app/core/services/shopping/shopping.service';
import { SupplierService } from 'src/app/core/services/supplier/supplier.service';
import { SelectItem } from 'src/app/shared/components/form-items/select/select.component';
import { DataSharedServicesService } from 'src/app/shared/directives/data-shared-services.service';
import { ToastService } from 'src/app/shared/directives/toast.service';

@Component({
  selector: 'app-new-shopping',
  templateUrl: './new-shopping.component.html',
  styleUrls: ['./new-shopping.component.css']
})
export class NewShoppingComponent implements OnInit {
  purchaseForm: FormGroup;
  providers: SelectItem[] = [];
  products: SelectItem[] = [];
  productRows: ProductDTO[] = [];
  isEditMode = false;
  shoppingId?: string | null;

  typeShopping = [
    { id: 1, name: 'Compra' },
    { id: 2, name: 'Gasto/Costo' }
  ];

  constructor(
    protected fb: FormBuilder,
    protected route: ActivatedRoute,
    protected router: Router,
    protected app: AppComponent,
    protected dataShared: DataSharedServicesService,
    protected shoppingService: ShoppingService,
    protected supplierService: SupplierService,
    protected productService: ProductService,
    protected toastService: ToastService
  ) {
    this.purchaseForm = this.fb.group({
      elaborationDate: [new Date().toISOString().substring(0, 10), Validators.required],
      invoiceNumber: [{ value: this.generateCode(), disabled: true }],
      providerInvoice: [''],
      provider: [null, Validators.required],
      items: this.fb.array([]),
      observations: [''],
      totalBruto: [0],
      descuentos: [0],
      subtotal: [0],
      totalNeto: [0]
    });
  }

  ngOnInit(): void {
    this.shoppingId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.shoppingId;
    this.configureNav();
    this.loadData();
  }

  configureNav(): void {
    this.app.listNav = [
      { nombre: 'Volver', url: 'shopping/register', type: 'btn-origin' },
      { nombre: 'Nuevo proveedor', url: 'shopping/suppliers/add', icon: 'fa-solid fa-plus', type: 'btn-success' }
    ];
    this.dataShared.OnSetNav(this.app.listNav);
    this.dataShared.OnSetBreadcrumb(this.isEditMode ? 'Compras/Edición' : 'Compras/Registro');
  }

  loadData(): void {
    this.supplierService.get().subscribe(data => {
      this.providers = data.result.map(item => ({
        id: item.id,
        name: `${item.proveedor} (${item.nit})`
      }));
    });

    this.productService.get().subscribe(data => {
      this.productRows = data.product;
      this.products = this.productRows.map(item => ({
        id: item.id,
        name: item.nombre || '',
        value: item.precio
      }));

      if (this.isEditMode) {
        this.loadShopping();
      } else {
        this.addItem();
      }
    });
  }

  loadShopping(): void {
    if (!this.shoppingId) return;

    this.shoppingService.getID(this.shoppingId).subscribe({
      next: data => {
        const shopping = data.result;
        this.purchaseForm.patchValue({
          invoiceNumber: shopping.codigo,
          provider: shopping.id_proveedor,
          totalBruto: shopping.total_compra,
          subtotal: shopping.total_compra,
          totalNeto: shopping.total_compra
        });

        this.items.clear();
        shopping.items.forEach(item => {
          this.items.push(this.newItem({
            product: item.id_producto,
            description: item.producto || '',
            quantity: item.cantidad,
            unitValue: item.valor_unitario,
            totalValue: item.total || 0
          }));
        });
        this.calculateTotals();
      },
      error: error => this.showError(error)
    });
  }

  get items(): FormArray {
    return this.purchaseForm.get('items') as FormArray;
  }

  newItem(value?: any): FormGroup {
    return this.fb.group({
      type: [value?.type || 1, Validators.required],
      product: [value?.product || null, Validators.required],
      description: [value?.description || ''],
      quantity: [value?.quantity || 1, [Validators.required, Validators.min(1)]],
      unitValue: [value?.unitValue || 0, Validators.required],
      discount: [value?.discount || 0],
      totalValue: [value?.totalValue || 0]
    });
  }

  addItem(): void {
    this.items.push(this.newItem());
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
    this.calculateTotals();
  }

  onProductSelect(index: number): void {
    const item = this.items.at(index);
    const productId = item.get('product')?.value;
    const selectedProduct = this.productRows.find(p => p.id == productId);

    if (selectedProduct) {
      item.patchValue({
        description: selectedProduct.nombre,
        unitValue: Number(selectedProduct.precio)
      });
    }
    this.calculateItemTotal(index);
  }

  onTypeSelect(index: number): void {
    const item = this.items.at(index);
    item.patchValue({ type: item.get('type')?.value || 1 });
  }

  calculateItemTotal(index: number): void {
    const item = this.items.at(index);
    const quantity = Number(item.get('quantity')?.value || 0);
    const unitValue = Number(item.get('unitValue')?.value || 0);
    const discount = Number(item.get('discount')?.value || 0);
    const total = (quantity * unitValue) - discount;
    item.patchValue({ totalValue: total }, { emitEvent: false });
    this.calculateTotals();
  }

  calculateTotals(): void {
    let totalBruto = 0;
    let descuentos = 0;

    this.items.controls.forEach(control => {
      totalBruto += Number(control.get('quantity')?.value || 0) * Number(control.get('unitValue')?.value || 0);
      descuentos += Number(control.get('discount')?.value || 0);
    });

    const subtotal = totalBruto - descuentos;
    this.purchaseForm.patchValue({
      totalBruto,
      descuentos,
      subtotal,
      totalNeto: subtotal
    }, { emitEvent: false });
  }

  onSubmit(): void {
    this.purchaseForm.markAllAsTouched();
    this.purchaseForm.updateValueAndValidity();

    if (this.purchaseForm.invalid || this.items.length === 0) {
      this.toastService.showToast({
        title: 'Proceso incompleto',
        message: 'Completa proveedor y al menos una línea.',
        type: 'warning',
        timeout: 3000
      });
      return;
    }

    const raw = this.purchaseForm.getRawValue();
    const payload: ShoppingDTO = {
      codigo: raw.invoiceNumber,
      id_proveedor: raw.provider,
      items: raw.items.map((item: any) => ({
        id_producto: item.product,
        cantidad: Number(item.quantity),
        valor_unitario: Number(item.unitValue)
      }))
    };

    const request = this.isEditMode && this.shoppingId
      ? this.shoppingService.put(this.shoppingId, payload)
      : this.shoppingService.post(payload);

    request.subscribe({
      next: () => {
        this.toastService.showToast({
          title: 'Proceso exitoso',
          message: this.isEditMode ? 'Compra actualizada correctamente.' : 'Compra creada correctamente.',
          type: 'success',
          timeout: 3000
        });
        this.router.navigate(['shopping/register']);
      },
      error: error => this.showError(error)
    });
  }

  generateCode(): string {
    return `FC-${Date.now()}`;
  }

  showError(error: any): void {
    this.toastService.showToast({
      title: 'Error ' + error.status,
      message: error.error?.message || error.message,
      type: 'error',
      timeout: 3000
    });
  }
}
