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

  //Id= 4:Disponible - 5:Reservada - 6:Descartada
  get(id: any): Observable<any> {
    return this.http.get(this.ApiURL + HttpMethod.GET + "/global/" + id);
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

  putStatus(id: any, status: MesaDTO) : Observable<MesaDTO> {
    return this.http.put<MesaDTO>(this.ApiURL + "/status/" + id, status);
  }

  delete(id: any, status: any) : Observable<MesaDTO> {
    return this.http.put<MesaDTO>(this.ApiURL + HttpMethod.DELETE + id, status);
  }

}
