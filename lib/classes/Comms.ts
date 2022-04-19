import { Subscription } from 'rxjs';
import { GroupChatClosedEvent } from '../events/GroupChatClosedEvent';
import { Agent } from './Agent';
import { Circuit } from './Circuit';
import { Packet } from './Packet';
import { Message } from '../enums/Message';
import { ChatFromSimulatorMessage } from './messages/ChatFromSimulator';
import { ImprovedInstantMessageMessage } from './messages/ImprovedInstantMessage';
import { Utils } from './Utils';
import { InstantMessageDialog } from '../enums/InstantMessageDialog';
import { AlertMessageMessage } from './messages/AlertMessage';
import { ClientEvents } from './ClientEvents';
import { ScriptDialogMessage } from './messages/ScriptDialog';
import { InstantMessageEvent } from '../events/InstantMessageEvent';
import { ChatSourceType } from '../enums/ChatSourceType';
import { InstantMessageEventFlags } from '../enums/InstantMessageEventFlags';
import { GroupInviteEvent } from '../events/GroupInviteEvent';
import { InventoryOfferedEvent } from '../events/InventoryOfferedEvent';
import { LureEvent } from '../events/LureEvent';
import { UUID } from './UUID';
import { GroupNoticeEvent } from '../events/GroupNoticeEvent';
import { FriendRequestEvent } from '../events/FriendRequestEvent';
import { FriendResponseEvent } from '../events/FriendResponseEvent';
import { GroupChatEvent } from '../events/GroupChatEvent';
import { ChatEvent } from '../events/ChatEvent';
import { ScriptDialogEvent } from '../events/ScriptDialogEvent';
import { InventoryResponseEvent } from '../events/InventoryResponseEvent';

export class Comms
{
    private groupChatExpiredSub?: Subscription;

