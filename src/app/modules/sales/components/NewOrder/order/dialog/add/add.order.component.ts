import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoriaProductoDTO } from 'src/app/core/models/categoriaProducto';
import { MesaDTO } from 'src/app/core/models/mesa';
import { ProductDTO } from 'src/app/core/models/product';
import { CategoryService } from 'src/app/core/services/category/category.service';
import { MesaService } from 'src/app/core/services/mesa/mesa.service';
import { ProductService } from 'src/app/core/services/product/product.service';
import { ToastService } from 'src/app/shared/directives/toast.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.order.component.html',
  styleUrls: ['./add.order.component.css']
})
export class AddOrderComponent implements OnInit {

  form!: FormGroup;
  //#region propietari
  ListFilter : CategoriaProductoDTO[] = [];
  ListProductData: ProductDTO[] = [];
  //#endregion

  // Imagenes
  selectedFile: File | null = null;
  previewImage = 'assets/img/product/default.png';
  imageLoaded = false;

  constructor(
    private toastService: ToastService,
    private formBuilder: FormBuilder, 
    private apimesa : MesaService, 
    private router:Router,
    private ApiCateg: CategoryService,
    private ApiProduct: ProductService,
  ) {

    this.form = this.formBuilder.group({
      Nombre: ['', [Validators.required]],
      Descripcion: ['', [Validators.required]],
      Precio: ['', [Validators.required]]
    });

  }

  ngAfterContentInit():void {
  }

  ngOnInit(): void {
    //Cargar filtros
    this.ApiCateg.get().subscribe(data => {
      this.ListFilter = data.category
    },
    error => {
      console.log('Error: ', error)
    });

    //Cargar productos
    this.ApiProduct.get().subscribe(data => {
      this.ListProductData = data.product
    },
    error => {
      console.log('Error: ', error)
    });
  }

  onImageSelected(event: Event) {
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

  removeImage() {
    this.selectedFile = null;
    this.imageLoaded = false;
    this.previewImage = 'assets/img/product/default.png';

    const input = document.getElementById('productImage') as HTMLInputElement;
    if (input) input.value = '';
  }

  add() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    const element: any = document.getElementById('select_categ');

    if (this.form.invalid || element?.value == 0) {
      this.toastService.showToast({
        title: 'Proceso advertencia',
        message: 'Campos incompletos',
        type: 'error',
        timeout: 5000,
      });
      return;
    }

    // 1️⃣ Crear FormData
    const formData = new FormData();

    // 2️⃣ Datos normales (lo mismo que ya tenías)
    formData.append('nombre', this.form.get('Nombre')?.value);
    formData.append('descripcion', this.form.get('Descripcion')?.value);
    formData.append('precio', this.form.get('Precio')?.value);
    formData.append('id_categoria', element.value);
    formData.append('referencia', this.generateCodeproduct(element.value));

    // 3️⃣ Imagen opcional
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    // 4️⃣ POST
    this.ApiProduct.post(formData).subscribe({
      next: () => {
        this.form.reset();
        this.router.navigate(['sales/order']);

        this.toastService.showToast({
          title: 'Proceso exitoso',
          message: 'Producto creado correctamente.',
          type: 'success',
          timeout: 5000,
        });
      },
      error: (error) => {
        this.toastService.showToast({
          title: 'Error ' + error.status,
          message: error.message,
          type: 'error',
          timeout: 3000
        });
      }
    });
  }

  /*addOld() {
    // Validar todos los campos del formulario
    this.form.markAllAsTouched();

    // Actualizar la validez del formulario
    this.form.updateValueAndValidity();

    let element :any = document.getElementById('select_categ');

    // Si el formulario es válido, continuar con la lógica de envío
    const t : ProductDTO = {
      nombre: this.form.get('Nombre')?.value,
      descripcion: this.form.get('Descripcion')?.value,
      precio: parseInt(this.form.get('Precio')?.value),
      id_categoria: element?.value,
      referencia: this.generateCodeproduct(element?.value)
    }

    if(!this.form.status.includes('INVALID') || element?.value != 0) {
      this.ApiProduct.post(t).subscribe(data => {
        this.form.reset();
        this.router.navigate(['sales/order']);

        this.toastService.showToast({
          title: 'Proceso exitoso',
          message: 'Producto creado correctamente.',
          type: 'success',
          timeout: 5000,
        });

      }), (error: any) => {
        this.toastService.showToast({
          title: 'Error ' + error.status,
          message: error.message,
          type: 'error',
          timeout: 3000
        });
      }
    }
    else {
      this.toastService.showToast({
        title: 'Proceso advertencia',
        message: 'Campos incompletos',
        type: 'error',
        timeout: 5000,
      });
    }
  }*/

  cancel(){
    this.form.reset();
    this.router.navigate(['sales/order']);
  }

  generateCodeproduct(id_categ:number) : string {
    let code = "00000";

    let country = sessionStorage.getItem('idCountry');
    const year = new Date().getFullYear();
    code =  country + '-' + id_categ + '-' + this.ListProductData?.length + year;
    return code;
  }

}
