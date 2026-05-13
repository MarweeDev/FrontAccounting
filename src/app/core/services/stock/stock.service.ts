import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfig, HttpMethod, ServicesMethod } from '../appsettings';
import { StockDTO } from '../../models/stock';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private readonly ApiURL = ApiConfig.getUrl(ServicesMethod.ServicesStock);

  constructor(private http: HttpClient) { }

  get(): Observable<{ result: StockDTO[] }> {
    return this.http.get<{ result: StockDTO[] }>(this.ApiURL + HttpMethod.GET);
  }

  getID(id: number | string): Observable<{ result: StockDTO }> {
    return this.http.get<{ result: StockDTO }>(this.ApiURL + HttpMethod.GETID + id);
  }

  post(data: StockDTO): Observable<{ message: string; result: StockDTO }> {
    return this.http.post<{ message: string; result: StockDTO }>(this.ApiURL + HttpMethod.POST, data);
  }

  put(id: number | string, data: StockDTO): Observable<{ message: string; result: StockDTO }> {
    return this.http.put<{ message: string; result: StockDTO }>(this.ApiURL + HttpMethod.PUT + id, data);
  }

  delete(id: number | string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(this.ApiURL + HttpMethod.DELETE + id, {});
  }
}
