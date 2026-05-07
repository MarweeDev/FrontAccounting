import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfig, HttpMethod, ServicesMethod } from '../appsettings';
import { ShoppingDTO } from '../../models/shopping';

@Injectable({
  providedIn: 'root'
})
export class ShoppingService {

  private readonly ApiURL = ApiConfig.getUrl(ServicesMethod.ServicesShopping);

  constructor(private http: HttpClient) { }

  get(): Observable<{ result: ShoppingDTO[] }> {
    return this.http.get<{ result: ShoppingDTO[] }>(this.ApiURL + HttpMethod.GET);
  }

  getID(id: number | string): Observable<{ result: ShoppingDTO }> {
    return this.http.get<{ result: ShoppingDTO }>(this.ApiURL + HttpMethod.GETID + id);
  }

  post(data: ShoppingDTO): Observable<{ message: string; result: ShoppingDTO }> {
    return this.http.post<{ message: string; result: ShoppingDTO }>(this.ApiURL + HttpMethod.POST, data);
  }

  put(id: number | string, data: ShoppingDTO): Observable<{ message: string; result: ShoppingDTO }> {
    return this.http.put<{ message: string; result: ShoppingDTO }>(this.ApiURL + HttpMethod.PUT + id, data);
  }

  delete(id: number | string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(this.ApiURL + HttpMethod.DELETE + id, {});
  }
}
