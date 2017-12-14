/// <reference types="node" />
import { Circuit } from './Circuit';
import { Agent } from './Agent';
import { ClientEvents } from './ClientEvents';
import { IObjectStore } from './interfaces/IObjectStore';
import { GameObjectLite } from './GameObjectLite';
import { NameValue } from './NameValue';
export declare class ObjectStoreLite implements IObjectStore {
    private circuit;
    private agent;
    private objects;
    private objectsByUUID;
    private objectsByParent;
    private clientEvents;
    constructor(circuit: Circuit, agent: Agent, clientEvents: ClientEvents);
    deleteObject(objectID: number): void;
    readExtraParams(buf: Buffer, pos: number, o: GameObjectLite): number;
    getObjectsByParent(parentID: number): GameObjectLite[];
    parseNameValues(str: string): {
        [key: string]: NameValue;
    };
    shutdown(): void;
}
