import { CommandsBase } from './CommandsBase';
import { Vector3 } from '../Vector3';
import * as Long from 'long';
import { LureEvent, TeleportEvent } from '../..';
export declare class TeleportCommands extends CommandsBase {
    private awaitTeleportEvent;
    acceptTeleport(lure: LureEvent): Promise<TeleportEvent>;
    teleportToHandle(handle: Long, position: Vector3, lookAt: Vector3): Promise<TeleportEvent>;
    teleportTo(regionName: string, position: Vector3, lookAt: Vector3): Promise<TeleportEvent>;
}
