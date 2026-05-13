import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfig, HttpMethod, ServicesMethod } from '../appsettings';
import { PaymentMethodConfigDTO, PaymentTransactionDetailDTO } from '../../models/paymentMethod';

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodService {
  private readonly MethodURL = ApiConfig.getUrl(ServicesMethod.ServicesPaymentMethod);
  private readonly DetailURL = ApiConfig.getUrl(ServicesMethod.ServicesPaymentTransactionDetail);

  constructor(private http: HttpClient) { }

  getMethods(): Observable<{ result: PaymentMethodConfigDTO[] }> {
    return this.http.get<{ result: PaymentMethodConfigDTO[] }>(this.MethodURL + HttpMethod.GET);
  }

  saveMethod(data: PaymentMethodConfigDTO): Observable<{ message: string; result: PaymentMethodConfigDTO }> {
    return this.http.post<{ message: string; result: PaymentMethodConfigDTO }>(this.MethodURL + HttpMethod.POST, data);
  }

  saveTransaction(data: PaymentTransactionDetailDTO): Observable<{ message: string; result: PaymentTransactionDetailDTO }> {
    return this.http.post<{ message: string; result: PaymentTransactionDetailDTO }>(this.DetailURL + HttpMethod.POST, data);
  }
}
