"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = require("../enums/Message");
const Utils_1 = require("./Utils");
const ChatEvent_1 = require("../events/ChatEvent");
const InstantMessageDialog_1 = require("../enums/InstantMessageDialog");
const LureEvent_1 = require("../events/LureEvent");
const InstantMessageEvent_1 = require("../events/InstantMessageEvent");
const ChatSourceType_1 = require("../enums/ChatSourceType");
const InstantMessageEventFlags_1 = require("../enums/InstantMessageEventFlags");
const GroupInviteEvent_1 = require("../events/GroupInviteEvent");
const GroupChatEvent_1 = require("../events/GroupChatEvent");
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
                            {
                                const imEvent = new InstantMessageEvent_1.InstantMessageEvent();
                                imEvent.source = ChatSourceType_1.ChatSourceType.Agent;
                                imEvent.from = im.AgentData.AgentID;
                                imEvent.owner = im.AgentData.AgentID;
                                imEvent.fromName = Utils_1.Utils.BufferToStringSimple(im.MessageBlock.FromAgentName);
                                imEvent.message = Utils_1.Utils.BufferToStringSimple(im.MessageBlock.Message);
                                imEvent.flags = InstantMessageEventFlags_1.InstantMessageEventFlags.normal;
                                this.clientEvents.onInstantMessage.next(imEvent);
                                break;
                            }
                        case InstantMessageDialog_1.InstantMessageDialog.MessageBox:
                            break;
                        case InstantMessageDialog_1.InstantMessageDialog.GroupInvitation:
                            const giEvent = new GroupInviteEvent_1.GroupInviteEvent();
                            giEvent.from = im.AgentData.AgentID;
                            giEvent.fromName = Utils_1.Utils.BufferToStringSimple(im.MessageBlock.FromAgentName);
                            giEvent.message = Utils_1.Utils.BufferToStringSimple(im.MessageBlock.Message);
                            giEvent.inviteID = im.MessageBlock.ID;
                            this.clientEvents.onGroupInvite.next(giEvent);
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
                            {
                                const imEvent = new InstantMessageEvent_1.InstantMessageEvent();
                                imEvent.source = ChatSourceType_1.ChatSourceType.Object;
                                imEvent.owner = im.AgentData.AgentID;
                                imEvent.from = im.MessageBlock.ID;
                                imEvent.fromName = Utils_1.Utils.BufferToStringSimple(im.MessageBlock.FromAgentName);
                                imEvent.message = Utils_1.Utils.BufferToStringSimple(im.MessageBlock.Message);
                                imEvent.flags = InstantMessageEventFlags_1.InstantMessageEventFlags.normal;
                                this.clientEvents.onInstantMessage.next(imEvent);
                                break;
                            }
                        case InstantMessageDialog_1.InstantMessageDialog.BusyAutoResponse:
                            {
                                const imEvent = new InstantMessageEvent_1.InstantMessageEvent();
                                imEvent.source = ChatSourceType_1.ChatSourceType.Agent;
                                imEvent.from = im.AgentData.AgentID;
                                imEvent.owner = im.AgentData.AgentID;
                                imEvent.fromName = Utils_1.Utils.BufferToStringSimple(im.MessageBlock.FromAgentName);
                                imEvent.message = Utils_1.Utils.BufferToStringSimple(im.MessageBlock.Message);
                                imEvent.flags = InstantMessageEventFlags_1.InstantMessageEventFlags.busyResponse;
                                this.clientEvents.onInstantMessage.next(imEvent);
                                break;
                            }
                        case InstantMessageDialog_1.InstantMessageDialog.ConsoleAndChatHistory:
                            break;
                        case InstantMessageDialog_1.InstantMessageDialog.RequestTeleport:
                            const lureEvent = new LureEvent_1.LureEvent();
                            const extraData = Utils_1.Utils.BufferToStringSimple(im.MessageBlock.BinaryBucket).split('|');
                            lureEvent.from = im.AgentData.AgentID;
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
                            {
                                const imEvent = new InstantMessageEvent_1.InstantMessageEvent();
                                imEvent.source = ChatSourceType_1.ChatSourceType.Agent;
                                imEvent.from = im.AgentData.AgentID;
                                imEvent.owner = im.AgentData.AgentID;
                                imEvent.fromName = Utils_1.Utils.BufferToStringSimple(im.MessageBlock.FromAgentName);
                                imEvent.message = '';
                                imEvent.flags = InstantMessageEventFlags_1.InstantMessageEventFlags.startTyping;
                                this.clientEvents.onInstantMessage.next(imEvent);
                                break;
                            }
                        case InstantMessageDialog_1.InstantMessageDialog.StopTyping:
                            {
                                const imEvent = new InstantMessageEvent_1.InstantMessageEvent();
                                imEvent.source = ChatSourceType_1.ChatSourceType.Agent;
                                imEvent.from = im.AgentData.AgentID;
                                imEvent.owner = im.AgentData.AgentID;
                                imEvent.fromName = Utils_1.Utils.BufferToStringSimple(im.MessageBlock.FromAgentName);
                                imEvent.message = '';
                                imEvent.flags = InstantMessageEventFlags_1.InstantMessageEventFlags.finishTyping;
                                this.clientEvents.onInstantMessage.next(imEvent);
                                break;
                            }
                        case InstantMessageDialog_1.InstantMessageDialog.SessionSend:
                            {
                                const groupChatEvent = new GroupChatEvent_1.GroupChatEvent();
                                groupChatEvent.from = im.AgentData.AgentID;
                                groupChatEvent.fromName = Utils_1.Utils.BufferToStringSimple(im.MessageBlock.FromAgentName);
                                groupChatEvent.groupID = im.MessageBlock.ID;
                                groupChatEvent.message = Utils_1.Utils.BufferToStringSimple(im.MessageBlock.Message);
                                this.clientEvents.onGroupChat.next(groupChatEvent);
                                break;
                            }
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
                    const alertMessage = Utils_1.Utils.BufferToStringSimple(alertm.AlertData.Message);
                    console.log('Alert message: ' + alertMessage);
                    alertm.AlertInfo.forEach((info) => {
                        const alertInfoMessage = Utils_1.Utils.BufferToStringSimple(info.Message);
                        console.log('Alert info message: ' + alertInfoMessage);
                    });
                    break;
            }
        });
    }
    shutdown() {
    }
}
exports.Comms = Comms;
//# sourceMappingURL=Comms.js.map