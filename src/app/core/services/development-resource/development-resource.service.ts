import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfig, HttpMethod, ServicesMethod } from '../appsettings';
import { DevelopmentResourceDTO } from '../../models/developmentResource';

@Injectable({
  providedIn: 'root'
})
export class DevelopmentResourceService {
  private readonly ApiURL = ApiConfig.getUrl(ServicesMethod.ServicesDevelopmentResource);

  constructor(private http: HttpClient) { }

  get(): Observable<{ result: DevelopmentResourceDTO[] }> {
    return this.http.get<{ result: DevelopmentResourceDTO[] }>(this.ApiURL + HttpMethod.GET);
  }

  post(data: DevelopmentResourceDTO): Observable<{ message: string; result: DevelopmentResourceDTO }> {
    return this.http.post<{ message: string; result: DevelopmentResourceDTO }>(this.ApiURL + HttpMethod.POST, data);
  }

  put(id: number | string, data: DevelopmentResourceDTO): Observable<{ message: string; result: DevelopmentResourceDTO }> {
    return this.http.put<{ message: string; result: DevelopmentResourceDTO }>(this.ApiURL + HttpMethod.PUT + id, data);
  }

  delete(id: number | string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(this.ApiURL + HttpMethod.DELETE + id, {});
  }
}
