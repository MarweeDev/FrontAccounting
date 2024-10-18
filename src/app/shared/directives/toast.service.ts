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

  showToast(options: ToastOptions): void {
    const toast = this.createToastElement(options);
    this.renderer.appendChild(document.body, toast);

    // Controlamos el tiempo del toast
    const timeout = options.timeout ?? 3000;

    // Aplicar el fadeout justo antes de que expire el tiempo
    setTimeout(() => this.fadeOutToast(toast), timeout - 300); // Fade out 300ms antes del timeout
    setTimeout(() => this.removeToast(toast), timeout); // Eliminar después del timeout completo
  }

  private createToastElement(options: ToastOptions): HTMLElement {
    const toast = this.renderer.createElement('div');
    const col1 = this.renderer.createElement('div');
    const icon = this.renderer.createElement('span');
    const col2 = this.renderer.createElement('div');
    const title = this.renderer.createElement('strong');
    const message = this.renderer.createElement('p');

    this.renderer.addClass(toast, 'toast');
    this.renderer.addClass(toast, options.type + "-toast"); // Agregar tipo de toast (success, error, etc.)

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
    setTimeout(() => this.renderer.setStyle(toast, 'opacity', '1'), 10); // Trigger de fadein

    return toast;
  }

  private fadeOutToast(toast: HTMLElement): void {
    this.renderer.setStyle(toast, 'opacity', '0'); // Iniciar el fadeout
  }

  private removeToast(toast: HTMLElement): void {
    this.renderer.removeChild(document.body, toast);
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
