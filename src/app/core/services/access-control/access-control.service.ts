import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfig, HttpMethod, ServicesMethod } from '../appsettings';
import { AccessCatalogsDTO, AccessSummaryDTO, AccessUserDTO, AuditEventDTO, RoleDTO, RoleModuleDTO, SubscriberDTO } from '../../models/accessControl';

@Injectable({
  providedIn: 'root'
})
export class AccessControlService {
  private readonly ApiURL = ApiConfig.getUrl(ServicesMethod.ServicesAccessControl);
  private readonly RoleURL = ApiConfig.getUrl(ServicesMethod.ServicesRole);

  constructor(private http: HttpClient) { }

  summary(): Observable<{ result: AccessSummaryDTO }> {
    return this.http.get<{ result: AccessSummaryDTO }>(`${this.ApiURL}/summary`);
  }

  catalogs(): Observable<{ result: AccessCatalogsDTO }> {
    return this.http.get<{ result: AccessCatalogsDTO }>(`${this.ApiURL}/catalogs`);
  }

  getSubscribers(): Observable<{ result: SubscriberDTO[] }> {
    return this.http.get<{ result: SubscriberDTO[] }>(`${this.ApiURL}/subscribers${HttpMethod.GET}`);
  }

  postSubscriber(data: SubscriberDTO): Observable<{ message: string; result: SubscriberDTO }> {
    return this.http.post<{ message: string; result: SubscriberDTO }>(`${this.ApiURL}/subscribers${HttpMethod.POST}`, data);
  }

  putSubscriber(id: number | string, data: SubscriberDTO): Observable<{ message: string; result: SubscriberDTO }> {
    return this.http.put<{ message: string; result: SubscriberDTO }>(`${this.ApiURL}/subscribers${HttpMethod.PUT}${id}`, data);
  }

  deleteSubscriber(id: number | string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.ApiURL}/subscribers${HttpMethod.DELETE}${id}`, {});
  }

  getUsers(): Observable<{ result: AccessUserDTO[] }> {
    return this.http.get<{ result: AccessUserDTO[] }>(`${this.ApiURL}/users${HttpMethod.GET}`);
  }

  getAuditEvents(): Observable<{ result: AuditEventDTO[] }> {
    return this.http.get<{ result: AuditEventDTO[] }>(`${this.ApiURL}/audit${HttpMethod.GET}`);
  }

  postUser(data: AccessUserDTO): Observable<{ message: string; result: AccessUserDTO }> {
    return this.http.post<{ message: string; result: AccessUserDTO }>(`${this.ApiURL}/users${HttpMethod.POST}`, data);
  }

  putUser(id: number | string, data: AccessUserDTO): Observable<{ message: string; result: AccessUserDTO }> {
    return this.http.put<{ message: string; result: AccessUserDTO }>(`${this.ApiURL}/users${HttpMethod.PUT}${id}`, data);
  }

  deleteUser(id: number | string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.ApiURL}/users${HttpMethod.DELETE}${id}`, {});
  }

  postRole(data: RoleDTO): Observable<{ message: string; status: RoleDTO }> {
    return this.http.post<{ message: string; status: RoleDTO }>(this.RoleURL + HttpMethod.POST, data);
  }

  putRole(id: number | string, data: RoleDTO): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(this.RoleURL + HttpMethod.PUT + id, data);
  }

  deleteRole(id: number | string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(this.RoleURL + HttpMethod.DELETE + id, {});
  }

  updateRoleModules(id: number | string, moduleIds: number[]): Observable<{ message: string; result: RoleModuleDTO[] }> {
    return this.http.put<{ message: string; result: RoleModuleDTO[] }>(`${this.ApiURL}/roles/${id}/modules`, { moduleIds });
  }
}
