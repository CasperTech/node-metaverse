import { Subject, type Subscription } from 'rxjs';
import type { GroupChatClosedEvent } from '../events/GroupChatClosedEvent';
import type { NewObjectEvent } from '../events/NewObjectEvent';
import type { ObjectUpdatedEvent } from '../events/ObjectUpdatedEvent';
import type { ObjectKilledEvent } from '../events/ObjectKilledEvent';
import type { SelectedObjectEvent } from '../events/SelectedObjectEvent';
import type { ChatEvent } from '../events/ChatEvent';
import type { InstantMessageEvent } from '../events/InstantMessageEvent';
import type { GroupInviteEvent } from '../events/GroupInviteEvent';
import type { FriendRequestEvent } from '../events/FriendRequestEvent';
import type { InventoryOfferedEvent } from '../events/InventoryOfferedEvent';
import type { LureEvent } from '../events/LureEvent';
import type { TeleportEvent } from '../events/TeleportEvent';
import type { DisconnectEvent } from '../events/DisconnectEvent';
import type { GroupChatEvent } from '../events/GroupChatEvent';
import type { GroupNoticeEvent } from '../events/GroupNoticeEvent';
import type { GroupChatSessionJoinEvent } from '../events/GroupChatSessionJoinEvent';
import type { GroupChatSessionAgentListEvent } from '../events/GroupChatSessionAgentListEvent';
import type { FriendResponseEvent } from '../events/FriendResponseEvent';
import type { ScriptDialogEvent } from '../events/ScriptDialogEvent';
import type { EventQueueStateChangeEvent } from '../events/EventQueueStateChangeEvent';
import type { FriendOnlineEvent } from '../events/FriendOnlineEvent';
import type { FriendRightsEvent } from '../events/FriendRightsEvent';
import type { FriendRemovedEvent } from '../events/FriendRemovedEvent';
import type { ObjectPhysicsDataEvent } from '../events/ObjectPhysicsDataEvent';
import type { ParcelPropertiesEvent } from '../events/ParcelPropertiesEvent';
import type { ObjectResolvedEvent } from '../events/ObjectResolvedEvent';
import type { Avatar } from './public/Avatar';
import type { BulkUpdateInventoryEvent } from '../events/BulkUpdateInventoryEvent';
import type { InventoryResponseEvent } from '../events/InventoryResponseEvent';
import type { LandStatsEvent } from '../events/LandStatsEvent';
import type { SimStatsEvent } from '../events/SimStatsEvent';
import type { BalanceUpdatedEvent } from '../events/BalanceUpdatedEvent';
import { TimeoutError } from './TimeoutError';
import { FilterResponse } from '../enums/FilterResponse';
import type { UUID } from './UUID';

