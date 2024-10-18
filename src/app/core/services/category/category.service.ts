import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { ApiConfig, HttpMethod, ServicesMethod } from '../appsettings';
import { CategoriaProductoDTO } from '../../models/categoriaProducto';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  ApiURL = ApiConfig.getUrl(ServicesMethod.ServicesCategory);

  //Id= 4:Disponible - 5:Reservada - 6:Descartada
  get(): Observable<any> {
    return this.http.get(this.ApiURL + HttpMethod.GET);
  }

  getID(id: any): Observable<any> {
    return this.http.get(this.ApiURL + HttpMethod.GETID + id);
  }

  post(data: CategoriaProductoDTO): Observable<CategoriaProductoDTO>{
    return this.http.post<CategoriaProductoDTO>(this.ApiURL + HttpMethod.POST, data);
  }

  put(id: any, data: CategoriaProductoDTO) : Observable<CategoriaProductoDTO> {
    return this.http.put<CategoriaProductoDTO>(this.ApiURL + HttpMethod.PUT + id, data);
  }

  delete(id: any, status: any) : Observable<CategoriaProductoDTO> {
    return this.http.put<CategoriaProductoDTO>(this.ApiURL + HttpMethod.DELETE + id, status);
  }
}
