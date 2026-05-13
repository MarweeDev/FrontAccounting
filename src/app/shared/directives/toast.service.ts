import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

export interface ToastOptions {
  message: string;
  title?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timeout?: number;
}

interface ToastRef {
  element: HTMLElement;
  progress: HTMLElement;
  timeoutId?: ReturnType<typeof setTimeout>;
  removeTimeoutId?: ReturnType<typeof setTimeout>;
  startedAt: number;
  remaining: number;
  duration: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private renderer: Renderer2;
  private container?: HTMLElement;
  private toasts = new Map<HTMLElement, ToastRef>();

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  public showToast(options: ToastOptions): void {
    const timeout = options.timeout ?? 3500;
    const toast = this.createToastElement(options);
    const progress = toast.querySelector('.toast-progress-bar') as HTMLElement;
    const ref: ToastRef = {
      element: toast,
      progress,
      startedAt: Date.now(),
      remaining: timeout,
      duration: timeout
    };

    this.ensureContainer();
    this.renderer.appendChild(this.container, toast);
    this.toasts.set(toast, ref);

    requestAnimationFrame(() => {
      this.renderer.addClass(toast, 'toast-visible');
      this.animateProgress(ref);
    });
    this.startTimer(ref);
  }

  private ensureContainer(): void {
    if (this.container) return;

    this.container = this.renderer.createElement('div');
    this.renderer.addClass(this.container, 'toast-container');
    this.renderer.appendChild(document.body, this.container);
  }

  private createToastElement(options: ToastOptions): HTMLElement {
    const toast = this.renderer.createElement('div');
    const btnClose = this.renderer.createElement('button');
    const col1 = this.renderer.createElement('div');
    const icon = this.renderer.createElement('span');
    const col2 = this.renderer.createElement('div');
    const title = this.renderer.createElement('strong');
    const message = this.renderer.createElement('p');
    const progress = this.renderer.createElement('div');
    const progressBar = this.renderer.createElement('div');

    this.renderer.addClass(toast, 'toast');
    this.renderer.addClass(toast, `${options.type}-toast`);
    this.renderer.listen(toast, 'mouseenter', () => this.pauseTimer(toast));
    this.renderer.listen(toast, 'mouseleave', () => this.resumeTimer(toast));

    this.renderer.addClass(btnClose, 'btn-close');
    this.renderer.addClass(btnClose, `${options.type}-close`);
    this.renderer.setAttribute(btnClose, 'type', 'button');
    this.renderer.setAttribute(btnClose, 'aria-label', 'Cerrar notificación');
    this.renderer.setProperty(btnClose, 'innerText', '×');
    this.renderer.listen(btnClose, 'click', () => this.hideToast(toast));
    this.renderer.appendChild(toast, btnClose);

    this.renderer.setAttribute(col1, 'class', 'content-icon');
    this.renderer.setAttribute(icon, 'class', this.renderIconToast(options.type));
    this.renderer.appendChild(col1, icon);

    this.renderer.setAttribute(col2, 'class', 'content-body');
    if (options.title) {
      this.renderer.setProperty(title, 'innerText', options.title);
      this.renderer.appendChild(col2, title);
    }
    this.renderer.setProperty(message, 'innerText', options.message);
    this.renderer.appendChild(col2, message);

    this.renderer.appendChild(toast, col1);
    this.renderer.appendChild(toast, col2);

    this.renderer.addClass(progress, 'toast-progress');
    this.renderer.addClass(progressBar, 'toast-progress-bar');
    this.renderer.addClass(progressBar, `${options.type}-progress`);
    this.renderer.appendChild(progress, progressBar);
    this.renderer.appendChild(toast, progress);

    return toast;
  }

  private startTimer(ref: ToastRef): void {
    ref.startedAt = Date.now();
    this.animateProgress(ref);
    ref.timeoutId = setTimeout(() => this.hideToast(ref.element), ref.remaining);
  }

  private animateProgress(ref: ToastRef): void {
    this.renderer.setStyle(ref.progress, 'transition', 'none');
    this.renderer.setStyle(ref.progress, 'width', `${(ref.remaining / ref.duration) * 100}%`);

    requestAnimationFrame(() => {
      this.renderer.setStyle(ref.progress, 'transition', `width ${ref.remaining}ms linear`);
      this.renderer.setStyle(ref.progress, 'width', '0%');
    });
  }

  private pauseTimer(toast: HTMLElement): void {
    const ref = this.toasts.get(toast);
    if (!ref?.timeoutId) return;

    clearTimeout(ref.timeoutId);
    ref.timeoutId = undefined;
    ref.remaining = Math.max(800, ref.remaining - (Date.now() - ref.startedAt));
    const width = ref.progress.getBoundingClientRect().width;
    const parentWidth = ref.progress.parentElement?.getBoundingClientRect().width || width;
    this.renderer.setStyle(ref.progress, 'transition', 'none');
    this.renderer.setStyle(ref.progress, 'width', `${(width / parentWidth) * 100}%`);
  }

  private resumeTimer(toast: HTMLElement): void {
    const ref = this.toasts.get(toast);
    if (!ref || ref.timeoutId) return;
    this.startTimer(ref);
  }

  public hideToast(toast?: HTMLElement): void {
    const target = toast || Array.from(this.toasts.keys())[0];
    if (!target) return;

    const ref = this.toasts.get(target);
    if (!ref) return;

    if (ref.timeoutId) clearTimeout(ref.timeoutId);
    if (ref.removeTimeoutId) clearTimeout(ref.removeTimeoutId);

    this.renderer.removeClass(target, 'toast-visible');
    this.renderer.addClass(target, 'toast-hidden');

    ref.removeTimeoutId = setTimeout(() => {
      if (target.parentNode) {
        this.renderer.removeChild(target.parentNode, target);
      }
      this.toasts.delete(target);
    }, 220);
  }

  private renderIconToast(type: ToastOptions['type']): string {
    switch (type) {
      case 'success':
        return 'fa-solid fa-check';
      case 'warning':
        return 'fa-solid fa-exclamation';
      case 'info':
        return 'fa-solid fa-info';
      case 'error':
        return 'fa-solid fa-xmark';
      default:
        return '';
    }
  }
}
