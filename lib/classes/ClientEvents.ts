import {LureEvent} from '../events/LureEvent';
import {ChatEvent} from '../events/ChatEvent';
import {TeleportEvent} from '../events/TeleportEvent';
import {Subject} from 'rxjs/Subject';
import {InstantMessageEvent} from '../events/InstantMessageEvent';
import {GroupInviteEvent} from '../events/GroupInviteEvent';
import {FriendRequestEvent} from '../events/FriendRequestEvent';
import {DisconnectEvent} from '../events/DisconnectEvent';
import {GroupChatEvent} from '../events/GroupChatEvent';
import {GroupChatSessionJoinEvent} from '../events/GroupChatSessionJoinEvent';
import {GroupChatSessionAgentListEvent} from '../events/GroupChatSessionAgentListEvent';

export class ClientEvents
{
    onNearbyChat: Subject<ChatEvent> = new Subject<ChatEvent>();
    onInstantMessage: Subject<InstantMessageEvent> = new Subject<InstantMessageEvent>();
    onGroupInvite: Subject<GroupInviteEvent> = new Subject<GroupInviteEvent>();
    onFriendRequest: Subject<FriendRequestEvent> = new Subject<FriendRequestEvent>();
    onLure: Subject<LureEvent> = new Subject<LureEvent>();
    onTeleportEvent: Subject<TeleportEvent> = new Subject<TeleportEvent>();
    onDisconnected: Subject<DisconnectEvent>  = new Subject<DisconnectEvent>();
    onCircuitLatency: Subject<number> = new Subject<number>();
    onGroupChat: Subject<GroupChatEvent> = new Subject<GroupChatEvent>();
    onGroupChatSessionJoin: Subject<GroupChatSessionJoinEvent> = new Subject<GroupChatSessionJoinEvent>();
    onGroupChatAgentListUpdate: Subject<GroupChatSessionAgentListEvent> = new Subject<GroupChatSessionAgentListEvent>();
}
