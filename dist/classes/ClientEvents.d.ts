import { Subject } from 'rxjs/Subject';
import { ChatEvent, DisconnectEvent, FriendRequestEvent, FriendResponseEvent, GroupChatEvent, GroupChatSessionAgentListEvent, GroupChatSessionJoinEvent, GroupInviteEvent, InstantMessageEvent, InventoryOfferedEvent, LureEvent, TeleportEvent } from '..';
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
    onFriendResponse: Subject<FriendResponseEvent>;
}
