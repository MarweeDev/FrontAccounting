import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfig, ServicesMethod } from '../appsettings';
import { LoginRequest, LoginResponse } from '../../models/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly ApiURL = ApiConfig.getUrl(ServicesMethod.ServicesAuth);

  constructor(private http: HttpClient) { }

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.ApiURL}/login`, data);
  }

  getAccessToken(): string | null {
    return sessionStorage.getItem('accessToken');
  }

  setSession(data: LoginResponse): void {
    sessionStorage.setItem('accessToken', data.token);

    if (data.legacyToken) {
      sessionStorage.setItem('authenticator', data.legacyToken);
    }

    if (data.user?.id_usuario) {
      sessionStorage.setItem('idUser', data.user.id_usuario.toString());
    }

    if (data.user?.id_pais) {
      sessionStorage.setItem('idCountry', data.user.id_pais.toString());
    }
  }

  clearSession(): void {
    sessionStorage.clear();
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken() || !!sessionStorage.getItem('authenticator');
  }
}
