import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { ApiConfig, HttpMethod, ServicesMethod } from '../appsettings';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  ApiURL = ApiConfig.getUrl(ServicesMethod.ServicesUsers);

  getLogin(data: any): Observable<any> {
    let params = new HttpParams();
    for (const key in data) {
      if (data.hasOwnProperty(key) && data[key] !== null && data[key] !== undefined) {
        params = params.append(key, data[key].toString());
      }
    }
    
    return this.http.get(this.ApiURL + HttpMethod.GET + "Login", {params});
  }

  getInfoUser(data: any): Observable<any> {
    let params = new HttpParams();
    for (const key in data) {
      if (data.hasOwnProperty(key) && data[key] !== null && data[key] !== undefined) {
        params = params.append(key, data[key].toString());
      }
    }
    
    return this.http.get(this.ApiURL + HttpMethod.GET + "InfoUser", {params});
  }
}
