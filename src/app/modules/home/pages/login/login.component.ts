import { Component, OnInit } from '@angular/core';
import { EmailValidator, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user/user.service';
import { ToastService } from 'src/app/shared/directives/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form!: FormGroup;
  iconBtnPass = true;
  inputType = "password";
  currentYear: number;

  constructor(private router:Router, 
    private toastService: ToastService,
    private formBuilder: FormBuilder, 
    private api:UserService) {
    this.form = this.formBuilder.group({
      Email: ['', [Validators.required]],
      Password: ['', [Validators.required]],
    });

    this.currentYear = new Date().getFullYear();
  }

  ngOnInit(): void {
    //Resetea los active en el menu lateral
    localStorage.removeItem("nav_left");
  }

  login () {
    // Validar todos los campos del formulario
    this.form.markAllAsTouched();

    // Actualizar la validez del formulario
    this.form.updateValueAndValidity();

    if(!this.form.status.includes('INVALID')) {
      
      const email = this.form.get('Email');
      const pass = this.form.get('Password');

      let t = new login();
      t.email = email?.value;
      t.pass = pass?.value;

      this.api.getLogin(t).subscribe(data => {
        this.form.reset();
        console.log(data);

        if (data?.status != 204) {
          sessionStorage.setItem('authenticator', data?.result[0]?.token);
          //this.router.navigate(['home/main']);
          this.router.navigate(['sales/register']);

          this.toastService.showToast({
            title: 'Proceso exitoso',
            message: 'Inicio de sessión autorizado.',
            type: 'success',
            timeout: 5000,
          });
        }
        else {
          this.toastService.showToast({
            title: 'Proceso advertencia',
            message: data?.message,
            type: 'error',
            timeout: 5000,
          });
        }
        
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
        title: 'Proceso incompleto',
        message: 'Completar credenciales.',
        type: 'warning',
        timeout: 5000,
      });
    }
  }

  onVisiblePass(){
    this.iconBtnPass = !this.iconBtnPass;
    this.inputType = !this.iconBtnPass ? 'text' : 'password';
  }
}

export class login {
  email?: string;
  pass?: string;
}