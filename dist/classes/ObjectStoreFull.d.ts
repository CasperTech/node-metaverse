import { Circuit } from './Circuit';
import { ObjectUpdateMessage } from './messages/ObjectUpdate';
import { ObjectUpdateCachedMessage } from './messages/ObjectUpdateCached';
import { ObjectUpdateCompressedMessage } from './messages/ObjectUpdateCompressed';
import { ImprovedTerseObjectUpdateMessage } from './messages/ImprovedTerseObjectUpdate';
import { Agent } from './Agent';
import { ClientEvents } from './ClientEvents';
import { IObjectStore } from './interfaces/IObjectStore';
import { BotOptionFlags } from '..';
import { RBush3D } from 'rbush-3d/dist';
import { ObjectStoreLite } from './ObjectStoreLite';
export declare class ObjectStoreFull extends ObjectStoreLite implements IObjectStore {
    rtree?: RBush3D;
    constructor(circuit: Circuit, agent: Agent, clientEvents: ClientEvents, options: BotOptionFlags);
    protected objectUpdate(objectUpdate: ObjectUpdateMessage): void;
    protected objectUpdateCached(objectUpdateCached: ObjectUpdateCachedMessage): void;
    protected objectUpdateCompressed(objectUpdateCompressed: ObjectUpdateCompressedMessage): void;
    protected objectUpdateTerse(objectUpdateTerse: ImprovedTerseObjectUpdateMessage): void;
}
