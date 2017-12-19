import { LureEvent } from '../events/LureEvent';
import { ChatEvent } from '../events/ChatEvent';
import { TeleportEvent } from '../events/TeleportEvent';
import { Subject } from 'rxjs/Subject';
import { InstantMessageEvent } from '../events/InstantMessageEvent';
import { GroupInviteEvent } from '../events/GroupInviteEvent';
import { FriendRequestEvent } from '../events/FriendRequestEvent';
import { DisconnectEvent } from '../events/DisconnectEvent';
import { GroupChatEvent } from '../events/GroupChatEvent';
import { GroupChatSessionJoinEvent } from '../events/GroupChatSessionJoinEvent';
import { GroupChatSessionAgentListEvent } from '../events/GroupChatSessionAgentListEvent';
import { InventoryOfferedEvent } from '../events/InventoryOfferedEvent';
export declare class ClientEvents {
    onNearbyChat: Subject<ChatEvent>;
    onInstantMessage: Subject<InstantMessageEvent>;
    onGroupInvite: Subject<GroupInviteEvent>;
    onFriendRequest: Subject<FriendRequestEvent>;
    onInventoryOffered: Subject<InventoryOfferedEvent>;
    onLure: Subject<LureEvent>;
    onTeleportEvent: Subject<TeleportEvent>;
    onDisconnected: Subject<DisconnectEvent>;
    onCircuitLatency: Subject<number>;
    onGroupChat: Subject<GroupChatEvent>;
    onGroupChatSessionJoin: Subject<GroupChatSessionJoinEvent>;
    onGroupChatAgentListUpdate: Subject<GroupChatSessionAgentListEvent>;
}
