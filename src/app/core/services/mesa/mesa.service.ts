import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { MesaDTO } from '../../models/mesa';

@Injectable({
  providedIn: 'root'
})
export class MesaService {

  Url = 'http://localhost:3000/';
  Api = 'appdomain/api/mesa/get';

  constructor(private http: HttpClient) { }

  get(): Observable<any> {
    return this.http.get(this.Url + this.Api);
  }

}
