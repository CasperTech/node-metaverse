/// <reference types="long" />
/// <reference types="node" />
import { LoginParameters } from './classes/LoginParameters';
import { UUID } from './classes/UUID';
import * as Long from 'long';
import { MapInfoReply } from './events/MapInfoReply';
import { LureEvent } from './events/LureEvent';
import { HTTPAssets } from './enums/HTTPAssets';
import { TeleportEvent } from './events/TeleportEvent';
export declare class Bot {
    private loginParams;
    private currentRegion;
    private agent;
    private throttleGenCounter;
    private clientEvents;
    constructor(login: LoginParameters);
    login(): Promise<{}>;
    close(): Promise<{}>;
    setBandwidth(total: number): void;
    acceptTeleport(lure: LureEvent): Promise<TeleportEvent>;
    getRegionHandle(regionID: UUID): Promise<Long>;
    getRegionMapInfo(gridX: number, gridY: number): Promise<MapInfoReply>;
    connectToSim(): Promise<{}>;
    downloadAsset(type: HTTPAssets, uuid: UUID): Promise<Buffer>;
    uploadAsset(type: HTTPAssets, data: Buffer, name: string, description: string): Promise<UUID>;
}
