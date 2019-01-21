import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvStatus, Iaas, TriggerEvent, RecentAction,QuickAccess, IaasResources } from './api/api-types';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MiraiService {
  private url = 'api/env_status';

  constructor(private http: HttpClient) { }

  getEnvStatus (): Observable<EnvStatus> {
    return this.http.get<EnvStatus>(this.url)
  }

  getIaasList (): Observable<Iaas[]> {
    return this.http.get<Iaas[]>('api/iaas_list');
  }

  getTriggerEvents (): Observable<TriggerEvent[]> {
    return this.http.get<TriggerEvent[]>('api/trigger_events');
  }

  getRecentActions (): Observable<RecentAction[]> {
    return this.http.get<RecentAction[]>('api/recent_actions');
  }

  getQuickAccesses (): Observable<QuickAccess[]> {
    return this.http.get<QuickAccess[]>('api/quick_accesses');
  }


  getIaasCapacity(id: number): Observable<IaasResources> {
    return this.http.get<IaasResources>(`api/iaas_capacities/${id}`);
  }


  getIaasUsed(id: number): Observable<IaasResources> {
    return this.http.get<IaasResources>(`api/iaas_used/${id}`);
  }
}
