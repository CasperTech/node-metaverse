import { Circuit } from './Circuit';
import { Agent } from './Agent';
import { ClientEvents } from './ClientEvents';
export declare class Comms {
    private circuit;
    private agent;
    private clientEvents;
    constructor(circuit: Circuit, agent: Agent, clientEvents: ClientEvents);
    shutdown(): void;
}
