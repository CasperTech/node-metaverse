import {Circuit} from './Circuit';
import {Agent} from './Agent';
import {Packet} from './Packet';
import {Message} from '../enums/Message';
import {ChatFromSimulatorMessage} from './messages/ChatFromSimulator';
import {ImprovedInstantMessageMessage} from './messages/ImprovedInstantMessage';
import {ChatType} from '../enums/ChatType';
import {Utils} from './Utils';
import {ChatFromViewerMessage} from './messages/ChatFromViewer';
import {PacketFlags} from '../enums/PacketFlags';
import {ChatEvent} from '../events/ChatEvent';
import {UUID} from './UUID';
import {InstantMessageDialog} from '../enums/InstantMessageDialog';
import {LureEvent} from '../events/LureEvent';
import {AlertMessageMessage} from './messages/AlertMessage';
import {ClientEvents} from './ClientEvents';
import {Vector3} from './Vector3';

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
                            break;
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
                            break;
                        case InstantMessageDialog.BusyAutoResponse:
                            break;
                        case InstantMessageDialog.ConsoleAndChatHistory:
                            break;
                        case InstantMessageDialog.RequestTeleport:
                            const lureEvent = new LureEvent();
                            const extraData = Utils.BufferToStringSimple(im.MessageBlock.BinaryBucket).split('|');
                            lureEvent.fromName =  Utils.BufferToStringSimple(im.MessageBlock.FromAgentName);
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
                            break;
                        case InstantMessageDialog.StopTyping:
                            break;

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

                    let alertMessage = Utils.BufferToStringSimple(alertm.AlertData.Message);

                    console.log('Alert message: ' + alertMessage);
                    alertm.AlertInfo.forEach((info) => {
                        let alertInfoMessage = Utils.BufferToStringSimple(info.Message);
                        console.log('Alert info message: ' + alertInfoMessage);
                    });
                    break;
            }
        });
    }
    nearbyChat(message: string, type: ChatType, channel?: number)
    {
        if (channel === undefined)
        {
            channel = 0;
        }
        const cfv = new ChatFromViewerMessage();
        cfv.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.circuit.sessionID
        };
        cfv.ChatData = {
            Message: Utils.StringToBuffer(message),
            Type: type,
            Channel: channel
        };
        this.circuit.sendMessage(cfv, PacketFlags.Reliable);
    }
    say(message: string, channel?: number)
    {
        this.nearbyChat(message, ChatType.Normal, channel);
    }
    whisper(message: string, channel?: number)
    {
        this.nearbyChat(message, ChatType.Whisper, channel);
    }
    shout(message: string, channel?: number)
    {
        this.nearbyChat(message, ChatType.Shout, channel);
    }
    startTypingLocal()
    {
        const cfv = new ChatFromViewerMessage();
        cfv.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.circuit.sessionID
        };
        cfv.ChatData = {
            Message: Buffer.allocUnsafe(0),
            Type: ChatType.StartTyping,
            Channel: 0
        };
        this.circuit.sendMessage(cfv, PacketFlags.Reliable);
    }
    stopTypingLocal()
    {
        const cfv = new ChatFromViewerMessage();
        cfv.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.circuit.sessionID
        };
        cfv.ChatData = {
            Message: Buffer.allocUnsafe(0),
            Type: ChatType.StopTyping,
            Channel: 0
        };
        this.circuit.sendMessage(cfv, PacketFlags.Reliable);
    }
    typeMessage(message: string)
    {
        this.startTypingLocal();
        this.agent.startAnimations([new UUID('c541c47f-e0c0-058b-ad1a-d6ae3a4584d9')]).then(() =>
        {
            // Average four characters per second i guess?
            const timeToWait = (message.length / 5) * 1000;
            setTimeout(() =>
            {
                this.stopTypingLocal();
                this.agent.stopAnimations([new UUID('c541c47f-e0c0-058b-ad1a-d6ae3a4584d9')]).then(() =>
                {
                    this.say(message);
                });
            }, timeToWait);
        });
    }
    shutdown()
    {

    }
    sendInstantMessage(to: UUID | string, message: string): Promise<void>
    {
        const circuit = this.circuit;
        if (typeof to === 'string')
        {
            to = new UUID(to);
        }
        message += '\0';
        const agentName = this.agent.firstName + ' ' + this.agent.lastName;
        const im: ImprovedInstantMessageMessage = new ImprovedInstantMessageMessage();
        im.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: circuit.sessionID
        };
        im.MessageBlock = {
            FromGroup: false,
            ToAgentID: to,
            ParentEstateID: 0,
            RegionID: UUID.zero(),
            Position: Vector3.getZero(),
            Offline: 0,
            Dialog: 0,
            ID: UUID.zero(),
            Timestamp: 0,
            FromAgentName: Utils.StringToBuffer(agentName),
            Message: Utils.StringToBuffer(message),
            BinaryBucket: Buffer.allocUnsafe(0)
        };
        im.EstateBlock = {
            EstateID: 0
        };
        const sequenceNo = circuit.sendMessage(im, PacketFlags.Reliable);
        return circuit.waitForAck(sequenceNo, 10000);
    }
}