import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { SupplierDTO } from 'src/app/core/models/supplier';
import { SupplierService } from 'src/app/core/services/supplier/supplier.service';
import { DataSharedServicesService } from 'src/app/shared/directives/data-shared-services.service';
import { ToastService } from 'src/app/shared/directives/toast.service';

@Component({
  selector: 'app-add.shopping',
  templateUrl: './add.shopping.component.html',
  styleUrls: ['./add.shopping.component.css']
})
export class AddShoppingComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private supplierService: SupplierService,
    private router: Router,
    private route: ActivatedRoute,
    private app: AppComponent,
    private dataShared: DataSharedServicesService,
    private toastService: ToastService
  ) {
    this.form = this.formBuilder.group({
      Proveedor: ['', [Validators.required]],
      Nit: ['', [Validators.required]],
      Contacto: ['', [Validators.required]],
      Descripcion: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.app.listNav = [
      { nombre: 'Volver', url: 'shopping/register/add', type: 'btn-origin' }
    ];
    this.dataShared.OnSetNav(this.app.listNav);
    this.route.data.subscribe(data => {
      this.dataShared.OnSetBreadcrumb(data['breadcrumb']);
    });
  }

  add(): void {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid) {
      this.toastService.showToast({
        title: 'Proceso incompleto',
        message: 'Completa los datos del proveedor.',
        type: 'warning',
        timeout: 3000
      });
      return;
    }

    const supplier: SupplierDTO = {
      proveedor: this.form.get('Proveedor')?.value,
      nit: this.form.get('Nit')?.value,
      contacto: this.form.get('Contacto')?.value,
      descripcion: this.form.get('Descripcion')?.value
    };

    this.supplierService.post(supplier).subscribe({
      next: () => {
        this.toastService.showToast({
          title: 'Proceso exitoso',
          message: 'Proveedor creado correctamente.',
          type: 'success',
          timeout: 3000
        });
        this.form.reset();
        this.router.navigate(['shopping/register/add']);
      },
      error: error => this.toastService.showToast({
        title: 'Error ' + error.status,
        message: error.error?.message || error.message,
        type: 'error',
        timeout: 3000
      })
    });
  }

  cancel(): void {
    this.form.reset();
    this.router.navigate(['shopping/register/add']);
  }
}
