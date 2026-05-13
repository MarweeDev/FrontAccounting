import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfig, HttpMethod, ServicesMethod } from '../appsettings';
import { InventoryMovementDTO } from '../../models/inventoryMovement';

export interface InventoryMovementFilters {
  dateFrom?: string;
  dateTo?: string;
  productId?: number | string;
  movementType?: string;
}

@Injectable({
  providedIn: 'root'
})
export class InventoryMovementService {
  private readonly ApiURL = ApiConfig.getUrl(ServicesMethod.ServicesInventoryMovement);

  constructor(private http: HttpClient) { }

  get(filters: InventoryMovementFilters = {}): Observable<{ result: InventoryMovementDTO[] }> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.append(key, String(value));
      }
    });

    return this.http.get<{ result: InventoryMovementDTO[] }>(this.ApiURL + HttpMethod.GET, { params });
  }
}
