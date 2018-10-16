/// <reference types="node" />
import { Circuit } from './Circuit';
import { Agent } from './Agent';
import { UUID } from './UUID';
import { NameValue } from './NameValue';
import { ClientEvents } from './ClientEvents';
import { IObjectStore } from './interfaces/IObjectStore';
import { GameObjectFull } from './GameObjectFull';
import { IGameObject } from './interfaces/IGameObject';
import { BotOptionFlags } from '..';
import { RBush3D } from 'rbush-3d/dist';
export declare class ObjectStoreFull implements IObjectStore {
    private circuit;
    private agent;
    private objects;
    private objectsByUUID;
    private objectsByParent;
    private clientEvents;
    private options;
    rtree: RBush3D;
    constructor(circuit: Circuit, agent: Agent, clientEvents: ClientEvents, options: BotOptionFlags);
    insertIntoRtree(obj: GameObjectFull): void;
    deleteObject(objectID: number): void;
    readExtraParams(buf: Buffer, pos: number, o: GameObjectFull): number;
    getObjectsByParent(parentID: number): IGameObject[];
    getObjectByUUID(fullID: UUID | string): IGameObject;
    getObjectByLocalID(localID: number): IGameObject;
    parseNameValues(str: string): {
        [key: string]: NameValue;
    };
    shutdown(): void;
    private findParent;
    getObjectsInArea(minX: number, maxX: number, minY: number, maxY: number, minZ: number, maxZ: number): GameObjectFull[];
}
