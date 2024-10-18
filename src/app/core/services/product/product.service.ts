import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { ApiConfig, HttpMethod, ServicesMethod } from '../appsettings';
import { ProductDTO } from '../../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  ApiURL = ApiConfig.getUrl(ServicesMethod.ServicesProduct);

  //Id= 4:Disponible - 5:Reservada - 6:Descartada
  get(): Observable<any> {
    return this.http.get(this.ApiURL + HttpMethod.GET);
  }

  getCateg(id: any): Observable<any> {
    return this.http.get(this.ApiURL + HttpMethod.GETGLOBAL + id);
  }

  getID(id: any): Observable<any> {
    return this.http.get(this.ApiURL + HttpMethod.GETID + id);
  }

  post(data: ProductDTO): Observable<ProductDTO>{
    return this.http.post<ProductDTO>(this.ApiURL + HttpMethod.POST, data);
  }

  put(id: any, data: ProductDTO) : Observable<ProductDTO> {
    return this.http.put<ProductDTO>(this.ApiURL + HttpMethod.PUT + id, data);
  }

  putStatus(id: any, status: ProductDTO) : Observable<ProductDTO> {
    return this.http.put<ProductDTO>(this.ApiURL + HttpMethod.STATUS + id, status);
  }

  delete(id: any, status: any) : Observable<ProductDTO> {
    return this.http.put<ProductDTO>(this.ApiURL + HttpMethod.DELETE + id, status);
  }
}
