/// <reference types="node" />
import { Circuit } from './Circuit';
import { Agent } from './Agent';
import { ClientEvents } from './ClientEvents';
import { IObjectStore } from './interfaces/IObjectStore';
import { GameObjectLite } from './GameObjectLite';
import { NameValue } from './NameValue';
import { BotOptionFlags } from '..';
import { GameObjectFull } from './GameObjectFull';
export declare class ObjectStoreLite implements IObjectStore {
    private circuit;
    private agent;
    private objects;
    private objectsByUUID;
    private objectsByParent;
    private clientEvents;
    private options;
    constructor(circuit: Circuit, agent: Agent, clientEvents: ClientEvents, options: BotOptionFlags);
    deleteObject(objectID: number): void;
    readExtraParams(buf: Buffer, pos: number, o: GameObjectLite): number;
    getObjectsByParent(parentID: number): GameObjectLite[];
    parseNameValues(str: string): {
        [key: string]: NameValue;
    };
    shutdown(): void;
    getObjectsInArea(minX: number, maxX: number, minY: number, maxY: number, minZ: number, maxZ: number): GameObjectFull[];
}
