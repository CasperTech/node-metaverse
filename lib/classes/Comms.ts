import {Circuit} from './Circuit';
import {Agent} from './Agent';
import {Packet} from './Packet';
import {Message} from '../enums/Message';
import {ChatFromSimulatorMessage} from './messages/ChatFromSimulator';
import {ImprovedInstantMessageMessage} from './messages/ImprovedInstantMessage';
import {Utils} from './Utils';
import {ChatEvent} from '../events/ChatEvent';
import {InstantMessageDialog} from '../enums/InstantMessageDialog';
import {LureEvent} from '../events/LureEvent';
import {AlertMessageMessage} from './messages/AlertMessage';
import {ClientEvents} from './ClientEvents';
import {InstantMessageEvent} from '../events/InstantMessageEvent';
import {ChatSourceType} from '../enums/ChatSourceType';
import {InstantMessageEventFlags} from '../enums/InstantMessageEventFlags';

export class Comms
{
    private circuit: Circuit;
    private agent: Agent;
    private clientEvents: ClientEvents;

    constructor(circuit: Circuit, agent: Agent, clientEvents: ClientEvents)
    {
        this.clientEvents = clientEvents;
        this.circuit = circuit;
        this.agent = agent;

        this.circuit.subscribeToMessages([
            Message.ImprovedInstantMessage,
            Message.ChatFromSimulator,
            Message.AlertMessage
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
                            break;
                        case InstantMessageDialog.InventoryOffered:
                            break;
                        case InstantMessageDialog.InventoryAccepted:
                            break;
                        case InstantMessageDialog.InventoryDeclined:
                            break;
                        case InstantMessageDialog.TaskInventoryOffered:
                            break;
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
                            break;
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
                            break;
                        case InstantMessageDialog.FriendshipAccepted:
                            break;
                        case InstantMessageDialog.FriendshipDeclined:
                            break;
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

                    }
                    break;

                case Message.ChatFromSimulator:

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

                case Message.AlertMessage:
                    const alertm = packet.message as AlertMessageMessage;

                    const alertMessage = Utils.BufferToStringSimple(alertm.AlertData.Message);

                    console.log('Alert message: ' + alertMessage);
                    alertm.AlertInfo.forEach((info) =>
                    {
                        const alertInfoMessage = Utils.BufferToStringSimple(info.Message);
                        console.log('Alert info message: ' + alertInfoMessage);
                    });
                    break;
            }
        });
    }

    shutdown()
    {

    }
}
