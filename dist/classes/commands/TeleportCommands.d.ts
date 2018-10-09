import { CommandsBase } from './CommandsBase';
import { Region } from '../Region';
import { Vector3 } from '../Vector3';
import * as Long from 'long';
import { LureEvent, TeleportEvent, Bot } from '../..';
import { Agent } from '../Agent';
export declare class TeleportCommands extends CommandsBase {
    private expectingTeleport;
    private teleportSubscription;
    constructor(region: Region, agent: Agent, bot: Bot);
    shutdown(): void;
    private awaitTeleportEvent;
    acceptTeleport(lure: LureEvent): Promise<TeleportEvent>;
    teleportToHandle(handle: Long, position: Vector3, lookAt: Vector3): Promise<TeleportEvent>;
    teleportTo(regionName: string, position: Vector3, lookAt: Vector3): Promise<TeleportEvent>;
}
