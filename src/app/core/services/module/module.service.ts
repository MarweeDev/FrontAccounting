import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfig, HttpMethod, ServicesMethod } from '../appsettings';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {

  constructor(private http: HttpClient) { }

  ApiURL = ApiConfig.getUrl(ServicesMethod.ServicesModule);

  get(): Observable<any> {
    return this.http.get(this.ApiURL + HttpMethod.GET);
  }

  post(data: any): Observable<any> {
    return this.http.post(this.ApiURL + HttpMethod.POST, data);
  }

  put(id: number | string, data: any): Observable<any> {
    return this.http.put(this.ApiURL + HttpMethod.PUT + id, data);
  }

  delete(id: number | string): Observable<any> {
    return this.http.put(this.ApiURL + HttpMethod.DELETE + id, {});
  }
}
