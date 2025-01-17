import { CommandsBase } from './CommandsBase';
import type { Region } from '../Region';
import type { Agent } from '../Agent';
import type { Bot } from '../../Bot';
import type { Subscription } from 'rxjs';
import { Message } from '../../enums/Message';
import type { Packet } from '../Packet';
import type { OnlineNotificationMessage } from '../messages/OnlineNotification';
import type { OfflineNotificationMessage } from '../messages/OfflineNotification';
import type { TerminateFriendshipMessage } from '../messages/TerminateFriendship';
import { AcceptFriendshipMessage } from '../messages/AcceptFriendship';
import { ImprovedInstantMessageMessage } from '../messages/ImprovedInstantMessage';
import { InstantMessageDialog } from '../../enums/InstantMessageDialog';
import { Utils } from '../Utils';
import { DeclineFriendshipMessage } from '../messages/DeclineFriendship';
import type { ChangeUserRightsMessage } from '../messages/ChangeUserRights';
import { FindAgentMessage } from '../messages/FindAgent';
import { IPAddress } from '../IPAddress';
import { FilterResponse } from '../../enums/FilterResponse';
import { GrantUserRightsMessage } from '../messages/GrantUserRights';
import { Friend } from '../public/Friend';
import { RightsFlags } from '../../enums/RightsFlags';
import { FriendOnlineEvent } from '../../events/FriendOnlineEvent';
import { FriendRemovedEvent } from '../../events/FriendRemovedEvent';
import { FriendRightsEvent } from '../../events/FriendRightsEvent';
import { UUID } from '../UUID';
import { PacketFlags } from '../../enums/PacketFlags';
import type { MapLocation } from '../public/interfaces/MapLocation';
import type { FriendRequestEvent } from '../../events/FriendRequestEvent';
import { FolderType } from '../../enums/FolderType';
import { Vector3 } from '../Vector3';

export class FriendCommands extends CommandsBase
{
    private friendMessages?: Subscription;
    private readonly friendsList = new Map<string, Friend>();

    public constructor(region: Region, agent: Agent, bot: Bot)
    {
        super(region, agent, bot);

        // FriendResponse is handled by Comms because it's part of the InstantMessageImproved module.
        // We don't handle it here because it's always accompanied by an OnlineNotificationMessage.

        this.friendMessages = this.circuit.subscribeToMessages([
            Message.OnlineNotification,
            Message.OfflineNotification,
            Message.TerminateFriendship,
            Message.ChangeUserRights
        ], (packet: Packet) =>
        {
           void this.processPacket(packet);
        });
    }

