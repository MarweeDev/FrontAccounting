import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { ApiConfig, HttpMethod, ServicesMethod } from '../appsettings';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly infoUserCacheKey = 'infoUserCache';
  private infoUserCacheToken: string | null = null;
  private infoUserCacheData: any = null;

  constructor(private http: HttpClient) { }

  ApiURL = ApiConfig.getUrl(ServicesMethod.ServicesUsers);

  getLogin(data: any): Observable<any> {
    let params = new HttpParams();
    for (const key in data) {
      if (data.hasOwnProperty(key) && data[key] !== null && data[key] !== undefined) {
        params = params.append(key, data[key].toString());
      }
    }
    
    return this.http.get(this.ApiURL + HttpMethod.GET + "Login", {params});
  }

  getInfoUser(data: any): Observable<any> {
    let params = new HttpParams();
    for (const key in data) {
      if (data.hasOwnProperty(key) && data[key] !== null && data[key] !== undefined) {
        params = params.append(key, data[key].toString());
      }
    }
    
    return this.http.get(this.ApiURL + HttpMethod.GET + "InfoUser", {params});
  }

  getInfoUserCached(data: any): Observable<any> {
    const token = data?.token || '';

    if (this.infoUserCacheToken === token && this.infoUserCacheData) {
      return of(this.infoUserCacheData);
    }

    const stored = sessionStorage.getItem(this.infoUserCacheKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.token === token && parsed?.data) {
          this.infoUserCacheToken = token;
          this.infoUserCacheData = parsed.data;
          return of(parsed.data);
        }
      } catch {
        sessionStorage.removeItem(this.infoUserCacheKey);
      }
    }

    return this.getInfoUser(data).pipe(
      tap(response => {
        this.infoUserCacheToken = token;
        this.infoUserCacheData = response;
        sessionStorage.setItem(this.infoUserCacheKey, JSON.stringify({ token, data: response }));
      })
    );
  }

  clearInfoUserCache(): void {
    this.infoUserCacheToken = null;
    this.infoUserCacheData = null;
    sessionStorage.removeItem(this.infoUserCacheKey);
  }
}
