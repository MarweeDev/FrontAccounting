import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfig, HttpMethod, ServicesMethod } from '../appsettings';
import { SettingParameterDTO } from '../../models/settingParameter';

@Injectable({
  providedIn: 'root'
})
export class SettingParameterService {
  private readonly ApiURL = ApiConfig.getUrl(ServicesMethod.ServicesSettingParameter);

  constructor(private http: HttpClient) { }

  get(): Observable<{ result: SettingParameterDTO[] }> {
    return this.http.get<{ result: SettingParameterDTO[] }>(this.ApiURL + HttpMethod.GET);
  }

  post(data: SettingParameterDTO): Observable<{ message: string; result: SettingParameterDTO }> {
    return this.http.post<{ message: string; result: SettingParameterDTO }>(this.ApiURL + HttpMethod.POST, data);
  }

  put(id: number | string, data: SettingParameterDTO): Observable<{ message: string; result: SettingParameterDTO }> {
    return this.http.put<{ message: string; result: SettingParameterDTO }>(this.ApiURL + HttpMethod.PUT + id, data);
  }

  delete(id: number | string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(this.ApiURL + HttpMethod.DELETE + id, {});
  }
}
