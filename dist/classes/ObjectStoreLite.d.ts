/// <reference types="node" />
import { Circuit } from './Circuit';
import { ObjectUpdateMessage } from './messages/ObjectUpdate';
import { ObjectUpdateCachedMessage } from './messages/ObjectUpdateCached';
import { ObjectUpdateCompressedMessage } from './messages/ObjectUpdateCompressed';
import { ImprovedTerseObjectUpdateMessage } from './messages/ImprovedTerseObjectUpdate';
import { MultipleObjectUpdateMessage } from './messages/MultipleObjectUpdate';
import { Agent } from './Agent';
import { UUID } from './UUID';
import { ClientEvents } from './ClientEvents';
import { KillObjectMessage } from './messages/KillObject';
import { IObjectStore } from './interfaces/IObjectStore';
import { NameValue } from './NameValue';
import { BotOptionFlags } from '..';
import { GameObject } from './GameObject';
import { RBush3D } from 'rbush-3d/dist';
export declare class ObjectStoreLite implements IObjectStore {
    protected circuit: Circuit;
    protected agent: Agent;
    protected objects: {
        [key: number]: GameObject;
    };
    protected objectsByUUID: {
        [key: string]: number;
    };
    protected objectsByParent: {
        [key: number]: number[];
    };
    protected clientEvents: ClientEvents;
    protected options: BotOptionFlags;
    rtree?: RBush3D;
    constructor(circuit: Circuit, agent: Agent, clientEvents: ClientEvents, options: BotOptionFlags);
    protected objectUpdate(objectUpdate: ObjectUpdateMessage): void;
    protected objectUpdateCached(objectUpdateCached: ObjectUpdateCachedMessage): void;
    protected objectUpdateCompressed(objectUpdateCompressed: ObjectUpdateCompressedMessage): void;
    protected objectUpdateTerse(objectUpdateTerse: ImprovedTerseObjectUpdateMessage): void;
    protected objectUpdateMultiple(objectUpdateMultiple: MultipleObjectUpdateMessage): void;
    protected killObject(killObj: KillObjectMessage): void;
    deleteObject(objectID: number): void;
    readExtraParams(buf: Buffer, pos: number, o: GameObject): number;
    getObjectsByParent(parentID: number): GameObject[];
    parseNameValues(str: string): {
        [key: string]: NameValue;
    };
    shutdown(): void;
    protected findParent(go: GameObject): GameObject;
    private populateChildren;
    getNumberOfObjects(): number;
    getObjectsInArea(minX: number, maxX: number, minY: number, maxY: number, minZ: number, maxZ: number): GameObject[];
    getObjectByUUID(fullID: UUID | string): GameObject;
    getObjectByLocalID(localID: number): GameObject;
    insertIntoRtree(obj: GameObject): void;
}
