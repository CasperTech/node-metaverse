/// <reference types="long" />
import { UUID } from './UUID';
import { Vector3 } from './Vector3';
import { Inventory } from './Inventory';
import Long = require('long');
import { Wearable } from './Wearable';
import { ControlFlags } from '../enums/ControlFlags';
import { Region } from './Region';
import { Packet } from './Packet';
import { ClientEvents } from './ClientEvents';
export declare class Agent {
    firstName: string;
    lastName: string;
    localID: number;
    agentID: UUID;
    accessMax: string;
    regionAccess: string;
    agentAccess: string;
    currentRegion: Region;
    controlFlags: ControlFlags;
    openID: {
        'token'?: string;
        'url'?: string;
    };
    AOTransition: boolean;
    buddyList: {
        'buddyRightsGiven': boolean;
        'buddyID': UUID;
        'buddyRightsHas': boolean;
    }[];
    uiFlags: {
        'allowFirstLife'?: boolean;
    };
    lookAt: Vector3;
    maxGroups: number;
    agentFlags: number;
    startLocation: string;
    cofVersion: number;
    home: {
        'regionHandle'?: Long;
        'position'?: Vector3;
        'lookAt'?: Vector3;
    };
    snapshotConfigURL: string;
    inventory: Inventory;
    gestures: {
        assetID: UUID;
        itemID: UUID;
    }[];
    agentAppearanceService: string;
    wearables?: {
        attachments: Wearable[];
        serialNumber: number;
    };
    agentUpdateTimer: number | null;
    private clientEvents;
    constructor(clientEvents: ClientEvents);
    setCurrentRegion(region: Region): void;
    circuitActive(): void;
    sendAgentUpdate(): void;
    shutdown(): void;
    onAnimState(packet: Packet): void;
    private animate(anim, run);
    startAnimations(anim: UUID[]): Promise<void>;
    stopAnimations(anim: UUID[]): Promise<void>;
    setInitialAppearance(): void;
}
