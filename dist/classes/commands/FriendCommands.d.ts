import { CommandsBase } from './CommandsBase';
import { Region } from '../Region';
import { Agent } from '../Agent';
import { Bot } from '../../Bot';
import { Subscription } from 'rxjs/internal/Subscription';
import { Friend, FriendRequestEvent, MapLocation, RightsFlags, UUID } from '../..';
export declare class FriendCommands extends CommandsBase {
    friendMessages: Subscription;
    friendsList: {
        [key: string]: Friend;
    };
    constructor(region: Region, agent: Agent, bot: Bot);
    grantFriendRights(friend: Friend | UUID | string, rights: RightsFlags): Promise<void>;
    getFriendMapLocation(friend: Friend | UUID | string): Promise<MapLocation>;
    acceptFriendRequest(event: FriendRequestEvent): Promise<void>;
    rejectFriendRequest(event: FriendRequestEvent): Promise<void>;
    sendFriendRequest(to: UUID | string, message: string): Promise<void>;
    shutdown(): void;
}
