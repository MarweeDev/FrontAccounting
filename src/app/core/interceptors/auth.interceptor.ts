import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) { }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getAccessToken();
    const isLoginRequest = req.url.includes('/auth/login');

    if (!token) {
      return next.handle(req).pipe(
        catchError(error => this.handleAuthError(error, isLoginRequest))
      );
    }

    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next.handle(authReq).pipe(
      catchError(error => this.handleAuthError(error, isLoginRequest))
    );
  }

  private handleAuthError(error: unknown, isLoginRequest: boolean): Observable<never> {
    if (error instanceof HttpErrorResponse && !isLoginRequest && this.shouldShowStatusPage(error.status)) {
      if (error.status === 0 || error.status === 401 || error.status === 403) {
        this.authService.clearSession();
      }

      this.router.navigate(['status', error.status], {
        queryParams: {
          reason: this.getReason(error.status),
          message: error.error?.message || error.message || ''
        }
      });
    }

    return throwError(() => error);
  }

  private shouldShowStatusPage(status: number): boolean {
    return [0, 400, 401, 403, 404, 409, 422, 429, 500, 502, 503, 504].includes(status);
  }

  private getReason(status: number): string {
    const reasons: Record<number, string> = {
      0: 'network',
      400: 'bad-request',
      401: 'token',
      403: 'permission',
      404: 'not-found',
      409: 'conflict',
      422: 'validation',
      429: 'rate-limit',
      500: 'server',
      502: 'gateway',
      503: 'unavailable',
      504: 'timeout'
    };

    return reasons[status] || 'http';
  }
}
