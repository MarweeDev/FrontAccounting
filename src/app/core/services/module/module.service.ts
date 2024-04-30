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
}
