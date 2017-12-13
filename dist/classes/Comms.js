"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = require("../enums/Message");
const ImprovedInstantMessage_1 = require("./messages/ImprovedInstantMessage");
const ChatType_1 = require("../enums/ChatType");
const Utils_1 = require("./Utils");
const ChatFromViewer_1 = require("./messages/ChatFromViewer");
const PacketFlags_1 = require("../enums/PacketFlags");
const ChatEvent_1 = require("../events/ChatEvent");
const UUID_1 = require("./UUID");
const InstantMessageDialog_1 = require("../enums/InstantMessageDialog");
const LureEvent_1 = require("../events/LureEvent");
const Vector3_1 = require("./Vector3");
class Comms {
    constructor(circuit, agent, clientEvents) {
        this.clientEvents = clientEvents;
        this.circuit = circuit;
        this.agent = agent;
        this.circuit.subscribeToMessages([
            Message_1.Message.ImprovedInstantMessage,
            Message_1.Message.ChatFromSimulator,
            Message_1.Message.AlertMessage
        ], (packet) => {
            switch (packet.message.id) {
                case Message_1.Message.ImprovedInstantMessage:
                    const im = packet.message;
                    switch (im.MessageBlock.Dialog) {
                        case InstantMessageDialog_1.InstantMessageDialog.MessageFromAgent:
                            break;
                        case InstantMessageDialog_1.InstantMessageDialog.MessageBox:
                            break;
                        case InstantMessageDialog_1.InstantMessageDialog.GroupInvitation:
                            break;
                        case InstantMessageDialog_1.InstantMessageDialog.InventoryOffered:
                            break;
                        case InstantMessageDialog_1.InstantMessageDialog.InventoryAccepted:
                            break;
                        case InstantMessageDialog_1.InstantMessageDialog.InventoryDeclined:
                            break;
                        case InstantMessageDialog_1.InstantMessageDialog.TaskInventoryOffered:
                            break;
                        case InstantMessageDialog_1.InstantMessageDialog.TaskInventoryAccepted:
                            break;
                        case InstantMessageDialog_1.InstantMessageDialog.TaskInventoryDeclined:
                            break;
                        case InstantMessageDialog_1.InstantMessageDialog.MessageFromObject:
                            break;
                        case InstantMessageDialog_1.InstantMessageDialog.BusyAutoResponse:
                            break;
                        case InstantMessageDialog_1.InstantMessageDialog.ConsoleAndChatHistory:
                            break;
                        case InstantMessageDialog_1.InstantMessageDialog.RequestTeleport:
                            const lureEvent = new LureEvent_1.LureEvent();
                            const extraData = Utils_1.Utils.BufferToStringSimple(im.MessageBlock.BinaryBucket).split('|');
                            lureEvent.fromName = Utils_1.Utils.BufferToStringSimple(im.MessageBlock.FromAgentName);
                            lureEvent.lureMessage = Utils_1.Utils.BufferToStringSimple(im.MessageBlock.Message);
                            lureEvent.regionID = im.MessageBlock.RegionID;
                            lureEvent.position = im.MessageBlock.Position;
                            lureEvent.lureID = im.MessageBlock.ID;
                            lureEvent.gridX = parseInt(extraData[0], 10);
                            lureEvent.gridY = parseInt(extraData[1], 10);
                            this.clientEvents.onLure.next(lureEvent);
                            break;
                        case InstantMessageDialog_1.InstantMessageDialog.AcceptTeleport:
                            break;
                        case InstantMessageDialog_1.InstantMessageDialog.DenyTeleport:
                            break;
                        case InstantMessageDialog_1.InstantMessageDialog.RequestLure:
                            break;
                        case InstantMessageDialog_1.InstantMessageDialog.GotoUrl:
                            break;
                        case InstantMessageDialog_1.InstantMessageDialog.FromTaskAsAlert:
                            break;
                        case InstantMessageDialog_1.InstantMessageDialog.GroupNotice:
                            break;
                        case InstantMessageDialog_1.InstantMessageDialog.GroupNoticeInventoryAccepted:
                            break;
                        case InstantMessageDialog_1.InstantMessageDialog.GroupNoticeInventoryDeclined:
                            break;
                        case InstantMessageDialog_1.InstantMessageDialog.GroupInvitationAccept:
                            break;
                        case InstantMessageDialog_1.InstantMessageDialog.GroupInvitationDecline:
                            break;
                        case InstantMessageDialog_1.InstantMessageDialog.GroupNoticeRequested:
                            break;
                        case InstantMessageDialog_1.InstantMessageDialog.FriendshipOffered:
                            break;
                        case InstantMessageDialog_1.InstantMessageDialog.FriendshipAccepted:
                            break;
                        case InstantMessageDialog_1.InstantMessageDialog.FriendshipDeclined:
                            break;
                        case InstantMessageDialog_1.InstantMessageDialog.StartTyping:
                            break;
                        case InstantMessageDialog_1.InstantMessageDialog.StopTyping:
                            break;
                    }
                    break;
                case Message_1.Message.ChatFromSimulator:
                    const chat = packet.message;
                    const event = new ChatEvent_1.ChatEvent();
                    event.fromName = Utils_1.Utils.BufferToStringSimple(chat.ChatData.FromName);
                    event.message = Utils_1.Utils.BufferToStringSimple(chat.ChatData.Message);
                    event.from = chat.ChatData.SourceID;
                    event.ownerID = chat.ChatData.OwnerID;
                    event.chatType = chat.ChatData.ChatType;
                    event.sourceType = chat.ChatData.SourceType;
                    event.audible = chat.ChatData.Audible;
                    event.position = chat.ChatData.Position;
                    this.clientEvents.onNearbyChat.next(event);
                    break;
                case Message_1.Message.AlertMessage:
                    const alertm = packet.message;
                    let alertMessage = Utils_1.Utils.BufferToStringSimple(alertm.AlertData.Message);
                    console.log('Alert message: ' + alertMessage);
                    alertm.AlertInfo.forEach((info) => {
                        let alertInfoMessage = Utils_1.Utils.BufferToStringSimple(info.Message);
                        console.log('Alert info message: ' + alertInfoMessage);
                    });
                    break;
            }
        });
    }
    nearbyChat(message, type, channel) {
        if (channel === undefined) {
            channel = 0;
        }
        const cfv = new ChatFromViewer_1.ChatFromViewerMessage();
        cfv.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.circuit.sessionID
        };
        cfv.ChatData = {
            Message: Utils_1.Utils.StringToBuffer(message),
            Type: type,
            Channel: channel
        };
        this.circuit.sendMessage(cfv, PacketFlags_1.PacketFlags.Reliable);
    }
    say(message, channel) {
        this.nearbyChat(message, ChatType_1.ChatType.Normal, channel);
    }
    whisper(message, channel) {
        this.nearbyChat(message, ChatType_1.ChatType.Whisper, channel);
    }
    shout(message, channel) {
        this.nearbyChat(message, ChatType_1.ChatType.Shout, channel);
    }
    startTypingLocal() {
        const cfv = new ChatFromViewer_1.ChatFromViewerMessage();
        cfv.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.circuit.sessionID
        };
        cfv.ChatData = {
            Message: Buffer.allocUnsafe(0),
            Type: ChatType_1.ChatType.StartTyping,
            Channel: 0
        };
        this.circuit.sendMessage(cfv, PacketFlags_1.PacketFlags.Reliable);
    }
    stopTypingLocal() {
        const cfv = new ChatFromViewer_1.ChatFromViewerMessage();
        cfv.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.circuit.sessionID
        };
        cfv.ChatData = {
            Message: Buffer.allocUnsafe(0),
            Type: ChatType_1.ChatType.StopTyping,
            Channel: 0
        };
        this.circuit.sendMessage(cfv, PacketFlags_1.PacketFlags.Reliable);
    }
    typeMessage(message) {
        this.startTypingLocal();
        this.agent.startAnimations([new UUID_1.UUID('c541c47f-e0c0-058b-ad1a-d6ae3a4584d9')]).then(() => {
            const timeToWait = (message.length / 5) * 1000;
            setTimeout(() => {
                this.stopTypingLocal();
                this.agent.stopAnimations([new UUID_1.UUID('c541c47f-e0c0-058b-ad1a-d6ae3a4584d9')]).then(() => {
                    this.say(message);
                });
            }, timeToWait);
        });
    }
    shutdown() {
    }
    sendInstantMessage(to, message) {
        const circuit = this.circuit;
        if (typeof to === 'string') {
            to = new UUID_1.UUID(to);
        }
        message += '\0';
        const agentName = this.agent.firstName + ' ' + this.agent.lastName;
        const im = new ImprovedInstantMessage_1.ImprovedInstantMessageMessage();
        im.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: circuit.sessionID
        };
        im.MessageBlock = {
            FromGroup: false,
            ToAgentID: to,
            ParentEstateID: 0,
            RegionID: UUID_1.UUID.zero(),
            Position: Vector3_1.Vector3.getZero(),
            Offline: 0,
            Dialog: 0,
            ID: UUID_1.UUID.zero(),
            Timestamp: 0,
            FromAgentName: Utils_1.Utils.StringToBuffer(agentName),
            Message: Utils_1.Utils.StringToBuffer(message),
            BinaryBucket: Buffer.allocUnsafe(0)
        };
        im.EstateBlock = {
            EstateID: 0
        };
        const sequenceNo = circuit.sendMessage(im, PacketFlags_1.PacketFlags.Reliable);
        return circuit.waitForAck(sequenceNo, 10000);
    }
}
exports.Comms = Comms;
//# sourceMappingURL=Comms.js.map