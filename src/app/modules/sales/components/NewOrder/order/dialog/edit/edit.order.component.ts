import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MesaDTO } from 'src/app/core/models/mesa';
import { MesaService } from 'src/app/core/services/mesa/mesa.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.order.component.html',
  styleUrls: ['./edit.order.component.css']
})
export class EditOrderComponent implements OnInit {
  form!: FormGroup;
  ListMesaData : MesaDTO | undefined;

  constructor(private formBuilder: FormBuilder, private apimesa : MesaService, private router:Router,
    private activated: ActivatedRoute) {

    this.form = this.formBuilder.group({
      Numero: ['', [Validators.required]],
      Nombre: ['', [Validators.required]],
      Capacidad: ['', [Validators.required]]
    });

  }

  ngOnInit(): void {
    this.details();
  }

  details(){
    const id = this.activated.snapshot.params['id'];

    this.apimesa.getID(id).subscribe(data => {
      this.ListMesaData = data.result

      this.form.get('Numero')?.setValue(this.ListMesaData?.numero);
      this.form.get('Nombre')?.setValue(this.ListMesaData?.nombre);
      this.form.get('Capacidad')?.setValue(this.ListMesaData?.capacidad);
    })
  }

  add() {
    // Validar todos los campos del formulario
    this.form.markAllAsTouched();

    // Actualizar la validez del formulario
    this.form.updateValueAndValidity();

    // Si el formulario es válido, continuar con la lógica de envío
    const t : MesaDTO = {
      numero: parseInt(this.form.get('Numero')?.value),
      nombre: this.form.get('Nombre')?.value,
      capacidad: parseInt(this.form.get('Capacidad')?.value),
    }

    if(!this.form.status.includes('INVALID')) {
      const id = this.activated.snapshot.params['id'];
      this.apimesa.put(id, t).subscribe(data => {
        this.form.reset();
        this.router.navigate(['sales']);
      }), (error: any) => {
        console.log(error);
      }
    }
    else {
      console.log(false)
    }
  }

  cancel(){
    this.form.reset();
    this.router.navigate(['sales']);
  }
}
