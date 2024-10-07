import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  getFind(data: any): Observable<any> {
    let params = new HttpParams();
    for (const key in data) {
      if (data.hasOwnProperty(key) && data[key] !== null && data[key] !== undefined) {
        params = params.append(key, data[key].toString());
      }
    }
    
    return this.http.get(this.ApiURL + HttpMethod.GET + "Find", {params});
  }

  getFinExport(data: any): Observable<any> {
    let params = new HttpParams();
    for (const key in data) {
      if (data.hasOwnProperty(key) && data[key] !== null && data[key] !== undefined) {
        params = params.append(key, data[key].toString());
      }
    }
    
    return this.http.get(this.ApiURL + HttpMethod.GET + "Export", {params});
  }

  post(data: OrderDTO[]): Observable<OrderDTO[]>{
    debugger;
    return this.http.post<OrderDTO[]>(this.ApiURL + HttpMethod.POST, data);
  }

  putStatus(data: any): Observable<any> {
    return this.http.put(this.ApiURL + HttpMethod.STATUS + "pay", data);
  }

  //Get generador de código de orden
  getCodeOrder(): Observable<any> {
    return this.http.get(this.ApiURL + HttpMethod.GET + "/generateCodeOrder");
  }
}
