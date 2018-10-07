import { Caps } from './Caps';
import * as request from 'request';
import { ClientEvents } from './ClientEvents';
import { Agent } from './Agent';
export declare class EventQueueClient {
    caps: Caps;
    ack?: number;
    done: boolean;
    currentRequest: request.Request | null;
    private clientEvents;
    private agent;
    constructor(agent: Agent, caps: Caps, clientEvents: ClientEvents);
    shutdown(): void;
    Get(): void;
    request(url: string, data: string, contentType: string): Promise<string>;
    capsRequestXML(capability: string, data: any, attempt?: number): Promise<any>;
}
