import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { ApiConfig, HttpMethod, ServicesMethod } from '../appsettings';
import { MesaDTO } from '../../models/mesa';

@Injectable({
  providedIn: 'root'
})
export class MesaService {

  constructor(private http: HttpClient) { }

  ApiURL = ApiConfig.getUrl(ServicesMethod.ServicesMesa);

  get(): Observable<any> {
    return this.http.get(this.ApiURL + HttpMethod.GET);
  }

  getID(id: any): Observable<any> {
    return this.http.get(this.ApiURL + HttpMethod.GETID + id);
  }

  post(data: MesaDTO): Observable<MesaDTO>{
    return this.http.post<MesaDTO>(this.ApiURL + HttpMethod.POST, data);
  }

  put(id: any, data: MesaDTO) : Observable<MesaDTO> {
    return this.http.put<MesaDTO>(this.ApiURL + HttpMethod.PUT + id, data);
  }

  delete(id: any, data: MesaDTO) : Observable<MesaDTO> {
    return this.http.put<MesaDTO>(this.ApiURL + HttpMethod.DELETE + id, data);
  }

}
