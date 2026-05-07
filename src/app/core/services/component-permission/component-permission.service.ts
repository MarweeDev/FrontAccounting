import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfig, HttpMethod, ServicesMethod } from '../appsettings';
import { ComponentPermissionDTO } from '../../models/componentPermission';

@Injectable({
  providedIn: 'root'
})
export class ComponentPermissionService {
  private readonly ApiURL = ApiConfig.getUrl(ServicesMethod.ServicesDevelopmentPermission);

  constructor(private http: HttpClient) { }

  get(): Observable<{ result: ComponentPermissionDTO[] }> {
    return this.http.get<{ result: ComponentPermissionDTO[] }>(this.ApiURL + HttpMethod.GET);
  }

  post(data: ComponentPermissionDTO): Observable<{ message: string; result: ComponentPermissionDTO }> {
    return this.http.post<{ message: string; result: ComponentPermissionDTO }>(this.ApiURL + HttpMethod.POST, data);
  }

  put(id: number | string, data: ComponentPermissionDTO): Observable<{ message: string; result: ComponentPermissionDTO }> {
    return this.http.put<{ message: string; result: ComponentPermissionDTO }>(this.ApiURL + HttpMethod.PUT + id, data);
  }

  delete(id: number | string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(this.ApiURL + HttpMethod.DELETE + id, {});
  }
}
