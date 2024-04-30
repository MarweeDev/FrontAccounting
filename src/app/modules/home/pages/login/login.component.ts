import { Component, OnInit } from '@angular/core';
import { EmailValidator, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form!: FormGroup;
  iconBtnPass = true;
  inputType = "password";

  constructor(private router:Router, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      Email: ['', [Validators.required]],
      Password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    
  }

  login () {
    // Validar todos los campos del formulario
    this.form.markAllAsTouched();

    // Actualizar la validez del formulario
    this.form.updateValueAndValidity();

    if(!this.form.status.includes('INVALID')) {
      /*this.apimesa.post(t).subscribe(data => {
        this.form.reset();
        this.router.navigate(['sales/neworder']);
      }), (error: any) => {
        console.log(error);
      }*/
      this.router.navigate(['home/main']);
    }
  }

  onVisiblePass(){
    this.iconBtnPass = !this.iconBtnPass;
    this.inputType = !this.iconBtnPass ? 'text' : 'password';
  }
}
