import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface LoadingState {
  active: boolean;
  message: string;
  mode: 'route' | 'request' | 'manual';
}

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private pendingTasks = 0;
  private hideTimer?: ReturnType<typeof setTimeout>;
  private readonly stateSubject = new BehaviorSubject<LoadingState>({
    active: false,
    message: 'Preparando vista',
    mode: 'manual'
  });

  readonly state$: Observable<LoadingState> = this.stateSubject.asObservable();

  show(message = 'Cargando informacion', mode: LoadingState['mode'] = 'manual'): void {
    this.pendingTasks += 1;

    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = undefined;
    }

    this.stateSubject.next({ active: true, message, mode });
  }

  hide(): void {
    this.pendingTasks = Math.max(0, this.pendingTasks - 1);
    if (this.pendingTasks > 0) return;

    this.hideTimer = setTimeout(() => {
      if (this.pendingTasks === 0) {
        this.stateSubject.next({
          ...this.stateSubject.value,
          active: false
        });
      }
    }, 180);
  }

  pulse(message = 'Cargando componentes', mode: LoadingState['mode'] = 'manual', duration = 700): void {
    this.show(message, mode);
    setTimeout(() => this.hide(), duration);
  }
}
