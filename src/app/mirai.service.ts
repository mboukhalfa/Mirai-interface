import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvStatus, Iaas, Container, TriggerEvent, RecentAction, QuickAccess, IaasResources } from './api/api-types';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MiraiService {
  private url = 'http://127.0.0.1:8000/';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic YWRtaW46Ym91a2hhbGZh'
    })
  };
  constructor(private http: HttpClient) { }

  getEnvStatus(): Observable<EnvStatus> {
    return this.http.get<EnvStatus>(`${this.url}env-status/`, this.httpOptions)
  }

  getIaasList(): Observable<Iaas[]> {
    return this.http.get<Iaas[]>(`${this.url}iaas/`, this.httpOptions).pipe(
      map(response => {
        return response["results"]
       } )
      );
  }
  getContainerList(iaas_id: number): Observable<Container[]> {
    return this.http.get<Container[]>(`${this.url}iaas/${iaas_id}/container/`, this.httpOptions).pipe(
      map(response => {
        return response["results"]
       } )
      );
  }
  getTriggerEvents(): Observable<TriggerEvent[]> {
    return this.http.get<TriggerEvent[]>(`${this.url}trigger_events`);
  }

  getRecentActions(): Observable<RecentAction[]> {
    return this.http.get<RecentAction[]>(`${this.url}recent_actions`);
  }

  getQuickAccesses(): Observable<QuickAccess[]> {
    return this.http.get<QuickAccess[]>(`${this.url}quick_accesses`);
  }


  getIaasCapacity(id: number): Observable<IaasResources> {
    return this.http.get<IaasResources>(`${this.url}iaas_capacities/${id}`);
  }


  getIaasUsed(id: number): Observable<IaasResources> {
    return this.http.get<IaasResources>(`${this.url}iaas_used/${id}`);
  }
}
