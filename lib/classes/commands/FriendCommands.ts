import {CommandsBase} from './CommandsBase';
import {Region} from '../Region';
import {Agent} from '../Agent';
import {Bot} from '../../Bot';
import {Subscription} from 'rxjs/internal/Subscription';
import {Message} from '../../enums/Message';
import {Packet} from '../Packet';
import {OnlineNotificationMessage} from '../messages/OnlineNotification';
import {OfflineNotificationMessage} from '../messages/OfflineNotification';
import {TerminateFriendshipMessage} from '../messages/TerminateFriendship';
import {AssetType, Friend, FriendOnlineEvent, FriendRemovedEvent, FriendRequestEvent, FriendRightsEvent, MapInfoReplyEvent, MapLocation, PacketFlags, RightsFlags, UUID, Vector3} from '../..';
import {AcceptFriendshipMessage} from '../messages/AcceptFriendship';
import {ImprovedInstantMessageMessage} from '../messages/ImprovedInstantMessage';
import {InstantMessageDialog} from '../../enums/InstantMessageDialog';
import {Utils} from '../Utils';
import {DeclineFriendshipMessage} from '../messages/DeclineFriendship';
import {ChangeUserRightsMessage} from '../messages/ChangeUserRights';
import {FindAgentMessage} from '../messages/FindAgent';
import {IPAddress} from '../IPAddress';
import {FilterResponse} from '../../enums/FilterResponse';
import {GrantUserRightsMessage} from '../messages/GrantUserRights';

export class FriendCommands extends CommandsBase
{
    friendMessages: Subscription;
    friendsList: {
        [key: string]: Friend
    } = {};

    constructor(region: Region, agent: Agent, bot: Bot)
    {
        super(region, agent, bot);

        // FriendResponse is handled by Comms because it's part of the InstantMessageImproved module.
        // We don't handle it here because it's always accompanied by an OnlineNotificationMessage.

        this.friendMessages = this.circuit.subscribeToMessages([
            Message.OnlineNotification,
            Message.OfflineNotification,
            Message.TerminateFriendship,
            Message.ChangeUserRights
        ], async (packet: Packet) =>
        {
            switch (packet.message.id)
            {
                case Message.OnlineNotification:
                {
                    const msg = packet.message as OnlineNotificationMessage;
                    for (const agentEntry of msg.AgentBlock)
                    {
                        const uuidStr = agentEntry.AgentID.toString();
                        if (this.friendsList[uuidStr] === undefined)
                        {
                            this.friendsList[uuidStr] = await this.bot.clientCommands.grid.avatarKey2Name(agentEntry.AgentID) as Friend;
                            this.friendsList[uuidStr].online = false;
                            this.friendsList[uuidStr].myRights = RightsFlags.None;
                            this.friendsList[uuidStr].theirRights = RightsFlags.None;
                        }
                        if (this.friendsList[uuidStr].online !== true)
                        {
                            this.friendsList[uuidStr].online = true;
                            const friendOnlineEvent = new FriendOnlineEvent();
                            friendOnlineEvent.friend = this.friendsList[uuidStr];
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
                        if (this.friendsList[uuidStr] === undefined)
                        {
                            this.friendsList[uuidStr] = await this.bot.clientCommands.grid.avatarKey2Name(agentEntry.AgentID) as Friend;
                            this.friendsList[uuidStr].online = false;
                            this.friendsList[uuidStr].myRights = RightsFlags.None;
                            this.friendsList[uuidStr].theirRights = RightsFlags.None;
                        }
                        if (this.friendsList[uuidStr].online !== false)
                        {
                            this.friendsList[uuidStr].online = false;
                            const friendOnlineEvent = new FriendOnlineEvent();
                            friendOnlineEvent.friend = this.friendsList[uuidStr];
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
                    if (this.friendsList[uuidStr] !== undefined)
                    {
                        const event = new FriendRemovedEvent();
                        event.friend = this.friendsList[uuidStr];
                        this.bot.clientEvents.onFriendRemoved.next(event);
                        delete this.friendsList[uuidStr];
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
                            if (this.friendsList[uuidStr] === undefined)
                            {
                                this.friendsList[uuidStr] = await this.bot.clientCommands.grid.avatarKey2Name(rightsEntry.AgentRelated) as Friend;
                                this.friendsList[uuidStr].online = false;
                                this.friendsList[uuidStr].myRights = RightsFlags.None;
                                this.friendsList[uuidStr].theirRights = RightsFlags.None;
                            }
                            this.friendsList[uuidStr].myRights = rightsEntry.RelatedRights;
                        }
                        else
                        {
                            uuidStr = rightsEntry.AgentRelated.toString();
                            if (this.friendsList[uuidStr] === undefined)
                            {
                                this.friendsList[uuidStr] = await this.bot.clientCommands.grid.avatarKey2Name(rightsEntry.AgentRelated) as Friend;
                                this.friendsList[uuidStr].online = false;
                                this.friendsList[uuidStr].myRights = RightsFlags.None;
                                this.friendsList[uuidStr].theirRights = RightsFlags.None;
                            }
                            this.friendsList[uuidStr].theirRights = rightsEntry.RelatedRights;
                        }
                        const friendRightsEvent = new FriendRightsEvent();
                        friendRightsEvent.friend = this.friendsList[uuidStr];
                        friendRightsEvent.theirRights = this.friendsList[uuidStr].theirRights;
                        friendRightsEvent.myRights = this.friendsList[uuidStr].myRights;
                        this.bot.clientEvents.onFriendRights.next(friendRightsEvent);
                    }
                    break;
                }
            }
        });
    }

    async grantFriendRights(friend: Friend | UUID | string, rights: RightsFlags)
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
        else if (typeof friend === 'string')
        {
            friendKey = new UUID(friend);
        }
        else
        {
            throw new Error('"Friend" parameter must be Friend, UUID or string');
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
        return await this.circuit.waitForAck(sequenceNo, 10000);
    }

    async getFriendMapLocation(friend: Friend | UUID | string): Promise<MapLocation>
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
        else if (typeof friend === 'string')
        {
            friendKey = new UUID(friend);
        }
        else
        {
            throw new Error('"Friend" parameter must be Friend, UUID or string');
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

    async acceptFriendRequest(event: FriendRequestEvent): Promise<void>
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
                'FolderID': this.agent.inventory.findFolderForType(AssetType.CallingCard)
            }
        );
        const sequenceNo = this.circuit.sendMessage(accept, PacketFlags.Reliable);
        return await this.circuit.waitForAck(sequenceNo, 10000);
    }

    async rejectFriendRequest(event: FriendRequestEvent): Promise<void>
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
        return await this.circuit.waitForAck(sequenceNo, 10000);
    }

    async sendFriendRequest(to: UUID | string, message: string): Promise<void>
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
        return await this.circuit.waitForAck(sequenceNo, 10000);
    }

    shutdown()
    {
        this.friendMessages.unsubscribe();
    }
}
