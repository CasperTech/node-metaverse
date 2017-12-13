import { CommandsBase } from './CommandsBase';
import { LureEvent } from '../../events/LureEvent';
import { TeleportEvent } from '../../events/TeleportEvent';
export declare class TeleportCommands extends CommandsBase {
    acceptTeleport(lure: LureEvent): Promise<TeleportEvent>;
}
