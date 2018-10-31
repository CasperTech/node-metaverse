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
    EventQueueStateChangeEvent,
    FriendOnlineEvent,
    FriendRightsEvent,
    FriendRemovedEvent,
    ObjectPhysicsDataEvent,
    ParcelPropertiesEvent
} from '..';
import {Subject} from 'rxjs/internal/Subject';
import {NewObjectEvent} from '../events/NewObjectEvent';
import {ObjectUpdatedEvent} from '../events/ObjectUpdatedEvent';
import {ObjectKilledEvent} from '../events/ObjectKilledEvent';


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
    onFriendOnline: Subject<FriendOnlineEvent> = new Subject<FriendOnlineEvent>();
    onFriendRights: Subject<FriendRightsEvent> = new Subject<FriendRightsEvent>();
    onFriendRemoved: Subject<FriendRemovedEvent> = new Subject<FriendRemovedEvent>();
    onPhysicsDataEvent: Subject<ObjectPhysicsDataEvent> = new Subject<ObjectPhysicsDataEvent>();
    onParcelPropertiesEvent: Subject<ParcelPropertiesEvent> = new Subject<ParcelPropertiesEvent>();
    onNewObjectEvent: Subject<NewObjectEvent> = new Subject<NewObjectEvent>();
    onObjectUpdatedEvent: Subject<ObjectUpdatedEvent> = new Subject<ObjectUpdatedEvent>();
    onObjectKilledEvent: Subject<ObjectKilledEvent> = new Subject<ObjectKilledEvent>();
}
