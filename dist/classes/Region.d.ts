import { Circuit } from './Circuit';
import { ObjectStore } from './ObjectStore';
import { Agent } from './Agent';
import { Caps } from './Caps';
import { Comms } from './Comms';
import { ClientEvents } from './ClientEvents';
export declare class Region {
    xCoordinate: number;
    yCoordinate: number;
    circuit: Circuit;
    objects: ObjectStore;
    caps: Caps;
    comms: Comms;
    clientEvents: ClientEvents;
    constructor(agent: Agent, clientEvents: ClientEvents);
    activateCaps(seedURL: string): void;
    shutdown(): void;
}
