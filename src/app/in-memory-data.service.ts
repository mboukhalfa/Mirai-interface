import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const env_status = { online_iaas: 3, total_iaas: 5, online_container: 3 };
    const iaas_list = [
      { "id": 1, "name": "IAAS-1" },
      { "id": 2, "name": "IAAS-2" },
      { "id": 3, "name": "IAAS-3" },
    ];
    const trigger_events = [
      { "id": 1, "type": "Triggr event a", "source_iaas": "IAAS-6", "date": Date.now(), "containers": 10 },
      { "id": 2, "type": "Triggr event b", "source_iaas": "IAAS-1", "date": Date.now(), "containers": 11 },
      { "id": 3, "type": "Triggr event c", "source_iaas": "IAAS-3", "date": Date.now(), "containers": 3 },
      { "id": 4, "type": "Triggr event d", "source_iaas": "IAAS-1", "date": Date.now(), "containers": 4 },
      { "id": 5, "type": "Triggr event e", "source_iaas": "IAAS-4", "date": Date.now(), "containers": 15 },
      { "id": 6, "type": "Triggr event f", "source_iaas": "IAAS-1", "date": Date.now(), "containers": 21 },
      { "id": 7, "type": "Triggr event g", "source_iaas": "IAAS-3", "date": Date.now(), "containers": 1 },
    ];
    const recent_actions = [
      { "name": "Action 1", "date": Date.now(), "description": "some blabla about the action occurred" },
      { "name": "Action 2", "date": Date.now(), "description": "some blabla about the action occurred" },
      { "name": "Action 3", "date": Date.now(), "description": "some blabla about the action occurred" },
    ];

    const quick_accesses = [
      { "id": 1, "iaas_name": "IAAS-1", "status": "online" },
      { "id": 2, "iaas_name": "IAAS-2", "status": "offline" },
      { "id": 3, "iaas_name": "IAAS-3", "status": "busy" },
      { "id": 4, "iaas_name": "IAAS-4", "status": "away" },
      { "id": 5, "iaas_name": "IAAS-5", "status": "online" },
    ];
    const iaas_capacities = [
      {"id":1,"ram": 16, "disk": 2000, "cpu": 4},
      {"id":2,"ram": 8, "disk": 1000, "cpu": 3},
      {"id":3,"ram": 4, "disk": 500, "cpu": 2}
  ];
    const iaas_used = [
      {"id":1,"ram": 7, "disk": 500, "cpu": 2.5},
      {"id":2,"ram": 5, "disk": 600, "cpu": 1.5},
      {"id":3,"ram": 2, "disk": 200, "cpu": 1}, 
  ];
    return { env_status, iaas_list, trigger_events, recent_actions, quick_accesses, iaas_capacities, iaas_used };
  }


}