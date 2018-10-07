import { Circuit } from './Circuit';
import { Agent } from './Agent';
import { Caps } from './Caps';
import { Comms } from './Comms';
import { ClientEvents } from './ClientEvents';
import { IObjectStore } from './interfaces/IObjectStore';
import { BotOptionFlags } from '..';
export declare class Region {
    xCoordinate: number;
    yCoordinate: number;
    circuit: Circuit;
    objects: IObjectStore;
    caps: Caps;
    comms: Comms;
    clientEvents: ClientEvents;
    options: BotOptionFlags;
    agent: Agent;
    constructor(agent: Agent, clientEvents: ClientEvents, options: BotOptionFlags);
    activateCaps(seedURL: string): void;
    shutdown(): void;
}
