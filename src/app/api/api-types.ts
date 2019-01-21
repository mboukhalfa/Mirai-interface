export class EnvStatus {
    online_iaas: number;
    total_iaas: number;
    online_container: number;
}

export class Iaas {
    id: number;
    name: string;
}


export class TriggerEvent {
    id: number;
    type: string;
    source_iaas: string;
    date: Date;
    containers: number;

}

export class RecentAction {
    name: string;
    date: Date;
    description: string;
}

export class QuickAccess {
    id: number;
    iaas_name: string;
    status: string;
}

export class IaasResources {
    iass: Iaas;
    ram: number;
    disk: number;
    cpu: number;
}
