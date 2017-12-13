"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LoginHandler_1 = require("./LoginHandler");
const PacketFlags_1 = require("./enums/PacketFlags");
const UseCircuitCode_1 = require("./classes/messages/UseCircuitCode");
const CompleteAgentMovement_1 = require("./classes/messages/CompleteAgentMovement");
const Message_1 = require("./enums/Message");
const LogoutRequest_1 = require("./classes/messages/LogoutRequest");
const Utils_1 = require("./classes/Utils");
const RegionHandshakeReply_1 = require("./classes/messages/RegionHandshakeReply");
const RegionProtocolFlags_1 = require("./enums/RegionProtocolFlags");
const AgentDataUpdateRequest_1 = require("./classes/messages/AgentDataUpdateRequest");
const TeleportEvent_1 = require("./events/TeleportEvent");
const TeleportEventType_1 = require("./enums/TeleportEventType");
const ClientCommands_1 = require("./classes/ClientCommands");
const DisconnectEvent_1 = require("./events/DisconnectEvent");
const StartPingCheck_1 = require("./classes/messages/StartPingCheck");
class Bot {
    constructor(login) {
        this.ping = null;
        this.pingNumber = 0;
        this.lastSuccessfulPing = 0;
        this.clientEvents = null;
        this.loginParams = login;
    }
    login() {
        return new Promise((resolve, reject) => {
            const loginHandler = new LoginHandler_1.LoginHandler();
            loginHandler.Login(this.loginParams).then((response) => {
                this.clientEvents = response.clientEvents;
                this.currentRegion = response.region;
                this.agent = response.agent;
                this.clientCommands = new ClientCommands_1.ClientCommands(response.region, response.agent, this);
                resolve(response);
            }).catch((error) => {
                reject(error);
            });
        });
    }
    changeRegion(region) {
        return new Promise((resolve, reject) => {
            this.currentRegion = region;
            this.clientCommands = new ClientCommands_1.ClientCommands(this.currentRegion, this.agent, this);
            this.connectToSim().then(() => {
                resolve();
            }).catch((error) => {
                reject(error);
            });
        });
    }
    close() {
        return new Promise((resolve, reject) => {
            const circuit = this.currentRegion.circuit;
            const msg = new LogoutRequest_1.LogoutRequestMessage();
            msg.AgentData = {
                AgentID: this.agent.agentID,
                SessionID: circuit.sessionID
            };
            circuit.sendMessage(msg, PacketFlags_1.PacketFlags.Reliable);
            circuit.waitForMessage(Message_1.Message.LogoutReply, 5000).then((packet) => {
            }).catch((error) => {
                console.error('Timeout waiting for logout reply');
            }).then(() => {
                this.agent.shutdown();
                this.currentRegion.shutdown();
                delete this.currentRegion;
                delete this.agent;
                delete this.clientCommands;
                if (this.ping !== null) {
                    clearInterval(this.ping);
                    this.ping = null;
                }
                const disconnectEvent = new DisconnectEvent_1.DisconnectEvent();
                disconnectEvent.requested = true;
                disconnectEvent.message = 'Logout completed';
                if (this.clientEvents) {
                    this.clientEvents.onDisconnected.next(disconnectEvent);
                }
                resolve();
            });
        });
    }
    connectToSim() {
        return new Promise((resolve, reject) => {
            const circuit = this.currentRegion.circuit;
            circuit.init();
            const msg = new UseCircuitCode_1.UseCircuitCodeMessage();
            msg.CircuitCode = {
                SessionID: circuit.sessionID,
                ID: this.agent.agentID,
                Code: circuit.circuitCode
            };
            circuit.waitForAck(circuit.sendMessage(msg, PacketFlags_1.PacketFlags.Reliable), 1000).then(() => {
                const agentMovement = new CompleteAgentMovement_1.CompleteAgentMovementMessage();
                agentMovement.AgentData = {
                    AgentID: this.agent.agentID,
                    SessionID: circuit.sessionID,
                    CircuitCode: circuit.circuitCode
                };
                circuit.sendMessage(agentMovement, PacketFlags_1.PacketFlags.Reliable);
                return circuit.waitForMessage(Message_1.Message.RegionHandshake, 10000);
            }).then((packet) => {
                const handshakeReply = new RegionHandshakeReply_1.RegionHandshakeReplyMessage();
                handshakeReply.AgentData = {
                    AgentID: this.agent.agentID,
                    SessionID: circuit.sessionID
                };
                handshakeReply.RegionInfo = {
                    Flags: RegionProtocolFlags_1.RegionProtocolFlags.SelfAppearanceSupport | RegionProtocolFlags_1.RegionProtocolFlags.AgentAppearanceService
                };
                return circuit.waitForAck(circuit.sendMessage(handshakeReply, PacketFlags_1.PacketFlags.Reliable), 10000);
            }).then(() => {
                if (this.clientCommands !== null) {
                    this.clientCommands.network.setBandwidth(1536000);
                }
                const agentRequest = new AgentDataUpdateRequest_1.AgentDataUpdateRequestMessage();
                agentRequest.AgentData = {
                    AgentID: this.agent.agentID,
                    SessionID: circuit.sessionID
                };
                circuit.sendMessage(agentRequest, PacketFlags_1.PacketFlags.Reliable);
                this.agent.setInitialAppearance();
                this.agent.circuitActive();
                this.lastSuccessfulPing = new Date().getTime();
                this.ping = setInterval(() => {
                    this.pingNumber++;
                    if (this.pingNumber > 255) {
                        this.pingNumber = 0;
                    }
                    const ping = new StartPingCheck_1.StartPingCheckMessage();
                    ping.PingID = {
                        PingID: this.pingNumber,
                        OldestUnacked: this.currentRegion.circuit.getOldestUnacked()
                    };
                    circuit.sendMessage(ping, PacketFlags_1.PacketFlags.Reliable);
                    circuit.waitForMessage(Message_1.Message.CompletePingCheck, 10000, ((pingData, packet) => {
                        const cpc = packet.message;
                        if (cpc.PingID.PingID === pingData.pingID) {
                            this.lastSuccessfulPing = new Date().getTime();
                            const pingTime = this.lastSuccessfulPing - pingData.timeSent;
                            if (this.clientEvents !== null) {
                                this.clientEvents.onCircuitLatency.next(pingTime);
                            }
                            return true;
                        }
                        return false;
                    }).bind(this, {
                        pingID: this.pingNumber,
                        timeSent: new Date().getTime()
                    }));
                    if ((new Date().getTime() - this.lastSuccessfulPing) > 60000) {
                        this.agent.shutdown();
                        this.currentRegion.shutdown();
                        delete this.currentRegion;
                        delete this.agent;
                        delete this.clientCommands;
                        if (this.ping !== null) {
                            clearInterval(this.ping);
                            this.ping = null;
                        }
                        const disconnectEvent = new DisconnectEvent_1.DisconnectEvent();
                        disconnectEvent.requested = false;
                        disconnectEvent.message = 'Circuit timeout';
                        if (this.clientEvents) {
                            this.clientEvents.onDisconnected.next(disconnectEvent);
                        }
                    }
                }, 5000);
                circuit.subscribeToMessages([
                    Message_1.Message.TeleportFailed,
                    Message_1.Message.TeleportFinish,
                    Message_1.Message.TeleportLocal,
                    Message_1.Message.TeleportStart,
                    Message_1.Message.TeleportProgress,
                    Message_1.Message.TeleportCancel,
                    Message_1.Message.KickUser
                ], (packet) => {
                    switch (packet.message.id) {
                        case Message_1.Message.TeleportLocal:
                            {
                                const tpEvent = new TeleportEvent_1.TeleportEvent();
                                tpEvent.message = '';
                                tpEvent.eventType = TeleportEventType_1.TeleportEventType.TeleportCompleted;
                                tpEvent.simIP = 'local';
                                tpEvent.simPort = 0;
                                tpEvent.seedCapability = '';
                                if (this.clientEvents === null) {
                                    reject(new Error('ClientEvents is null'));
                                    return;
                                }
                                this.clientEvents.onTeleportEvent.next(tpEvent);
                                break;
                            }
                        case Message_1.Message.TeleportStart:
                            {
                                const teleportStart = packet.message;
                                const tpEvent = new TeleportEvent_1.TeleportEvent();
                                tpEvent.message = '';
                                tpEvent.eventType = TeleportEventType_1.TeleportEventType.TeleportStarted;
                                tpEvent.simIP = '';
                                tpEvent.simPort = 0;
                                tpEvent.seedCapability = '';
                                if (this.clientEvents === null) {
                                    reject(new Error('ClientEvents is null'));
                                    return;
                                }
                                this.clientEvents.onTeleportEvent.next(tpEvent);
                                break;
                            }
                        case Message_1.Message.TeleportProgress:
                            {
                                const teleportProgress = packet.message;
                                const message = Utils_1.Utils.BufferToStringSimple(teleportProgress.Info.Message);
                                const tpEvent = new TeleportEvent_1.TeleportEvent();
                                tpEvent.message = message;
                                tpEvent.eventType = TeleportEventType_1.TeleportEventType.TeleportProgress;
                                tpEvent.simIP = '';
                                tpEvent.simPort = 0;
                                tpEvent.seedCapability = '';
                                if (this.clientEvents === null) {
                                    reject(new Error('ClientEvents is null'));
                                    return;
                                }
                                this.clientEvents.onTeleportEvent.next(tpEvent);
                                break;
                            }
                        case Message_1.Message.KickUser:
                            {
                                const kickUser = packet.message;
                                this.agent.shutdown();
                                this.currentRegion.shutdown();
                                delete this.currentRegion;
                                delete this.agent;
                                delete this.clientCommands;
                                if (this.ping !== null) {
                                    clearInterval(this.ping);
                                    this.ping = null;
                                }
                                const disconnectEvent = new DisconnectEvent_1.DisconnectEvent();
                                disconnectEvent.requested = false;
                                disconnectEvent.message = Utils_1.Utils.BufferToStringSimple(kickUser.UserInfo.Reason);
                                if (this.clientEvents) {
                                    this.clientEvents.onDisconnected.next(disconnectEvent);
                                }
                                break;
                            }
                    }
                });
                resolve();
            }).catch((error) => {
                reject(error);
            });
        });
    }
}
exports.Bot = Bot;
//# sourceMappingURL=Bot.js.map