import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { ApiConfig, HttpMethod, ServicesMethod } from '../appsettings';
import { OrderDTO } from '../../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  ApiURL = ApiConfig.getUrl(ServicesMethod.ServicesOrder);

  getID(id: any): Observable<any> {
    return this.http.get(this.ApiURL + HttpMethod.GETID + id);
  }

  get(): Observable<any> {
    return this.http.get(this.ApiURL + HttpMethod.GET + "All");
  }

  post(data: OrderDTO[]): Observable<OrderDTO[]>{
    debugger;
    return this.http.post<OrderDTO[]>(this.ApiURL + HttpMethod.POST, data);
  }

  //Get generador de código de orden
  getCodeOrder(): Observable<any> {
    return this.http.get(this.ApiURL + HttpMethod.GET + "/generateCodeOrder");
  }
}
