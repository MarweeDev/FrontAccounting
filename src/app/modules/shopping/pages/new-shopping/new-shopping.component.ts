import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { DataSharedServicesService } from 'src/app/shared/directives/data-shared-services.service';

// Interfaces para tipado de datos
interface Product {
  id: number;
  name: string;
  price: number;
}

interface Provider {
  id: number;
  name: string;
}

@Component({
  selector: 'app-new-shopping',
  templateUrl: './new-shopping.component.html',
  styleUrls: ['./new-shopping.component.css']
})
export class NewShoppingComponent implements OnInit {
purchaseForm: FormGroup;
  
  // Datos de ejemplo para los selectores
  providers = [
    { id: 1, name: 'Proveedor A S.A.S' },
    { id: 2, name: 'Importaciones B Ltda.' },
    { id: 3, name: 'Suministros C & Cia.' },
  ];
  
  products = [
    { id: 101, name: 'Producto X-100', price: 50.00 },
    { id: 102, name: 'Servicio de Mantenimiento', price: 120.00 },
    { id: 103, name: 'Insumo Y-20', price: 15.75 },
  ];

  typeShopping = [
    { id: 1, name: 'Compra' },
    { id: 2, name: 'Gasto' }
  ];

  constructor(private fb: FormBuilder,
        private route : ActivatedRoute,
        private app: AppComponent, 
        private DataShared: DataSharedServicesService
  ) {
    // Inicialización del formulario reactivo
    this.purchaseForm = this.fb.group({
      //type: [Validators.required],
      elaborationDate: [new Date().toISOString().substring(0, 10), Validators.required],
      invoiceNumber: [{ value: 177, disabled: true }],
      providerInvoice: ['', Validators.required],
      provider: [Validators.required],
      items: this.fb.array([]),
      observations: [''],
      totalBruto: [0],
      descuentos: [0],
      subtotal: [0],
      totalNeto: [0]
    });
  }

  ngOnInit(): void {
    // Añadir una fila de item por defecto al cargar el componente
    this.addItem();
  }

  ngAfterContentInit():void {
    //Opciones para el nav
    this.app.listNav = [
      { nombre: 'Volver', url: 'shopping/register', type: "btn-origin"},
      { nombre: 'Nuevo proveedor', url: 'sales/order', icon: 'fa-solid fa-plus', type: "btn-success"},
    ];
    this.DataShared.OnSetNav(this.app.listNav);

    //Cargar breadcrumb
    this.route.data.subscribe(data => {
      this.DataShared.OnSetBreadcrumb(data['breadcrumb']);
    });
  }

  // Getter para acceder fácilmente al FormArray de items
  get items(): FormArray {
    return this.purchaseForm.get('items') as FormArray;
  }

  /**
   * Crea un nuevo FormGroup para un item de la factura.
   */
  newItem(): FormGroup {
    return this.fb.group({
      type: [null, Validators.required],
      product: [null, Validators.required],
      description: [''],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitValue: [0, Validators.required],
      discount: [0],
      totalValue: [0]
    });
  }

  /**
   * Añade un nuevo item al FormArray.
   */
  addItem(): void {
    this.items.push(this.newItem());
  }

  /**
   * Elimina un item del FormArray en una posición específica.
   * @param index - El índice del item a eliminar.
   */
  removeItem(index: number): void {
    this.items.removeAt(index);
    this.calculateTotals();
  }

  /**
   * Se ejecuta cuando un usuario selecciona un producto en una fila.
   * Rellena automáticamente la descripción y el valor unitario.
   * @param index - El índice de la fila del item.
   */
  onProductSelect(index: number): void {
    const item = this.items.at(index);
    const productId = item.get('product')?.value;
    const selectedProduct = this.products.find(p => p.id == productId);

    if (selectedProduct) {
      item.patchValue({
        description: selectedProduct.name,
        unitValue: selectedProduct.price
      });
    }
    this.calculateItemTotal(index);
  }

  onTypeSelect(index: number): void {
    const item = this.items.at(index);
    const typeId = item.get('type')?.value;
    alert('Tipo seleccionado: ' + typeId);
  }

  /**
   * Calcula el valor total para un item específico basándose en
   * la cantidad, valor unitario y descuento.
   * @param index - El índice de la fila del item.
   */
  calculateItemTotal(index: number): void {
    const item = this.items.at(index);
    const quantity = item.get('quantity')?.value || 0;
    const unitValue = item.get('unitValue')?.value || 0;
    const discount = item.get('discount')?.value || 0;

    const total = (quantity * unitValue) - discount;
    item.patchValue({ totalValue: total }, { emitEvent: false }); // emitEvent: false para evitar bucles
    
    this.calculateTotals();
  }

  /**
   * Calcula los totales generales de la factura (bruto, descuentos, neto).
   */
  calculateTotals(): void {
    let totalBruto = 0;
    let descuentos = 0;

    this.items.controls.forEach(control => {
      const quantity = control.get('quantity')?.value || 0;
      const unitValue = control.get('unitValue')?.value || 0;
      const discount = control.get('discount')?.value || 0;
      
      totalBruto += quantity * unitValue;
      descuentos += discount;
    });

    const subtotal = totalBruto - descuentos;
    const totalNeto = subtotal; // Aquí irían cálculos de impuestos

    this.purchaseForm.patchValue({
      totalBruto: totalBruto,
      descuentos: descuentos,
      subtotal: subtotal,
      totalNeto: totalNeto
    });
  }

  /**
   * Procesa el envío del formulario.
   */
  onSubmit(): void {
    if (this.purchaseForm.valid) {
      console.log('Formulario Enviado:', this.purchaseForm.getRawValue());
      // Aquí iría la lógica para enviar los datos al backend
      alert('Compra creada exitosamente!');
    } else {
      console.error('El formulario no es válido.');
      // Marcar campos como tocados para mostrar errores
      this.purchaseForm.markAllAsTouched();
    }
  }
}
