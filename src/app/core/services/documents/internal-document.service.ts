import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfig, ServicesMethod } from '../appsettings';
import { EmailDocumentRequestDTO } from '../../models/internalDocument';

@Injectable({
  providedIn: 'root'
})
export class InternalDocumentService {
  private readonly ApiURL = ApiConfig.getUrl(ServicesMethod.ServicesInternalDocument);

  constructor(private http: HttpClient) { }

  sendEmail(data: EmailDocumentRequestDTO): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.ApiURL}/send-email`, data);
  }
}
