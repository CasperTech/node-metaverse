"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = require("../enums/Message");
const Utils_1 = require("./Utils");
const InstantMessageDialog_1 = require("../enums/InstantMessageDialog");
const __1 = require("..");
class Comms {
    constructor(circuit, agent, clientEvents) {
        this.clientEvents = clientEvents;
        this.circuit = circuit;
        this.agent = agent;
        this.circuit.subscribeToMessages([
            Message_1.Message.ImprovedInstantMessage,
            Message_1.Message.ChatFromSimulator,
            Message_1.Message.AlertMessage,
            Message_1.Message.ScriptDialog
        ], (packet) => {
            switch (packet.message.id) {
                case Message_1.Message.ImprovedInstantMessage:
                    const im = packet.message;
                    switch (im.MessageBlock.Dialog) {
                        case InstantMessageDialog_1.InstantMessageDialog.MessageFromAgent:
                            {
                                const imEvent = new __1.InstantMessageEvent();
                                imEvent.source = __1.ChatSourceType.Agent;
                                imEvent.from = im.AgentData.AgentID;
                                imEvent.owner = im.AgentData.AgentID;
                                imEvent.fromName = Utils_1.Utils.BufferToStringSimple(im.MessageBlock.FromAgentName);
                                imEvent.message = Utils_1.Utils.BufferToStringSimple(im.MessageBlock.Message);
                                imEvent.flags = __1.InstantMessageEventFlags.normal;
                                this.clientEvents.onInstantMessage.next(imEvent);
                                break;
                            }
                        case InstantMessageDialog_1.InstantMessageDialog.MessageBox:
                            break;
                        case InstantMessageDialog_1.InstantMessageDialog.GroupInvitation:
                            const giEvent = new __1.GroupInviteEvent();
                            giEvent.from = im.AgentData.AgentID;
                            giEvent.fromName = Utils_1.Utils.BufferToStringSimple(im.MessageBlock.FromAgentName);
                            giEvent.message = Utils_1.Utils.BufferToStringSimple(im.MessageBlock.Message);
                            giEvent.inviteID = im.MessageBlock.ID;
                            this.clientEvents.onGroupInvite.next(giEvent);
                            break;
                        case InstantMessageDialog_1.InstantMessageDialog.InventoryOffered:
                            {
                                const fromName = Utils_1.Utils.BufferToStringSimple(im.MessageBlock.FromAgentName);
                                const message = Utils_1.Utils.BufferToStringSimple(im.MessageBlock.Message);
                                const ioEvent = new __1.InventoryOfferedEvent();
                                ioEvent.from = im.AgentData.AgentID;
                                ioEvent.fromName = fromName;
                                ioEvent.message = message;
                                ioEvent.requestID = im.MessageBlock.ID;
                                ioEvent.source = __1.ChatSourceType.Agent;
                                this.clientEvents.onInventoryOffered.next(ioEvent);
                                break;
                            }
                        case InstantMessageDialog_1.InstantMessageDialog.InventoryAccepted:
                            break;
                        case InstantMessageDialog_1.InstantMessageDialog.InventoryDeclined:
                            break;
                        case InstantMessageDialog_1.InstantMessageDialog.TaskInventoryOffered:
                            {
                                const fromName = Utils_1.Utils.BufferToStringSimple(im.MessageBlock.FromAgentName);
                                const message = Utils_1.Utils.BufferToStringSimple(im.MessageBlock.Message);
                                const ioEvent = new __1.InventoryOfferedEvent();
                                ioEvent.from = im.AgentData.AgentID;
                                ioEvent.fromName = fromName;
                                ioEvent.message = message;
                                ioEvent.requestID = im.MessageBlock.ID;
                                ioEvent.source = __1.ChatSourceType.Object;
                                ioEvent.type = im.MessageBlock.BinaryBucket.readUInt8(0);
                                this.clientEvents.onInventoryOffered.next(ioEvent);
                                break;
                            }
                        case InstantMessageDialog_1.InstantMessageDialog.TaskInventoryAccepted:
                            break;
                        case InstantMessageDialog_1.InstantMessageDialog.TaskInventoryDeclined:
                            break;
                        case InstantMessageDialog_1.InstantMessageDialog.MessageFromObject:
                            {
                                const imEvent = new __1.InstantMessageEvent();
                                imEvent.source = __1.ChatSourceType.Object;
                                imEvent.owner = im.AgentData.AgentID;
                                imEvent.from = im.MessageBlock.ID;
                                imEvent.fromName = Utils_1.Utils.BufferToStringSimple(im.MessageBlock.FromAgentName);
                                imEvent.message = Utils_1.Utils.BufferToStringSimple(im.MessageBlock.Message);
                                imEvent.flags = __1.InstantMessageEventFlags.normal;
                                this.clientEvents.onInstantMessage.next(imEvent);
                                break;
                            }
                        case InstantMessageDialog_1.InstantMessageDialog.BusyAutoResponse:
                            {
                                const imEvent = new __1.InstantMessageEvent();
                                imEvent.source = __1.ChatSourceType.Agent;
                                imEvent.from = im.AgentData.AgentID;
                                imEvent.owner = im.AgentData.AgentID;
                                imEvent.fromName = Utils_1.Utils.BufferToStringSimple(im.MessageBlock.FromAgentName);
                                imEvent.message = Utils_1.Utils.BufferToStringSimple(im.MessageBlock.Message);
                                imEvent.flags = __1.InstantMessageEventFlags.busyResponse;
                                this.clientEvents.onInstantMessage.next(imEvent);
                                break;
                            }
                        case InstantMessageDialog_1.InstantMessageDialog.ConsoleAndChatHistory:
                            break;
                        case InstantMessageDialog_1.InstantMessageDialog.RequestTeleport:
                            const lureEvent = new __1.LureEvent();
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
                            {
                                const fromName = Utils_1.Utils.BufferToStringSimple(im.MessageBlock.FromAgentName);
                                const message = Utils_1.Utils.BufferToStringSimple(im.MessageBlock.Message);
                                const frEvent = new __1.FriendRequestEvent();
                                frEvent.from = im.AgentData.AgentID;
                                frEvent.fromName = fromName;
                                frEvent.message = message;
                                frEvent.requestID = im.MessageBlock.ID;
                                this.clientEvents.onFriendRequest.next(frEvent);
                                break;
                            }
                        case InstantMessageDialog_1.InstantMessageDialog.FriendshipAccepted:
                            {
                                const fromName = Utils_1.Utils.BufferToStringSimple(im.MessageBlock.FromAgentName);
                                const message = Utils_1.Utils.BufferToStringSimple(im.MessageBlock.Message);
                                const frEvent = new __1.FriendResponseEvent();
                                frEvent.from = im.AgentData.AgentID;
                                frEvent.fromName = fromName;
                                frEvent.message = message;
                                frEvent.requestID = im.MessageBlock.ID;
                                frEvent.accepted = true;
                                this.clientEvents.onFriendResponse.next(frEvent);
                                break;
                            }
                        case InstantMessageDialog_1.InstantMessageDialog.FriendshipDeclined:
                            {
                                const fromName = Utils_1.Utils.BufferToStringSimple(im.MessageBlock.FromAgentName);
                                const message = Utils_1.Utils.BufferToStringSimple(im.MessageBlock.Message);
                                const frEvent = new __1.FriendResponseEvent();
                                frEvent.from = im.AgentData.AgentID;
                                frEvent.fromName = fromName;
                                frEvent.message = message;
                                frEvent.requestID = im.MessageBlock.ID;
                                frEvent.accepted = false;
                                this.clientEvents.onFriendResponse.next(frEvent);
                                break;
                            }
                        case InstantMessageDialog_1.InstantMessageDialog.StartTyping:
                            {
                                const imEvent = new __1.InstantMessageEvent();
                                imEvent.source = __1.ChatSourceType.Agent;
                                imEvent.from = im.AgentData.AgentID;
                                imEvent.owner = im.AgentData.AgentID;
                                imEvent.fromName = Utils_1.Utils.BufferToStringSimple(im.MessageBlock.FromAgentName);
                                imEvent.message = '';
                                imEvent.flags = __1.InstantMessageEventFlags.startTyping;
                                this.clientEvents.onInstantMessage.next(imEvent);
                                break;
                            }
                        case InstantMessageDialog_1.InstantMessageDialog.StopTyping:
                            {
                                const imEvent = new __1.InstantMessageEvent();
                                imEvent.source = __1.ChatSourceType.Agent;
                                imEvent.from = im.AgentData.AgentID;
                                imEvent.owner = im.AgentData.AgentID;
                                imEvent.fromName = Utils_1.Utils.BufferToStringSimple(im.MessageBlock.FromAgentName);
                                imEvent.message = '';
                                imEvent.flags = __1.InstantMessageEventFlags.finishTyping;
                                this.clientEvents.onInstantMessage.next(imEvent);
                                break;
                            }
                        case InstantMessageDialog_1.InstantMessageDialog.SessionSend:
                            {
                                const groupChatEvent = new __1.GroupChatEvent();
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
                    {
                        const chat = packet.message;
                        const event = new __1.ChatEvent();
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
                    }
                case Message_1.Message.AlertMessage:
                    {
                        const alertm = packet.message;
                        const alertMessage = Utils_1.Utils.BufferToStringSimple(alertm.AlertData.Message);
                        console.log('Alert message: ' + alertMessage);
                        alertm.AlertInfo.forEach((info) => {
                            const alertInfoMessage = Utils_1.Utils.BufferToStringSimple(info.Message);
                            console.log('Alert info message: ' + alertInfoMessage);
                        });
                        break;
                    }
                case Message_1.Message.ScriptDialog:
                    {
                        const scriptd = packet.message;
                        const event = new __1.ScriptDialogEvent();
                        event.ObjectID = scriptd.Data.ObjectID;
                        event.FirstName = Utils_1.Utils.BufferToStringSimple(scriptd.Data.FirstName);
                        event.LastName = Utils_1.Utils.BufferToStringSimple(scriptd.Data.LastName);
                        event.ObjectName = Utils_1.Utils.BufferToStringSimple(scriptd.Data.ObjectName);
                        event.Message = Utils_1.Utils.BufferToStringSimple(scriptd.Data.Message);
                        event.ChatChannel = scriptd.Data.ChatChannel;
                        event.ImageID = scriptd.Data.ImageID;
                        event.Buttons = [];
                        event.Owners = [];
                        for (const button of scriptd.Buttons) {
                            event.Buttons.push(Utils_1.Utils.BufferToStringSimple(button.ButtonLabel));
                        }
                        for (const owner of scriptd.OwnerData) {
                            event.Owners.push(owner.OwnerID);
                        }
                        this.clientEvents.onScriptDialog.next(event);
                        break;
                    }
            }
        });
    }
    shutdown() {
    }
}
exports.Comms = Comms;
//# sourceMappingURL=Comms.js.map