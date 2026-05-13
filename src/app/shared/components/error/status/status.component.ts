import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {
  code = 401;
  title = 'Acceso no autorizado';
  detail = 'La sesion no es valida o expiro. Inicia sesion nuevamente para continuar.';
  icon = 'fa-solid fa-lock';
  actionLabel = 'Iniciar sesion';
  canGoBack = false;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.code = Number(this.route.snapshot.paramMap.get('code') || 401);
    const reason = this.route.snapshot.queryParamMap.get('reason');
    const message = this.route.snapshot.queryParamMap.get('message');

    this.applyStatus(reason);
    if (message && this.shouldShowBackendMessage()) {
      this.detail = message;
    }
  }

  primaryAction(): void {
    if (this.code === 401 || this.code === 403 || this.code === 0) {
      this.router.navigate(['login']);
      return;
    }

    this.router.navigate(['sales/register']);
  }

  goBack(): void {
    window.history.back();
  }

  private applyStatus(reason: string | null): void {
    const states: Record<number, { title: string; detail: string; icon: string; actionLabel: string; canGoBack: boolean }> = {
      0: {
        title: 'No hay conexion con el servidor',
        detail: 'No pudimos comunicarnos con la API. Revisa que el backend este iniciado y vuelve a intentarlo.',
        icon: 'fa-solid fa-plug-circle-xmark',
        actionLabel: 'Iniciar sesion',
        canGoBack: false
      },
      400: {
        title: 'Solicitud incorrecta',
        detail: 'La informacion enviada no tiene el formato que espera el sistema. Revisa los datos e intenta nuevamente.',
        icon: 'fa-solid fa-circle-exclamation',
        actionLabel: 'Volver al inicio',
        canGoBack: true
      },
      401: {
        title: 'Acceso no autorizado',
        detail: 'El token de seguridad no fue enviado, expiro o no pudo validarse. Por seguridad bloqueamos esta vista.',
        icon: 'fa-solid fa-lock',
        actionLabel: 'Iniciar sesion',
        canGoBack: false
      },
      403: {
        title: 'Permiso insuficiente',
        detail: 'Tu rol no tiene permisos para trabajar en este recurso. Solicita acceso a un administrador.',
        icon: 'fa-solid fa-shield-halved',
        actionLabel: 'Iniciar sesion',
        canGoBack: false
      },
      404: {
        title: 'Recurso no encontrado',
        detail: 'La ruta o informacion solicitada no existe o ya no esta disponible.',
        icon: 'fa-solid fa-map-location-dot',
        actionLabel: 'Volver al inicio',
        canGoBack: true
      },
      409: {
        title: 'Conflicto de informacion',
        detail: 'La accion no se pudo completar porque entra en conflicto con informacion existente.',
        icon: 'fa-solid fa-code-compare',
        actionLabel: 'Volver al inicio',
        canGoBack: true
      },
      422: {
        title: 'Datos no procesables',
        detail: 'Algunos campos no cumplen las reglas necesarias para guardar la informacion.',
        icon: 'fa-solid fa-list-check',
        actionLabel: 'Volver al inicio',
        canGoBack: true
      },
      429: {
        title: 'Demasiadas solicitudes',
        detail: 'El sistema recibio muchas peticiones en poco tiempo. Espera un momento y vuelve a intentar.',
        icon: 'fa-solid fa-hourglass-half',
        actionLabel: 'Volver al inicio',
        canGoBack: true
      },
      500: {
        title: 'Error interno del servidor',
        detail: 'La API encontro un problema inesperado. Intenta de nuevo o reporta este error.',
        icon: 'fa-solid fa-server',
        actionLabel: 'Volver al inicio',
        canGoBack: true
      },
      502: {
        title: 'Puerta de enlace no disponible',
        detail: 'Un servicio intermedio no respondio correctamente. Intenta nuevamente en unos minutos.',
        icon: 'fa-solid fa-network-wired',
        actionLabel: 'Volver al inicio',
        canGoBack: true
      },
      503: {
        title: 'Servicio no disponible',
        detail: 'El servidor no esta disponible en este momento. Puede estar iniciando o en mantenimiento.',
        icon: 'fa-solid fa-screwdriver-wrench',
        actionLabel: 'Volver al inicio',
        canGoBack: true
      },
      504: {
        title: 'Tiempo de espera agotado',
        detail: 'La operacion tardo demasiado en responder. Intenta nuevamente.',
        icon: 'fa-solid fa-clock',
        actionLabel: 'Volver al inicio',
        canGoBack: true
      }
    };

    const state = states[this.code] || {
      title: 'Respuesta inesperada',
      detail: 'El sistema recibio una respuesta HTTP no esperada.',
      icon: 'fa-solid fa-triangle-exclamation',
      actionLabel: 'Volver al inicio',
      canGoBack: true
    };

    this.title = state.title;
    this.detail = state.detail;
    this.icon = state.icon;
    this.actionLabel = state.actionLabel;
    this.canGoBack = state.canGoBack;

    if (reason === 'session') {
      this.detail = 'No encontramos una sesion activa valida para este modulo. Vuelve a iniciar sesion.';
    }
  }

  private shouldShowBackendMessage(): boolean {
    return ![0, 401, 403].includes(this.code);
  }

  goLogin(): void {
    this.router.navigate(['login']);
  }

}