    // noinspection JSUnusedGlobalSymbols
    public async grantFriendRights(friend: Friend | UUID | string, rights: RightsFlags): Promise<void>
    {
        let friendKey = UUID.zero();
        if (friend instanceof UUID)
        {
            friendKey = friend;
        }
        else if (friend instanceof Friend)
        {
            friendKey = friend.getKey();
        }
        else
        {
            friendKey = new UUID(friend);
        }
        const request: GrantUserRightsMessage = new GrantUserRightsMessage();
        request.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.circuit.sessionID
        };
        request.Rights = [
            {
                'AgentRelated': friendKey,
                'RelatedRights': rights
            }
        ];
        const sequenceNo = this.circuit.sendMessage(request, PacketFlags.Reliable);
        await this.circuit.waitForAck(sequenceNo, 10000);
    }

    public async getFriendMapLocation(friend: Friend | UUID | string): Promise<MapLocation>
    {
        let friendKey = UUID.zero();
        if (friend instanceof UUID)
        {
            friendKey = friend;
        }
        else if (friend instanceof Friend)
        {
            friendKey = friend.getKey();
        }
        else
        {
            friendKey = new UUID(friend);
        }
        const request: FindAgentMessage = new FindAgentMessage();
        request.AgentBlock = {
            'Hunter': this.agent.agentID,
            'Prey': friendKey,
            'SpaceIP': IPAddress.zero()
        };
        request.LocationBlock = [
            {
                GlobalX: 0.0,
                GlobalY: 0.0
            }
        ];
        this.circuit.sendMessage(request, PacketFlags.Reliable);
        const response: FindAgentMessage = await this.circuit.waitForMessage<FindAgentMessage>(Message.FindAgent, 10000, (filterMsg: FindAgentMessage) =>
        {
            if (filterMsg.AgentBlock.Hunter.equals(this.agent.agentID) && filterMsg.AgentBlock.Prey.equals(friendKey))
            {
                return FilterResponse.Finish;
            }
            return FilterResponse.NoMatch;
        });
        const globalPos = Utils.RegionCoordinatesToHandle(response.LocationBlock[0].GlobalX, response.LocationBlock[0].GlobalY);
        const mapInfo = await this.bot.clientCommands.grid.getRegionMapInfo(globalPos.regionX, globalPos.regionY);
        return {
            'regionName': mapInfo.block.name,
            'mapImage': mapInfo.block.mapImage,
            'regionHandle': globalPos.regionHandle,
            'regionX': globalPos.regionX,
            'regionY': globalPos.regionY,
            'localX': Math.floor(globalPos.localX),
            'localY': Math.floor(globalPos.localY),
            'avatars': mapInfo.avatars
        };
    }

    // noinspection JSUnusedGlobalSymbols
    public getFriend(key: UUID): Friend | undefined
    {
        return this.friendsList.get(key.toString());
    }

    public async acceptFriendRequest(event: FriendRequestEvent): Promise<void>
    {
        const accept: AcceptFriendshipMessage = new AcceptFriendshipMessage();
        accept.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.circuit.sessionID
        };
        accept.TransactionBlock = {
            TransactionID: event.requestID
        };
        accept.FolderData = [];
        accept.FolderData.push(
            {
                'FolderID': this.agent.inventory.findFolderForType(FolderType.CallingCard)
            }
        );
        const sequenceNo = this.circuit.sendMessage(accept, PacketFlags.Reliable);
        await this.circuit.waitForAck(sequenceNo, 10000);
    }

    public async rejectFriendRequest(event: FriendRequestEvent): Promise<void>
    {
        const reject: DeclineFriendshipMessage = new DeclineFriendshipMessage();
        reject.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.circuit.sessionID
        };
        reject.TransactionBlock = {
            TransactionID: event.requestID
        };
        const sequenceNo = this.circuit.sendMessage(reject, PacketFlags.Reliable);
        await this.circuit.waitForAck(sequenceNo, 10000);
    }

    public async sendFriendRequest(to: UUID | string, message: string): Promise<void>
    {
        if (typeof to === 'string')
        {
            to = new UUID(to);
        }
        const requestID = UUID.random();
        const agentName = this.agent.firstName + ' ' + this.agent.lastName;
        const im: ImprovedInstantMessageMessage = new ImprovedInstantMessageMessage();
        im.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.circuit.sessionID
        };
        im.MessageBlock = {
            FromGroup: false,
            ToAgentID: to,
            ParentEstateID: 0,
            RegionID: UUID.zero(),
            Position: Vector3.getZero(),
            Offline: 0,
            Dialog: InstantMessageDialog.FriendshipOffered,
            ID: requestID,
            Timestamp: Math.floor(new Date().getTime() / 1000),
            FromAgentName: Utils.StringToBuffer(agentName),
            Message: Utils.StringToBuffer(message),
            BinaryBucket: Utils.StringToBuffer('')
        };
        im.EstateBlock = {
            EstateID: 0
        };
        const sequenceNo = this.circuit.sendMessage(im, PacketFlags.Reliable);
        await this.circuit.waitForAck(sequenceNo, 10000);
    }

    public override shutdown(): void
    {
        if (this.friendMessages)
        {
            this.friendMessages.unsubscribe();
            delete this.friendMessages;
        }
    }

    private async processPacket(packet: Packet): Promise<void>
    {
        switch (packet.message.id)
        {
            case Message.OnlineNotification:
            {
                const msg = packet.message as OnlineNotificationMessage;
                for (const agentEntry of msg.AgentBlock)
                {
                    const uuidStr = agentEntry.AgentID.toString();
                    if (this.friendsList.has(uuidStr) === undefined)
                    {
                        const friend = await this.bot.clientCommands.grid.avatarKey2Name(agentEntry.AgentID) as Friend;
                        friend.online = false;
                        friend.myRights = RightsFlags.None;
                        friend.theirRights = RightsFlags.None;
                        this.friendsList.set(uuidStr, friend);
                    }
                    const friend = this.friendsList.get(uuidStr);
                    if (friend && !friend.online)
                    {
                        friend.online = true;
                        const friendOnlineEvent = new FriendOnlineEvent();
                        friendOnlineEvent.friend = friend;
                        friendOnlineEvent.online = true;
                        this.bot.clientEvents.onFriendOnline.next(friendOnlineEvent);
                    }
                }
                break;
            }
            case Message.OfflineNotification:
            {
                const msg = packet.message as OfflineNotificationMessage;
                for (const agentEntry of msg.AgentBlock)
                {
                    const uuidStr = agentEntry.AgentID.toString();
                    if (this.friendsList.has(uuidStr) === undefined)
                    {
                        const friend = await this.bot.clientCommands.grid.avatarKey2Name(agentEntry.AgentID) as Friend;
                        friend.online = false;
                        friend.myRights = RightsFlags.None;
                        friend.theirRights = RightsFlags.None;
                        this.friendsList.set(uuidStr, friend);
                    }
                    const friend = this.friendsList.get(uuidStr);
                    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
                    if (friend !== undefined && friend.online)
                    {
                        friend.online = false;
                        const friendOnlineEvent = new FriendOnlineEvent();
                        friendOnlineEvent.friend = friend;
                        friendOnlineEvent.online = false;
                        this.bot.clientEvents.onFriendOnline.next(friendOnlineEvent);
                    }
                }
                break;
            }
            case Message.TerminateFriendship:
            {
                const msg = packet.message as TerminateFriendshipMessage;
                const friendID = msg.ExBlock.OtherID;
                const uuidStr = friendID.toString();
                const friend = this.friendsList.get(uuidStr);
                if (friend !== undefined)
                {
                    const event = new FriendRemovedEvent();
                    event.friend = friend;
                    this.bot.clientEvents.onFriendRemoved.next(event);
                    this.friendsList.delete(uuidStr);
                }
                break;
            }
            case Message.ChangeUserRights:
            {
                const msg = packet.message as ChangeUserRightsMessage;
                for (const rightsEntry of msg.Rights)
                {
                    let uuidStr = '';
                    if (rightsEntry.AgentRelated.equals(this.agent.agentID))
                    {
                        // My rights
                        uuidStr = msg.AgentData.AgentID.toString();
                        if (!this.friendsList.has(uuidStr))
                        {
                            const friend = await this.bot.clientCommands.grid.avatarKey2Name(rightsEntry.AgentRelated) as Friend;
                            friend.online = false;
                            friend.myRights = RightsFlags.None;
                            friend.theirRights = RightsFlags.None;
                            this.friendsList.set(uuidStr, friend);
                        }
                        const friend = this.friendsList.get(uuidStr);
                        if (friend !== undefined)
                        {
                            friend.myRights = rightsEntry.RelatedRights;
                        }
                    }
                    else
                    {
                        uuidStr = rightsEntry.AgentRelated.toString();
                        if (!this.friendsList.has(uuidStr))
                        {
                            const friend = await this.bot.clientCommands.grid.avatarKey2Name(rightsEntry.AgentRelated) as Friend;
                            friend.online = false;
                            friend.myRights = RightsFlags.None;
                            friend.theirRights = RightsFlags.None;
                            this.friendsList.set(uuidStr, friend);
                        }
                        const friend = this.friendsList.get(uuidStr);
                        if (friend !== undefined)
                        {
                            friend.theirRights = rightsEntry.RelatedRights;
                        }
                    }
                    const friend = this.friendsList.get(uuidStr);
                    if (friend)
                    {
                        const friendRightsEvent = new FriendRightsEvent();
                        friendRightsEvent.friend = friend;
                        friendRightsEvent.theirRights = friend.theirRights;
                        friendRightsEvent.myRights = friend.myRights;
                        this.bot.clientEvents.onFriendRights.next(friendRightsEvent);
                    }
                }
                break;
            }
            default:
                break;
        }
    }
}