export class ClientEvents
{
    public onNearbyChat: Subject<ChatEvent> = new Subject<ChatEvent>();
    public onInstantMessage: Subject<InstantMessageEvent> = new Subject<InstantMessageEvent>();
    public onGroupInvite: Subject<GroupInviteEvent> = new Subject<GroupInviteEvent>();
    public onFriendRequest: Subject<FriendRequestEvent> = new Subject<FriendRequestEvent>();
    public onInventoryOffered: Subject<InventoryOfferedEvent> = new Subject<InventoryOfferedEvent>();
    public onLure: Subject<LureEvent> = new Subject<LureEvent>();
    public onTeleportEvent: Subject<TeleportEvent> = new Subject<TeleportEvent>();
    public onDisconnected: Subject<DisconnectEvent>  = new Subject<DisconnectEvent>();
    public onCircuitLatency: Subject<number> = new Subject<number>();
    public onGroupChat: Subject<GroupChatEvent> = new Subject<GroupChatEvent>();
    public onGroupChatClosed: Subject<GroupChatClosedEvent> = new Subject<GroupChatClosedEvent>();
    public onGroupNotice: Subject<GroupNoticeEvent> = new Subject<GroupNoticeEvent>();
    public onGroupChatSessionJoin: Subject<GroupChatSessionJoinEvent> = new Subject<GroupChatSessionJoinEvent>();
    public onGroupChatAgentListUpdate: Subject<GroupChatSessionAgentListEvent> = new Subject<GroupChatSessionAgentListEvent>();
    public onFriendResponse: Subject<FriendResponseEvent> = new Subject<FriendResponseEvent>();
    public onInventoryResponse: Subject<InventoryResponseEvent> = new Subject<InventoryResponseEvent>();
    public onScriptDialog: Subject<ScriptDialogEvent> = new Subject<ScriptDialogEvent>();
    public onEventQueueStateChange: Subject<EventQueueStateChangeEvent> = new Subject<EventQueueStateChangeEvent>();
    public onFriendOnline: Subject<FriendOnlineEvent> = new Subject<FriendOnlineEvent>();
    public onFriendRights: Subject<FriendRightsEvent> = new Subject<FriendRightsEvent>();
    public onFriendRemoved: Subject<FriendRemovedEvent> = new Subject<FriendRemovedEvent>();
    public onPhysicsDataEvent: Subject<ObjectPhysicsDataEvent> = new Subject<ObjectPhysicsDataEvent>();
    public onParcelPropertiesEvent: Subject<ParcelPropertiesEvent> = new Subject<ParcelPropertiesEvent>();
    public onNewObjectEvent: Subject<NewObjectEvent> = new Subject<NewObjectEvent>();
    public onObjectUpdatedEvent: Subject<ObjectUpdatedEvent> = new Subject<ObjectUpdatedEvent>();
    public onObjectUpdatedTerseEvent: Subject<ObjectUpdatedEvent> = new Subject<ObjectUpdatedEvent>();
    public onObjectKilledEvent: Subject<ObjectKilledEvent> = new Subject<ObjectKilledEvent>();
    public onSelectedObjectEvent: Subject<SelectedObjectEvent> = new Subject<SelectedObjectEvent>();
    public onObjectResolvedEvent: Subject<ObjectResolvedEvent> = new Subject<ObjectResolvedEvent>();
    public onAvatarEnteredRegion: Subject<Avatar> = new Subject<Avatar>();
    public onRegionTimeDilation: Subject<number> = new Subject<number>();
    public onBulkUpdateInventoryEvent: Subject<BulkUpdateInventoryEvent> = new Subject<BulkUpdateInventoryEvent>();
    public onLandStatReplyEvent: Subject<LandStatsEvent> = new Subject<LandStatsEvent>();
    public onSimStats: Subject<SimStatsEvent> = new Subject<SimStatsEvent>();
    public onBalanceUpdated: Subject<BalanceUpdatedEvent> = new Subject<BalanceUpdatedEvent>();
    public onScriptRunningReply = new Subject<{
        ItemID: UUID,
        Mono: boolean,
        ObjectID: UUID,
        Running: boolean
    }>();

    public async waitForEvent<T>(subj: Subject<T>, messageFilter?: (message: T) => FilterResponse, timeout = 10000): Promise<T>
    {
        return new Promise<T>((resolve, reject) =>
        {
            const handleObj: {
                timeout: NodeJS.Timeout | null,
                subscription: Subscription | null
            } = {
                timeout: null,
                subscription: null
            };

            const timeoutFunc = (): void =>
            {
                if (handleObj.subscription !== null)
                {
                    handleObj.subscription.unsubscribe();
                    reject(new TimeoutError('Timeout waiting for event'));
                }
            };

            handleObj.timeout = setTimeout(timeoutFunc, timeout);

            handleObj.subscription = subj.subscribe((item: T) =>
            {
                let finish = false;
                if (messageFilter === undefined)
                {
                    finish = true;
                }
                else
                {
                    try
                    {
                        const filterResult = messageFilter(item);
                        if (filterResult === FilterResponse.Finish)
                        {
                            finish = true;
                        }
                        else if (filterResult === FilterResponse.Match)
                        {
                            // Extend
                            if (handleObj.timeout !== null)
                            {
                                clearTimeout(handleObj.timeout);
                            }
                            handleObj.timeout = setTimeout(timeoutFunc, timeout);
                        }
                    }
                    catch(e: unknown)
                    {
                        if (handleObj.timeout !== null)
                        {
                            clearTimeout(handleObj.timeout);
                            handleObj.timeout = null;
                        }
                        if (handleObj.subscription !== null)
                        {
                            handleObj.subscription.unsubscribe();
                            handleObj.subscription = null;
                        }
                        if (e instanceof Error)
                        {
                            reject(e);
                        }
                        else
                        {
                            reject(new Error('Failed running event filter'));
                        }
                    }
                }
                if (finish)
                {
                    if (handleObj.timeout !== null)
                    {
                        clearTimeout(handleObj.timeout);
                        handleObj.timeout = null;
                    }
                    if (handleObj.subscription !== null)
                    {
                        handleObj.subscription.unsubscribe();
                        handleObj.subscription = null;
                    }
                    resolve(item);
                }
            });
        });
    }
}
