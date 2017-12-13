/// <reference types="node" />
import { Circuit } from './Circuit';
import { Agent } from './Agent';
import { GameObject } from './Object';
import { NameValue } from "./NameValue";
import { ClientEvents } from "./ClientEvents";
export declare class ObjectStore {
    private circuit;
    private agent;
    private objects;
    private objectsByUUID;
    private objectsByParent;
    private clientEvents;
    constructor(circuit: Circuit, agent: Agent, clientEvents: ClientEvents);
    readExtraParams(buf: Buffer, pos: number, o: GameObject): number;
    getObjectsByParent(parentID: number): GameObject[];
    parseNameValues(str: string): {
        [key: string]: NameValue;
    };
    shutdown(): void;
}
