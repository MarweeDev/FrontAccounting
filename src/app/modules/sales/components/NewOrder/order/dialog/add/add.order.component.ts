import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriaProductoDTO } from 'src/app/core/models/categoriaProducto';
import { ProductDTO } from 'src/app/core/models/product';
import { CategoryService } from 'src/app/core/services/category/category.service';
import { ProductService } from 'src/app/core/services/product/product.service';
import { ToastService } from 'src/app/shared/directives/toast.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.order.component.html',
  styleUrls: ['./add.order.component.css']
})
export class AddOrderComponent implements OnInit {
  form!: FormGroup;
  ListFilter: CategoriaProductoDTO[] = [];
  ListProductData: ProductDTO[] = [];
  selectedFile: File | null = null;
  previewImage = 'assets/img/product/default.png';
  imageLoaded = false;
  isEditMode = false;
  productId?: string;

  constructor(
    private toastService: ToastService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private ApiCateg: CategoryService,
    private ApiProduct: ProductService,
  ) {
    this.form = this.formBuilder.group({
      Nombre: ['', [Validators.required]],
      Descripcion: ['', [Validators.required]],
      Precio: ['', [Validators.required]],
      Categoria: [0, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') || undefined;
    this.isEditMode = !!this.productId;

    this.ApiCateg.get().subscribe({
      next: data => this.ListFilter = data.category,
      error: error => this.showError(error)
    });

    this.ApiProduct.get().subscribe({
      next: data => this.ListProductData = data.product,
      error: error => this.showError(error)
    });

    if (this.isEditMode && this.productId) {
      this.loadProduct(this.productId);
    }
  }

  loadProduct(id: string): void {
    this.ApiProduct.getID(id).subscribe({
      next: data => {
        const product: ProductDTO = data.product;
        this.form.patchValue({
          Nombre: product.nombre,
          Descripcion: product.descripcion,
          Precio: product.precio,
          Categoria: product.id_categoria
        });
        this.previewImage = product.image || 'assets/img/product/default.png';
        this.imageLoaded = !!product.image;
      },
      error: error => this.showError(error)
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    this.selectedFile = input.files[0];
    this.imageLoaded = true;

    const reader = new FileReader();
    reader.onload = () => {
      this.previewImage = reader.result as string;
    };
    reader.readAsDataURL(this.selectedFile);
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imageLoaded = false;
    this.previewImage = 'assets/img/product/default.png';

    const input = document.getElementById('productImage') as HTMLInputElement;
    if (input) input.value = '';
  }

  add(): void {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid) {
      this.toastService.showToast({
        title: 'Proceso advertencia',
        message: 'Campos incompletos',
        type: 'warning',
        timeout: 3000,
      });
      return;
    }

    const categoryId = this.form.get('Categoria')?.value;
    const formData = new FormData();
    formData.append('nombre', this.form.get('Nombre')?.value);
    formData.append('descripcion', this.form.get('Descripcion')?.value);
    formData.append('precio', this.form.get('Precio')?.value);
    formData.append('id_categoria', categoryId);
    formData.append('referencia', this.generateCodeproduct(categoryId));

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    const request = this.isEditMode && this.productId
      ? this.ApiProduct.put(this.productId, formData)
      : this.ApiProduct.post(formData);

    request.subscribe({
      next: () => {
        this.form.reset();
        this.router.navigate(['sales/order']);
        this.toastService.showToast({
          title: 'Proceso exitoso',
          message: this.isEditMode ? 'Producto actualizado correctamente.' : 'Producto creado correctamente.',
          type: 'success',
          timeout: 3000,
        });
      },
      error: error => this.showError(error)
    });
  }

  cancel(): void {
    this.form.reset();
    this.router.navigate(['sales/order']);
  }

  generateCodeproduct(id_categ: number): string {
    const country = sessionStorage.getItem('idCountry');
    const year = new Date().getFullYear();
    return `${country}-${id_categ}-${this.ListProductData?.length}${year}`;
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
