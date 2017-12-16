/// <reference types="long" />
import { CommandsBase } from './CommandsBase';
import { LureEvent } from '../../events/LureEvent';
import { TeleportEvent } from '../../events/TeleportEvent';
import { Vector3 } from '../Vector3';
import * as Long from 'long';
export declare class TeleportCommands extends CommandsBase {
    private awaitTeleportEvent();
    acceptTeleport(lure: LureEvent): Promise<TeleportEvent>;
    teleportToHandle(handle: Long, position: Vector3, lookAt: Vector3): Promise<TeleportEvent>;
    teleportTo(regionName: string, position: Vector3, lookAt: Vector3): Promise<TeleportEvent>;
}
