import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { ApiConfig, HttpMethod, ServicesMethod } from '../appsettings';

@Injectable({
  providedIn: 'root'
})
export class TypepayService {

  constructor(private http: HttpClient) { }

  ApiURL = ApiConfig.getUrl(ServicesMethod.ServicesTypePay);

  get(): Observable<any> {
    return this.http.get(this.ApiURL + HttpMethod.GET);
  }
  getSub(id:any): Observable<any> {
    return this.http.get(this.ApiURL + HttpMethod.GET + "Sub/" + id);
  }
}
