// src/app/services/toast.service.ts
import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

export interface ToastOptions {
  message: string;
  title?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timeout?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  private toast_open? : HTMLElement;
  private toastTimeout: any;
  private timeoutDelay = 5000; // duración del toast
  private remainingTime: number = 0;
  private startTime: number = 0;
  public action_close : boolean = true;

  public showToast(options: ToastOptions): void {
    const toast = this.createToastElement(options);
    this.toast_open = toast;
    this.renderer.appendChild(document.body, toast);
    this.action_close = true;

    // Controlamos el tiempo del toast
    this.timeoutDelay = options.timeout ?? 3000;

    // Aplicar el fadeout justo antes de que expire el tiempo
    /*this.toastTimeout = setTimeout(() => this.fadeOutToast(toast), this.timeoutDelay - 300); // Fade out 300ms antes del timeout
    this.toastTimeout = setTimeout(() => this.removeToast(toast), this.timeoutDelay); // Eliminar después del timeout completo
    */
   
    this.toastTimeout = setTimeout(() => this.hideToast(), this.timeoutDelay)
  }

  private createToastElement(options: ToastOptions): HTMLElement {
    const toast = this.renderer.createElement('div');
    const btnClose = this.renderer.createElement('span');
    const col1 = this.renderer.createElement('div');
    const icon = this.renderer.createElement('span');
    const col2 = this.renderer.createElement('div');
    const title = this.renderer.createElement('strong');
    const message = this.renderer.createElement('p');

    this.renderer.addClass(toast, 'toast');
    this.renderer.addClass(toast, options.type + "-toast"); // Agregar tipo de toast (success, error, etc.)

    // Eventos mouseenter / mouseleave para pausar y reanudar
    this.renderer.listen(toast, 'mouseenter', () => this.pauseToastTimer());
    this.renderer.listen(toast, 'mouseleave', () => this.resumeToastTimer());

    //Boton cerrar
    this.renderer.addClass(btnClose, 'btn-close');
    this.renderer.addClass(btnClose, options.type + '-close');
    this.renderer.setProperty(btnClose, 'innerText', 'X');
    this.renderer.listen(btnClose, 'click', () => this.hideToast());
    this.renderer.appendChild(toast, btnClose);

    //Col1
    this.renderer.setAttribute(col1, 'class', 'content-icon');
    this.renderer.setAttribute(icon, 'class', this.renderIconToast(options.type));
    this.renderer.appendChild(col1, icon);

    //Col2
    this.renderer.setAttribute(col2, 'class', 'content-body');
    if (options.title) {
      this.renderer.setProperty(title, 'innerText', options.title);
      this.renderer.appendChild(col2, title);
    }
    this.renderer.setProperty(message, 'innerText', options.message);
    this.renderer.appendChild(col2, message);

    this.renderer.appendChild(toast, col1);
    this.renderer.appendChild(toast, col2);

    // Iniciar con la animación de entrada (fadein)
    this.renderer.setStyle(toast, 'opacity', '0');
    setTimeout(() => this.renderer.setStyle(toast, 'opacity', '1'), 100); // Trigger de fadein

    return toast;
  }

  private fadeOutToast(toast: HTMLElement): void {
    if (this.action_close)
      this.renderer.setStyle(toast, 'opacity', '0'); // Iniciar el fadeout
  }

  private removeToast(toast: HTMLElement): void {
    if (this.action_close)
      this.renderer.removeChild(document.body, toast);
  }

  public hideToast(){
    if (this.toast_open) {
      this.renderer.setStyle(this.toast_open, 'opacity', '0');
      this.renderer.removeChild(document.body, this.toast_open);
      this.action_close = false;
    }
  }

  // Pausar
  private pauseToastTimer() {
    clearTimeout(this.toastTimeout);
    const elapsed = Date.now() - this.startTime;
    this.remainingTime -= elapsed;
  }

  // Reanudar
  private resumeToastTimer() {
    this.startTime = Date.now();
    this.toastTimeout = setTimeout(() => {
      this.hideToast();
    }, this.remainingTime);
  }

  private renderIconToast(type: any) {
    let classIcon = '';
    switch (type) {
      case 'success':
        classIcon = 'fa-solid fa-check';
        break;
      case 'warning':
        classIcon = 'fa-solid fa-exclamation';
        break;
      case 'info':
        classIcon = 'fa-solid fa-info';
        break;
      case 'error':
        classIcon = 'fa-solid fa-xmark';
        break;
      default:
        break;
    }
    return classIcon;
  }
}
