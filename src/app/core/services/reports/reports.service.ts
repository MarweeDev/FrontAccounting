import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfig, HttpMethod, ServicesMethod } from '../appsettings';
import { InventoryMovementDTO } from '../../models/inventoryMovement';
import { StockDTO } from '../../models/stock';

export interface ReportFilters {
  dateFrom?: string;
  dateTo?: string;
  productId?: number | string;
  sellerId?: number | string;
  categoryId?: number | string;
  documentType?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  constructor(private http: HttpClient) { }

  sales(filters: ReportFilters): Observable<{ result: any[] }> {
    return this.get(ServicesMethod.ServicesReportSales, filters);
  }

  salesByProduct(filters: ReportFilters): Observable<{ result: any[] }> {
    return this.get(ServicesMethod.ServicesReportSalesByProduct, filters);
  }

  salesBySeller(filters: ReportFilters): Observable<{ result: any[] }> {
    return this.get(ServicesMethod.ServicesReportSalesBySeller, filters);
  }

  inventory(filters: ReportFilters): Observable<{ result: StockDTO[] }> {
    return this.get(ServicesMethod.ServicesReportInventory, filters);
  }

  inventoryMovement(filters: ReportFilters): Observable<{ result: InventoryMovementDTO[] }> {
    return this.get(ServicesMethod.ServicesReportInventoryMovement, filters);
  }

  private get<T>(endpoint: ServicesMethod, filters: ReportFilters): Observable<T> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.append(key, String(value));
      }
    });

    return this.http.get<T>(ApiConfig.getUrl(endpoint) + HttpMethod.GET, { params });
  }
}
