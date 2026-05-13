import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { ApiConfig, HttpMethod, ServicesMethod } from '../appsettings';
import { TaxDTO } from '../../models/tax';

@Injectable({
  providedIn: 'root'
})
export class TaxService {
  private readonly ApiURL = ApiConfig.getUrl(ServicesMethod.ServicesTax);
  private readonly defaults: TaxDTO[] = [
    { id: 1, name: 'IVA', percentage: 19, module_scope: 'both', visible_modules: ['sales', 'shopping'], id_estado: 1 },
    { id: 2, name: 'Recargo servicio', percentage: 10, module_scope: 'sales', visible_modules: ['sales'], id_estado: 1 }
  ];

  constructor(private http: HttpClient) { }

  get(): Observable<{ result: TaxDTO[] }> {
    return this.http.get<{ result: TaxDTO[] }>(this.ApiURL + HttpMethod.GET).pipe(
      catchError(() => of({ result: this.defaults }))
    );
  }

  getForModule(module: 'sales' | 'shopping'): Observable<TaxDTO[]> {
    return this.get().pipe(
      map(data => (data.result || []).filter(item =>
        item.id_estado !== 0 && (item.module_scope === 'both' || item.module_scope === module)
      ))
    );
  }

  post(data: TaxDTO): Observable<{ message: string; result: TaxDTO }> {
    return this.http.post<{ message: string; result: TaxDTO }>(this.ApiURL + HttpMethod.POST, data);
  }

  put(id: number | string, data: TaxDTO): Observable<{ message: string; result: TaxDTO }> {
    return this.http.put<{ message: string; result: TaxDTO }>(this.ApiURL + HttpMethod.PUT + id, data);
  }

  delete(id: number | string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(this.ApiURL + HttpMethod.DELETE + id, {});
  }
}
