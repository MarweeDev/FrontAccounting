import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MesaDTO } from 'src/app/core/models/mesa';
import { MesaService } from 'src/app/core/services/mesa/mesa.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  form!: FormGroup;

  constructor(private formBuilder: FormBuilder, private apimesa : MesaService, private router:Router) {

    this.form = this.formBuilder.group({
      Numero: ['', [Validators.required]],
      Nombre: ['', [Validators.required]],
      Capacidad: ['', [Validators.required]]
    });

  }

  ngOnInit(): void {
    
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
      this.apimesa.post(t).subscribe(data => {
        this.form.reset();
        console.log(true)
      }), (error: any) => {
        console.log(error);
      }
    }
    else {
      console.log(false)
    }
  }

}
