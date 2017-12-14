/// <reference types="node" />
import { Circuit } from './Circuit';
import { Agent } from './Agent';
import { NameValue } from './NameValue';
import { ClientEvents } from './ClientEvents';
import { IObjectStore } from './interfaces/IObjectStore';
import { GameObjectFull } from './GameObjectFull';
import { IGameObject } from './interfaces/IGameObject';
export declare class ObjectStoreFull implements IObjectStore {
    private circuit;
    private agent;
    private objects;
    private objectsByUUID;
    private objectsByParent;
    private clientEvents;
    constructor(circuit: Circuit, agent: Agent, clientEvents: ClientEvents);
    deleteObject(objectID: number): void;
    readExtraParams(buf: Buffer, pos: number, o: GameObjectFull): number;
    getObjectsByParent(parentID: number): IGameObject[];
    parseNameValues(str: string): {
        [key: string]: NameValue;
    };
    shutdown(): void;
}
