import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { LoadingService } from '../services/loading/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private loadingService: LoadingService) { }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.shouldSkipLoader(req.url)) {
      return next.handle(req);
    }

    this.loadingService.show('Consultando datos', 'request');

    return next.handle(req).pipe(
      finalize(() => this.loadingService.hide())
    );
  }

  private shouldSkipLoader(url: string): boolean {
    return url.includes('/auth/login') || url.includes('/users/getInfoUser');
  }
}
