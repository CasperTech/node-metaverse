import {Subject} from 'rxjs/Subject';
import {
    ChatEvent,
    DisconnectEvent,
    FriendRequestEvent,
    FriendResponseEvent,
    GroupChatEvent,
    GroupChatSessionAgentListEvent,
    GroupChatSessionJoinEvent,
    GroupInviteEvent,
    InstantMessageEvent,
    InventoryOfferedEvent,
    LureEvent,
    TeleportEvent,
    ScriptDialogEvent,
    EventQueueStateChangeEvent
} from '..';


export class ClientEvents
{
    onNearbyChat: Subject<ChatEvent> = new Subject<ChatEvent>();
    onInstantMessage: Subject<InstantMessageEvent> = new Subject<InstantMessageEvent>();
    onGroupInvite: Subject<GroupInviteEvent> = new Subject<GroupInviteEvent>();
    onFriendRequest: Subject<FriendRequestEvent> = new Subject<FriendRequestEvent>();
    onInventoryOffered: Subject<InventoryOfferedEvent> = new Subject<InventoryOfferedEvent>();
    onLure: Subject<LureEvent> = new Subject<LureEvent>();
    onTeleportEvent: Subject<TeleportEvent> = new Subject<TeleportEvent>();
    onDisconnected: Subject<DisconnectEvent>  = new Subject<DisconnectEvent>();
    onCircuitLatency: Subject<number> = new Subject<number>();
    onGroupChat: Subject<GroupChatEvent> = new Subject<GroupChatEvent>();
    onGroupChatSessionJoin: Subject<GroupChatSessionJoinEvent> = new Subject<GroupChatSessionJoinEvent>();
    onGroupChatAgentListUpdate: Subject<GroupChatSessionAgentListEvent> = new Subject<GroupChatSessionAgentListEvent>();
    onFriendResponse: Subject<FriendResponseEvent> = new Subject<FriendResponseEvent>();
    onScriptDialog: Subject<ScriptDialogEvent> = new Subject<ScriptDialogEvent>();
    onEventQueueStateChange: Subject<EventQueueStateChangeEvent> = new Subject<EventQueueStateChangeEvent>();
}
