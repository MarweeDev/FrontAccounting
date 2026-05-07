import { Component, OnInit } from '@angular/core';
import { EmailValidator, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginRequest } from 'src/app/core/models/auth';
import { AuthService } from 'src/app/core/services/auth/auth.service';
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
    private authService: AuthService) {
    this.form = this.formBuilder.group({
      Email: ['', [Validators.required]],
      Password: ['', [Validators.required]],
    });

    this.currentYear = new Date().getFullYear();
  }

  ngOnInit(): void {
    if (this.authService.hasLegacySessionOnly()) {
      this.authService.clearSession();
    }

    if (this.authService.isAuthenticated()) {
      this.router.navigate(['sales/register']);
      return;
    }

    //Resetea los active en el menu lateral
    localStorage.removeItem("nav_left");
    let elementNav : any = document.getElementById('nav')?.style;
    let elementNavUser : any = document.getElementById('nav_user')?.style;
    if (elementNav) elementNav.display = "none";
    if (elementNavUser) elementNavUser.opacity = "0";
  }

  login () {
    // Validar todos los campos del formulario
    this.form.markAllAsTouched();

    // Actualizar la validez del formulario
    this.form.updateValueAndValidity();

    if(!this.form.status.includes('INVALID')) {
      
      const email = this.form.get('Email');
      const pass = this.form.get('Password');

      const t: LoginRequest = {
        email: email?.value,
        pass: pass?.value
      };

      this.authService.login(t).subscribe({
        next: data => {
        this.form.reset();

        if (data?.token) {
          this.authService.setSession(data);

          //this.router.navigate(['home/main']);
          this.router.navigate(['sales/register']);

          let elementNav : any = document.getElementById('nav')?.style;
          elementNav.display = "unset";

          this.toastService.showToast({
            title: 'Proceso exitoso',
            message: 'Inicio de sesión autorizado.',
            type: 'success',
            timeout: 5000,
          });
        }
        else {
          this.toastService.showToast({
            title: 'Proceso advertencia',
            message: 'Credenciales inválidas.',
            type: 'error',
            timeout: 5000,
          });
        }
        },
        error: (error: any) => {
          this.toastService.showToast({
            title: 'Error ' + error.status,
            message: error.error?.message || error.message,
            type: 'error',
            timeout: 3000
          });
        }
      });
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
