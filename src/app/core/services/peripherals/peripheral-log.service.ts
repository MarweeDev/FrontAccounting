import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { ApiConfig, HttpMethod, ServicesMethod } from '../appsettings';

export type PeripheralLogType = 'payment' | 'print' | 'device';
export type PeripheralLogStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'success' | 'failed' | 'skipped';

export interface PeripheralLogEntry {
  id: string;
  orderCode?: string;
  type: PeripheralLogType;
  status: PeripheralLogStatus;
  message: string;
  deviceMode?: string;
  payload?: any;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class PeripheralLogService {
  private readonly storageKey = 'peripherals.logs';
  private readonly maxEntries = 100;
  private readonly ApiURL = ApiConfig.getUrl(ServicesMethod.ServicesPeripheralEvent);

  constructor(private http: HttpClient) { }

  add(entry: Omit<PeripheralLogEntry, 'id' | 'createdAt'>): PeripheralLogEntry {
    const nextEntry: PeripheralLogEntry = {
      ...entry,
      id: `peripheral-log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString()
    };
    const entries = [nextEntry, ...this.getAll()].slice(0, this.maxEntries);
    localStorage.setItem(this.storageKey, JSON.stringify(entries));
    this.postToApi(nextEntry).subscribe();
    return nextEntry;
  }

  add$(entry: Omit<PeripheralLogEntry, 'id' | 'createdAt'>): Observable<PeripheralLogEntry> {
    const nextEntry = this.add(entry);
    return of(nextEntry);
  }

  getAll(): PeripheralLogEntry[] {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    } catch {
      return [];
    }
  }

  getByOrder(orderCode?: string): PeripheralLogEntry[] {
    if (!orderCode) return [];
    return this.getAll().filter(entry => entry.orderCode === orderCode);
  }

  getByOrder$(orderCode?: string): Observable<PeripheralLogEntry[]> {
    if (!orderCode) return of([]);

    return this.http.get<{ result: any[] }>(`${this.ApiURL}${HttpMethod.GET}/order/${orderCode}`).pipe(
      map(response => (response.result || []).map(item => this.fromApi(item))),
      catchError(() => of(this.getByOrder(orderCode)))
    );
  }

  clear(): void {
    localStorage.removeItem(this.storageKey);
  }

  private postToApi(entry: PeripheralLogEntry): Observable<any> {
    return this.http.post(`${this.ApiURL}${HttpMethod.POST}`, this.toApi(entry)).pipe(
      catchError(() => of(null))
    );
  }

  private toApi(entry: PeripheralLogEntry): any {
    return {
      codigo_orden: entry.orderCode,
      event_type: entry.type,
      event_status: entry.status,
      device_mode: entry.deviceMode,
      message: entry.message,
      payload: entry.payload
    };
  }

  private fromApi(item: any): PeripheralLogEntry {
    return {
      id: `${item.id}`,
      orderCode: item.codigo_orden,
      type: item.event_type,
      status: item.event_status,
      message: item.message,
      deviceMode: item.device_mode,
      payload: item.payload,
      createdAt: item.fecha_creacion
    };
  }
}
