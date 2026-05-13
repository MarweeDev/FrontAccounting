import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfig, ServicesMethod } from '../appsettings';
import { ShiftDTO } from '../../models/shift';

@Injectable({
  providedIn: 'root'
})
export class CashShiftService {
  private readonly ApiURL = ApiConfig.getUrl(ServicesMethod.ServicesCashShift);

  constructor(private http: HttpClient) { }

  current(): Observable<{ result: ShiftDTO | null }> {
    return this.http.get<{ result: ShiftDTO | null }>(`${this.ApiURL}/current`);
  }

  open(data: Pick<ShiftDTO, 'opening_amount' | 'notes'>): Observable<{ message: string; result: ShiftDTO }> {
    return this.http.post<{ message: string; result: ShiftDTO }>(`${this.ApiURL}/open`, data);
  }

  close(id: number | string, data: Pick<ShiftDTO, 'counted_cash' | 'notes'>): Observable<{ message: string; result: ShiftDTO }> {
    return this.http.put<{ message: string; result: ShiftDTO }>(`${this.ApiURL}/close/${id}`, data);
  }
}
