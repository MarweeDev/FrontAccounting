import { Component, Input, OnInit } from '@angular/core';
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
  CodeOrder = 0;
  ProcessOrder = "Update";

  constructor(private formBuilder: FormBuilder, private apimesa : MesaService, private router:Router,
    private activated: ActivatedRoute) {

    this.form = this.formBuilder.group({
      Numero: ['', [Validators.required]],
      Nombre: ['', [Validators.required]],
      Capacidad: ['', [Validators.required]]
    });

  }

  ngOnInit(): void {
    const id = this.activated.snapshot.params['id'];
    this.CodeOrder = id;
  }
}