    constructor(public readonly circuit: Circuit, public readonly agent: Agent, public readonly clientEvents: ClientEvents)
    {
        this.groupChatExpiredSub = this.agent.onGroupChatExpired.subscribe(this.groupChatExpired.bind(this));

        this.circuit.subscribeToMessages([
            Message.ImprovedInstantMessage,
            Message.ChatFromSimulator,
            Message.AlertMessage,
            Message.ScriptDialog
        ], (packet: Packet) =>
        {
            switch (packet.message.id)
            {
                case Message.ImprovedInstantMessage:
                    const im = packet.message as ImprovedInstantMessageMessage;
                    switch (im.MessageBlock.Dialog)
                    {
                        case InstantMessageDialog.MessageFromAgent:
                        {
                            const imEvent = new InstantMessageEvent();
                            imEvent.source = ChatSourceType.Agent;
                            imEvent.from = im.AgentData.AgentID;
                            imEvent.owner = im.AgentData.AgentID;
                            imEvent.fromName = Utils.BufferToStringSimple(im.MessageBlock.FromAgentName);
                            imEvent.message = Utils.BufferToStringSimple(im.MessageBlock.Message);
                            imEvent.flags = InstantMessageEventFlags.normal;
                            this.clientEvents.onInstantMessage.next(imEvent);
                            break;
                        }
                        case InstantMessageDialog.MessageBox:
                            break;
                        case InstantMessageDialog.GroupInvitation:
                            const giEvent = new GroupInviteEvent();
                            giEvent.from = im.AgentData.AgentID;
                            giEvent.fromName = Utils.BufferToStringSimple(im.MessageBlock.FromAgentName);
                            giEvent.message = Utils.BufferToStringSimple(im.MessageBlock.Message);
                            giEvent.inviteID = im.MessageBlock.ID;
                            this.clientEvents.onGroupInvite.next(giEvent);
                            break;
                        case InstantMessageDialog.InventoryOffered:
                        {
                            const fromName = Utils.BufferToStringSimple(im.MessageBlock.FromAgentName);
                            const inventoryMessage = Utils.BufferToStringSimple(im.MessageBlock.Message);

                            const ioEvent = new InventoryOfferedEvent();
                            ioEvent.from = im.AgentData.AgentID;
                            ioEvent.fromName = fromName;
                            ioEvent.message = inventoryMessage;
                            ioEvent.requestID = im.MessageBlock.ID;
                            ioEvent.source = ChatSourceType.Agent;
                            this.clientEvents.onInventoryOffered.next(ioEvent);
                            break;
                        }
                        case InstantMessageDialog.InventoryAccepted:
                        {
                            const irEvent = new InventoryResponseEvent();
                            irEvent.from = im.AgentData.AgentID;
                            irEvent.fromName = Utils.BufferToStringSimple(im.MessageBlock.FromAgentName);
                            irEvent.message = Utils.BufferToStringSimple(im.MessageBlock.Message);
                            irEvent.requestID = im.MessageBlock.ID;
                            irEvent.accepted = true;
                            this.clientEvents.onInventoryResponse.next(irEvent);
                            break;
                        }
                        case InstantMessageDialog.InventoryDeclined:
                        {
                            const irEvent = new InventoryResponseEvent();
                            irEvent.from = im.AgentData.AgentID;
                            irEvent.fromName = Utils.BufferToStringSimple(im.MessageBlock.FromAgentName);
                            irEvent.message = Utils.BufferToStringSimple(im.MessageBlock.Message);
                            irEvent.requestID = im.MessageBlock.ID;
                            irEvent.accepted = false;
                            this.clientEvents.onInventoryResponse.next(irEvent);
                            break;
                        }
                        case InstantMessageDialog.TaskInventoryOffered:
                        {
                            const fromName = Utils.BufferToStringSimple(im.MessageBlock.FromAgentName);
                            const inventoryMessage = Utils.BufferToStringSimple(im.MessageBlock.Message);

                            const ioEvent = new InventoryOfferedEvent();
                            ioEvent.from = im.AgentData.AgentID;
                            ioEvent.fromName = fromName;
                            ioEvent.message = inventoryMessage;
                            ioEvent.requestID = im.MessageBlock.ID;
                            ioEvent.source = ChatSourceType.Object;
                            ioEvent.type = im.MessageBlock.BinaryBucket.readUInt8(0);
                            this.clientEvents.onInventoryOffered.next(ioEvent);
                            break;
                        }
                        case InstantMessageDialog.TaskInventoryAccepted:
                            break;
                        case InstantMessageDialog.TaskInventoryDeclined:
                            break;
                        case InstantMessageDialog.MessageFromObject:
                        {
                            const imEvent = new InstantMessageEvent();
                            imEvent.source = ChatSourceType.Object;
                            imEvent.owner = im.AgentData.AgentID;
                            imEvent.from = im.MessageBlock.ID;
                            imEvent.fromName = Utils.BufferToStringSimple(im.MessageBlock.FromAgentName);
                            imEvent.message = Utils.BufferToStringSimple(im.MessageBlock.Message);
                            imEvent.flags = InstantMessageEventFlags.normal;
                            this.clientEvents.onInstantMessage.next(imEvent);
                            break;
                        }
                        case InstantMessageDialog.BusyAutoResponse:
                        {
                            const imEvent = new InstantMessageEvent();
                            imEvent.source = ChatSourceType.Agent;
                            imEvent.from = im.AgentData.AgentID;
                            imEvent.owner = im.AgentData.AgentID;
                            imEvent.fromName = Utils.BufferToStringSimple(im.MessageBlock.FromAgentName);
                            imEvent.message = Utils.BufferToStringSimple(im.MessageBlock.Message);
                            imEvent.flags = InstantMessageEventFlags.busyResponse;
                            this.clientEvents.onInstantMessage.next(imEvent);
                            break;
                        }
                        case InstantMessageDialog.ConsoleAndChatHistory:
                            break;
                        case InstantMessageDialog.RequestTeleport:
                        {
                            const lureEvent = new LureEvent();
                            const extraData = Utils.BufferToStringSimple(im.MessageBlock.BinaryBucket).split('|');
                            lureEvent.from = im.AgentData.AgentID;
                            lureEvent.fromName = Utils.BufferToStringSimple(im.MessageBlock.FromAgentName);
                            lureEvent.lureMessage = Utils.BufferToStringSimple(im.MessageBlock.Message);
                            lureEvent.regionID = im.MessageBlock.RegionID;
                            lureEvent.position = im.MessageBlock.Position;
                            lureEvent.lureID = im.MessageBlock.ID;
                            lureEvent.gridX = parseInt(extraData[0], 10);
                            lureEvent.gridY = parseInt(extraData[1], 10);
                            this.clientEvents.onLure.next(lureEvent);
                            break;
                        }
                        case InstantMessageDialog.AcceptTeleport:
                            break;
                        case InstantMessageDialog.DenyTeleport:
                            break;
                        case InstantMessageDialog.RequestLure:
                            break;
                        case InstantMessageDialog.GotoUrl:
                            break;
                        case InstantMessageDialog.FromTaskAsAlert:
                            break;
                        case InstantMessageDialog.GroupNotice:
                        {
                            const groupNoticeEvent = new GroupNoticeEvent();
                            groupNoticeEvent.from = im.AgentData.AgentID;
                            groupNoticeEvent.fromName = Utils.BufferToStringSimple(im.MessageBlock.FromAgentName);
                            groupNoticeEvent.groupID = new UUID(im.MessageBlock.BinaryBucket, 2);
                            const message = Utils.BufferToStringSimple(im.MessageBlock.Message).split('|');
                            groupNoticeEvent.subject = message[0];
                            if (message.length > 1)
                            {
                                groupNoticeEvent.message = message[1];
                            }
                            this.clientEvents.onGroupNotice.next(groupNoticeEvent);
                            break;
                        }
                        case InstantMessageDialog.GroupNoticeInventoryAccepted:
                            break;
                        case InstantMessageDialog.GroupNoticeInventoryDeclined:
                            break;
                        case InstantMessageDialog.GroupInvitationAccept:
                            break;
                        case InstantMessageDialog.GroupInvitationDecline:
                            break;
                        case InstantMessageDialog.GroupNoticeRequested:
                            break;
                        case InstantMessageDialog.FriendshipOffered:
                        {
                            const fromName = Utils.BufferToStringSimple(im.MessageBlock.FromAgentName);
                            const message = Utils.BufferToStringSimple(im.MessageBlock.Message);

                            const frEvent = new FriendRequestEvent();
                            frEvent.from = im.AgentData.AgentID;
                            frEvent.fromName = fromName;
                            frEvent.message = message;
                            frEvent.requestID = im.MessageBlock.ID;

                            this.clientEvents.onFriendRequest.next(frEvent);
                            break;
                        }
                        case InstantMessageDialog.FriendshipAccepted:
                        {
                            const fromName = Utils.BufferToStringSimple(im.MessageBlock.FromAgentName);
                            const message = Utils.BufferToStringSimple(im.MessageBlock.Message);
                            const frEvent = new FriendResponseEvent();
                            frEvent.from = im.AgentData.AgentID;
                            frEvent.fromName = fromName;
                            frEvent.message = message;
                            frEvent.requestID = im.MessageBlock.ID;
                            frEvent.accepted = true;
                            this.clientEvents.onFriendResponse.next(frEvent);
                            break;
                        }
                        case InstantMessageDialog.FriendshipDeclined:
                        {
                            const fromName = Utils.BufferToStringSimple(im.MessageBlock.FromAgentName);
                            const message = Utils.BufferToStringSimple(im.MessageBlock.Message);
                            const frEvent = new FriendResponseEvent();
                            frEvent.from = im.AgentData.AgentID;
                            frEvent.fromName = fromName;
                            frEvent.message = message;
                            frEvent.requestID = im.MessageBlock.ID;
                            frEvent.accepted = false;
                            this.clientEvents.onFriendResponse.next(frEvent);
                            break;
                        }
                        case InstantMessageDialog.StartTyping:
                        {
                            const imEvent = new InstantMessageEvent();
                            imEvent.source = ChatSourceType.Agent;
                            imEvent.from = im.AgentData.AgentID;
                            imEvent.owner = im.AgentData.AgentID;
                            imEvent.fromName = Utils.BufferToStringSimple(im.MessageBlock.FromAgentName);
                            imEvent.message = '';
                            imEvent.flags = InstantMessageEventFlags.startTyping;
                            this.clientEvents.onInstantMessage.next(imEvent);
                            break;
                        }
                        case InstantMessageDialog.StopTyping:
                        {
                            const imEvent = new InstantMessageEvent();
                            imEvent.source = ChatSourceType.Agent;
                            imEvent.from = im.AgentData.AgentID;
                            imEvent.owner = im.AgentData.AgentID;
                            imEvent.fromName = Utils.BufferToStringSimple(im.MessageBlock.FromAgentName);
                            imEvent.message = '';
                            imEvent.flags = InstantMessageEventFlags.finishTyping;
                            this.clientEvents.onInstantMessage.next(imEvent);
                            break;
                        }
                        case InstantMessageDialog.SessionDrop:
                        {
                            const groupChatClosedEvent = new GroupChatClosedEvent();
                            groupChatClosedEvent.groupID = im.MessageBlock.ID;
                            this.clientEvents.onGroupChatClosed.next(groupChatClosedEvent);
                            this.agent.deleteChatSession(groupChatClosedEvent.groupID);
                            break;
                        }
                        case InstantMessageDialog.SessionSend:
                        {
                            const groupChatEvent = new GroupChatEvent();
                            groupChatEvent.from = im.AgentData.AgentID;
                            groupChatEvent.fromName = Utils.BufferToStringSimple(im.MessageBlock.FromAgentName);
                            groupChatEvent.groupID = im.MessageBlock.ID;
                            groupChatEvent.message = Utils.BufferToStringSimple(im.MessageBlock.Message);
                            if (!this.agent.hasChatSession(groupChatEvent.groupID))
                            {
                                this.agent.addChatSession(groupChatEvent.groupID, true);
                            }
                            this.agent.updateLastMessage(groupChatEvent.groupID);
                            this.clientEvents.onGroupChat.next(groupChatEvent);
                            break;
                        }

                    }
                    break;

                case Message.ChatFromSimulator:
                {
                    const chat = packet.message as ChatFromSimulatorMessage;
                    const event = new ChatEvent();
                    event.fromName = Utils.BufferToStringSimple(chat.ChatData.FromName);
                    event.message = Utils.BufferToStringSimple(chat.ChatData.Message);
                    event.from = chat.ChatData.SourceID;
                    event.ownerID = chat.ChatData.OwnerID;
                    event.chatType = chat.ChatData.ChatType;
                    event.sourceType = chat.ChatData.SourceType;
                    event.audible = chat.ChatData.Audible;
                    event.position = chat.ChatData.Position;
                    this.clientEvents.onNearbyChat.next(event);
                    break;
                }
                case Message.AlertMessage:
                {
                    // TODO: this isn't finished
                    const alertm = packet.message as AlertMessageMessage;
                    const alertMessage = Utils.BufferToStringSimple(alertm.AlertData.Message);
                    console.log('AlertMessage: ' + alertMessage);
                    for (const info of alertm.AlertInfo)
                    {
                        const alertInfoMessage = Utils.BufferToStringSimple(info.Message);
                        console.log('Alert info message: ' + alertInfoMessage);
                    }
                    break;
                }
                case Message.ScriptDialog:
                {
                    const scriptd = packet.message as ScriptDialogMessage;
                    const event = new ScriptDialogEvent();
                    event.ObjectID = scriptd.Data.ObjectID;
                    event.FirstName = Utils.BufferToStringSimple(scriptd.Data.FirstName);
                    event.LastName = Utils.BufferToStringSimple(scriptd.Data.LastName);
                    event.ObjectName = Utils.BufferToStringSimple(scriptd.Data.ObjectName);
                    event.Message = Utils.BufferToStringSimple(scriptd.Data.Message);
                    event.ChatChannel = scriptd.Data.ChatChannel;
                    event.ImageID = scriptd.Data.ImageID;
                    event.Buttons = [];
                    event.Owners = [];
                    for (const button of scriptd.Buttons)
                    {
                        event.Buttons.push(Utils.BufferToStringSimple(button.ButtonLabel));
                    }
                    for (const owner of scriptd.OwnerData)
                    {
                        event.Owners.push(owner.OwnerID);
                    }
                    this.clientEvents.onScriptDialog.next(event);
                    break;
                }
            }
        });
    }

    shutdown(): void
    {
        if (this.groupChatExpiredSub !== undefined)
        {
            this.groupChatExpiredSub.unsubscribe();
            delete this.groupChatExpiredSub;
        }
    }

    private async groupChatExpired(groupID: UUID): Promise<void>
    {
        // Reconnect to group chat since it's been idle for 15 minutes
        await this.agent.currentRegion.clientCommands.comms.endGroupChatSession(groupID, false);
        await this.agent.currentRegion.clientCommands.comms.startGroupChatSession(groupID, '');
    }
}
