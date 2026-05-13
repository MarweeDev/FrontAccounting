import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfig, HttpMethod, ServicesMethod } from '../appsettings';
import { SupplierDTO } from '../../models/supplier';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  private readonly ApiURL = ApiConfig.getUrl(ServicesMethod.ServicesSupplier);

  constructor(private http: HttpClient) { }

  get(): Observable<{ result: SupplierDTO[] }> {
    return this.http.get<{ result: SupplierDTO[] }>(this.ApiURL + HttpMethod.GET);
  }

  getID(id: number | string): Observable<{ result: SupplierDTO }> {
    return this.http.get<{ result: SupplierDTO }>(this.ApiURL + HttpMethod.GETID + id);
  }

  post(data: SupplierDTO): Observable<{ message: string; result: SupplierDTO }> {
    return this.http.post<{ message: string; result: SupplierDTO }>(this.ApiURL + HttpMethod.POST, data);
  }

  put(id: number | string, data: SupplierDTO): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(this.ApiURL + HttpMethod.PUT + id, data);
  }

  delete(id: number | string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(this.ApiURL + HttpMethod.DELETE + id, {});
  }
}
