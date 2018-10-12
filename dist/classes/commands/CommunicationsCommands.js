"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const CommandsBase_1 = require("./CommandsBase");
const UUID_1 = require("../UUID");
const Utils_1 = require("../Utils");
const ImprovedInstantMessage_1 = require("../messages/ImprovedInstantMessage");
const Vector3_1 = require("../Vector3");
const ChatFromViewer_1 = require("../messages/ChatFromViewer");
const ChatType_1 = require("../../enums/ChatType");
const InstantMessageDialog_1 = require("../../enums/InstantMessageDialog");
const __1 = require("../..");
const ScriptDialogReply_1 = require("../messages/ScriptDialogReply");
class CommunicationsCommands extends CommandsBase_1.CommandsBase {
    sendInstantMessage(to, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const circuit = this.circuit;
            if (typeof to === 'string') {
                to = new UUID_1.UUID(to);
            }
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
                Offline: 1,
                Dialog: 0,
                ID: UUID_1.UUID.zero(),
                Timestamp: Math.floor(new Date().getTime() / 1000),
                FromAgentName: Utils_1.Utils.StringToBuffer(agentName),
                Message: Utils_1.Utils.StringToBuffer(message),
                BinaryBucket: Buffer.allocUnsafe(0)
            };
            im.EstateBlock = {
                EstateID: 0
            };
            const sequenceNo = circuit.sendMessage(im, __1.PacketFlags.Reliable);
            return yield circuit.waitForAck(sequenceNo, 10000);
        });
    }
    nearbyChat(message, type, channel) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const sequenceNo = this.circuit.sendMessage(cfv, __1.PacketFlags.Reliable);
            return yield this.circuit.waitForAck(sequenceNo, 10000);
        });
    }
    say(message, channel) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.nearbyChat(message, ChatType_1.ChatType.Normal, channel);
        });
    }
    whisper(message, channel) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.nearbyChat(message, ChatType_1.ChatType.Whisper, channel);
        });
    }
    shout(message, channel) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.nearbyChat(message, ChatType_1.ChatType.Shout, channel);
        });
    }
    startTypingLocal() {
        return __awaiter(this, void 0, void 0, function* () {
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
            const sequenceNo = this.circuit.sendMessage(cfv, __1.PacketFlags.Reliable);
            return yield this.circuit.waitForAck(sequenceNo, 10000);
        });
    }
    stopTypingLocal() {
        return __awaiter(this, void 0, void 0, function* () {
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
            const sequenceNo = this.circuit.sendMessage(cfv, __1.PacketFlags.Reliable);
            return yield this.circuit.waitForAck(sequenceNo, 10000);
        });
    }
    startTypingIM(to) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof to === 'string') {
                to = new UUID_1.UUID(to);
            }
            const circuit = this.circuit;
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
                Dialog: InstantMessageDialog_1.InstantMessageDialog.StartTyping,
                ID: UUID_1.UUID.zero(),
                Timestamp: Math.floor(new Date().getTime() / 1000),
                FromAgentName: Utils_1.Utils.StringToBuffer(agentName),
                Message: Utils_1.Utils.StringToBuffer(''),
                BinaryBucket: Buffer.allocUnsafe(0)
            };
            im.EstateBlock = {
                EstateID: 0
            };
            const sequenceNo = circuit.sendMessage(im, __1.PacketFlags.Reliable);
            return yield circuit.waitForAck(sequenceNo, 10000);
        });
    }
    stopTypingIM(to) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof to === 'string') {
                to = new UUID_1.UUID(to);
            }
            const circuit = this.circuit;
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
                Dialog: InstantMessageDialog_1.InstantMessageDialog.StopTyping,
                ID: UUID_1.UUID.zero(),
                Timestamp: Math.floor(new Date().getTime() / 1000),
                FromAgentName: Utils_1.Utils.StringToBuffer(agentName),
                Message: Utils_1.Utils.StringToBuffer(''),
                BinaryBucket: Buffer.allocUnsafe(0)
            };
            im.EstateBlock = {
                EstateID: 0
            };
            const sequenceNo = circuit.sendMessage(im, __1.PacketFlags.Reliable);
            return yield circuit.waitForAck(sequenceNo, 10000);
        });
    }
    typeInstantMessage(to, message, thinkingTime, charactersPerSecond) {
        return new Promise((resolve, reject) => {
            if (thinkingTime === undefined) {
                thinkingTime = 2000;
            }
            setTimeout(() => {
                if (typeof to === 'string') {
                    to = new UUID_1.UUID(to);
                }
                let typeTimer = null;
                this.startTypingIM(to).then(() => {
                    typeTimer = setInterval(() => {
                        this.startTypingIM(to).catch(() => {
                        });
                    }, 5000);
                    if (charactersPerSecond === undefined) {
                        charactersPerSecond = 5;
                    }
                    const timeToWait = (message.length / charactersPerSecond) * 1000;
                    setTimeout(() => {
                        if (typeTimer !== null) {
                            clearInterval(typeTimer);
                            typeTimer = null;
                        }
                        this.stopTypingIM(to).then(() => {
                            this.sendInstantMessage(to, message).then(() => {
                                resolve();
                            }).catch((err) => {
                                reject(err);
                            });
                        }).catch((err) => {
                            reject(err);
                        });
                    }, timeToWait);
                }).catch((err) => {
                    if (typeTimer !== null) {
                        clearInterval(typeTimer);
                        typeTimer = null;
                    }
                    reject(err);
                });
            }, thinkingTime);
        });
    }
    typeLocalMessage(message, thinkingTime, charactersPerSecond) {
        return new Promise((resolve, reject) => {
            if (thinkingTime === undefined) {
                thinkingTime = 0;
            }
            setTimeout(() => {
                this.startTypingLocal().then(() => {
                    this.bot.clientCommands.agent.startAnimations([new UUID_1.UUID('c541c47f-e0c0-058b-ad1a-d6ae3a4584d9')]).then(() => {
                        if (charactersPerSecond === undefined) {
                            charactersPerSecond = 5;
                        }
                        const timeToWait = (message.length / charactersPerSecond) * 1000;
                        setTimeout(() => {
                            this.stopTypingLocal().then(() => {
                                this.bot.clientCommands.agent.stopAnimations([new UUID_1.UUID('c541c47f-e0c0-058b-ad1a-d6ae3a4584d9')]).then(() => {
                                    this.say(message).then(() => {
                                        resolve();
                                    }).catch((err) => {
                                        reject(err);
                                    });
                                }).catch((err) => {
                                    reject(err);
                                });
                            }).catch((err) => {
                                reject(err);
                            });
                        }, timeToWait);
                    }).catch((err) => {
                        reject(err);
                    });
                }).catch((err) => {
                    reject(err);
                });
            }, thinkingTime);
        });
    }
    startGroupChatSession(sessionID, message) {
        return new Promise((resolve, reject) => {
            if (typeof sessionID === 'string') {
                sessionID = new UUID_1.UUID(sessionID);
            }
            if (this.agent.hasChatSession(sessionID)) {
                resolve();
            }
            else {
                const circuit = this.circuit;
                const agentName = this.agent.firstName + ' ' + this.agent.lastName;
                const im = new ImprovedInstantMessage_1.ImprovedInstantMessageMessage();
                im.AgentData = {
                    AgentID: this.agent.agentID,
                    SessionID: circuit.sessionID
                };
                im.MessageBlock = {
                    FromGroup: false,
                    ToAgentID: sessionID,
                    ParentEstateID: 0,
                    RegionID: UUID_1.UUID.zero(),
                    Position: Vector3_1.Vector3.getZero(),
                    Offline: 0,
                    Dialog: InstantMessageDialog_1.InstantMessageDialog.SessionGroupStart,
                    ID: sessionID,
                    Timestamp: Math.floor(new Date().getTime() / 1000),
                    FromAgentName: Utils_1.Utils.StringToBuffer(agentName),
                    Message: Utils_1.Utils.StringToBuffer(message),
                    BinaryBucket: Utils_1.Utils.StringToBuffer('')
                };
                im.EstateBlock = {
                    EstateID: 0
                };
                const waitForJoin = this.currentRegion.clientEvents.onGroupChatSessionJoin.subscribe((event) => {
                    if (event.sessionID.toString() === sessionID.toString()) {
                        if (event.success) {
                            waitForJoin.unsubscribe();
                            resolve();
                        }
                        else {
                            reject();
                        }
                    }
                });
                const sequenceNo = circuit.sendMessage(im, __1.PacketFlags.Reliable);
            }
        });
    }
    sendGroupMessage(groupID, message) {
        return new Promise((resolve, reject) => {
            this.startGroupChatSession(groupID, message).then(() => {
                if (typeof groupID === 'string') {
                    groupID = new UUID_1.UUID(groupID);
                }
                const circuit = this.circuit;
                const agentName = this.agent.firstName + ' ' + this.agent.lastName;
                const im = new ImprovedInstantMessage_1.ImprovedInstantMessageMessage();
                im.AgentData = {
                    AgentID: this.agent.agentID,
                    SessionID: circuit.sessionID
                };
                im.MessageBlock = {
                    FromGroup: false,
                    ToAgentID: groupID,
                    ParentEstateID: 0,
                    RegionID: UUID_1.UUID.zero(),
                    Position: Vector3_1.Vector3.getZero(),
                    Offline: 0,
                    Dialog: InstantMessageDialog_1.InstantMessageDialog.SessionSend,
                    ID: groupID,
                    Timestamp: Math.floor(new Date().getTime() / 1000),
                    FromAgentName: Utils_1.Utils.StringToBuffer(agentName),
                    Message: Utils_1.Utils.StringToBuffer(message),
                    BinaryBucket: Utils_1.Utils.StringToBuffer('')
                };
                im.EstateBlock = {
                    EstateID: 0
                };
                const sequenceNo = circuit.sendMessage(im, __1.PacketFlags.Reliable);
                return this.circuit.waitForAck(sequenceNo, 10000);
            }).then(() => {
                resolve(this.bot.clientCommands.group.getSessionAgentCount(groupID));
            }).catch((err) => {
                reject(err);
            });
        });
    }
    respondToScriptDialog(event, buttonIndex) {
        const dialog = new ScriptDialogReply_1.ScriptDialogReplyMessage();
        dialog.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.circuit.sessionID
        };
        dialog.Data = {
            ObjectID: event.ObjectID,
            ChatChannel: event.ChatChannel,
            ButtonIndex: buttonIndex,
            ButtonLabel: Utils_1.Utils.StringToBuffer(event.Buttons[buttonIndex])
        };
        const sequenceNo = this.circuit.sendMessage(dialog, __1.PacketFlags.Reliable);
        return this.circuit.waitForAck(sequenceNo, 10000);
    }
}
exports.CommunicationsCommands = CommunicationsCommands;
//# sourceMappingURL=CommunicationsCommands.js.map