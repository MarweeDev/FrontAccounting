// src/app/services/inactivity.service.ts
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class InactivityService {
  private timeoutId: any;
  private readonly logoutTime = 1800000; //1800000 = 30 minutos (en milisegundos)

  constructor(private router: Router, private ngZone: NgZone) {
    this.setupInactivityListener();
  }

  private setupInactivityListener(): void {
    const events = ['mousemove', 'keydown', 'click', 'scroll'];

    events.forEach((event) =>
      window.addEventListener(event, () => this.resetTimeout())
    );

    this.resetTimeout(); // Iniciar el temporizador al cargar la app
  }

  private resetTimeout(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId); // Limpiar timeout anterior
    }

    // Usamos NgZone para evitar problemas de detección de cambios en Angular
    this.ngZone.runOutsideAngular(() => {
      this.timeoutId = setTimeout(() => this.logout(), this.logoutTime);
    });
  }

  private logout(): void {
    // Aquí puedes limpiar el almacenamiento y redirigir a la página de login
    sessionStorage.removeItem('authenticator'); // O cualquier otra información de sesión
    this.router.navigate(['login']);
  }
}
