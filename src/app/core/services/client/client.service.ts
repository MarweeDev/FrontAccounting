import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfig, HttpMethod, ServicesMethod } from '../appsettings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) { }

  ApiURL = ApiConfig.getUrl(ServicesMethod.ServicesClient);

  get(): Observable<any> {    
    return this.http.get(this.ApiURL + HttpMethod.GET);
  }

  post(body: any): Observable<any> {    
    return this.http.post(this.ApiURL + HttpMethod.POST, body);
  }
}
