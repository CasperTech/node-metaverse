/// <reference types="node" />
import { Region } from './Region';
import { EventQueueClient } from './EventQueueClient';
import { UUID } from './UUID';
import { ClientEvents } from './ClientEvents';
import { Agent } from './Agent';
import { HTTPAssets } from '..';
export declare class Caps {
    private region;
    private onGotSeedCap;
    private gotSeedCap;
    private capabilities;
    private clientEvents;
    private agent;
    private active;
    eventQueueClient: EventQueueClient | null;
    constructor(agent: Agent, region: Region, seedURL: string, clientEvents: ClientEvents);
    downloadAsset(uuid: UUID, type: HTTPAssets): Promise<Buffer>;
    request(url: string, data: string | Buffer, contentType: string): Promise<string>;
    waitForSeedCapability(): Promise<void>;
    getCapability(capability: string): Promise<string>;
    capsRequestUpload(url: string, data: Buffer): Promise<any>;
    capsRequestXML(capability: string, data: any): Promise<any>;
    shutdown(): void;
}
