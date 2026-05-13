import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfig, HttpMethod, ServicesMethod } from '../appsettings';
import { PeripheralConfigDTO } from '../../models/peripheral';

@Injectable({
  providedIn: 'root'
})
export class PeripheralConfigService {
  private readonly ApiURL = ApiConfig.getUrl(ServicesMethod.ServicesPeripheralConfig);

  constructor(private http: HttpClient) { }

  get(): Observable<{ result: PeripheralConfigDTO | null }> {
    return this.http.get<{ result: PeripheralConfigDTO | null }>(this.ApiURL + HttpMethod.GET);
  }

  save(data: PeripheralConfigDTO): Observable<{ message: string; result: PeripheralConfigDTO }> {
    return this.http.post<{ message: string; result: PeripheralConfigDTO }>(this.ApiURL + HttpMethod.POST, data);
  }
}
