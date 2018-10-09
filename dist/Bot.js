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
const ClientEvents_1 = require("./classes/ClientEvents");
const TeleportEventType_1 = require("./enums/TeleportEventType");
const ClientCommands_1 = require("./classes/ClientCommands");
const DisconnectEvent_1 = require("./events/DisconnectEvent");
const StartPingCheck_1 = require("./classes/messages/StartPingCheck");
const FilterResponse_1 = require("./enums/FilterResponse");
const UUID_1 = require("./classes/UUID");
const Vector3_1 = require("./classes/Vector3");
class Bot {
    constructor(login, options) {
        this.ping = null;
        this.pingNumber = 0;
        this.lastSuccessfulPing = 0;
        this.circuitSubscription = null;
        this.eventQueueRunning = false;
        this.eventQueueWaits = {};
        this.stay = false;
        this.stayRegion = '';
        this.stayPosition = new Vector3_1.Vector3();
        this.clientEvents = new ClientEvents_1.ClientEvents();
        this.loginParams = login;
        this.options = options;
        this.clientEvents.onEventQueueStateChange.subscribe((evt) => {
            this.eventQueueRunning = evt.active;
            for (const waitID of Object.keys(this.eventQueueWaits)) {
                try {
                    clearTimeout(this.eventQueueWaits[waitID].timer);
                    this.eventQueueWaits[waitID].resolve();
                    delete this.eventQueueWaits[waitID];
                }
                catch (ignore) { }
            }
        });
    }
    stayPut(stay, regionName, position) {
        this.stay = stay;
        if (regionName !== undefined && position !== undefined) {
            this.stayRegion = regionName;
            this.stayPosition = position;
        }
    }
    login() {
        return __awaiter(this, void 0, void 0, function* () {
            const loginHandler = new LoginHandler_1.LoginHandler(this.clientEvents, this.options);
            const response = yield loginHandler.Login(this.loginParams);
            this.currentRegion = response.region;
            this.agent = response.agent;
            this.clientCommands = new ClientCommands_1.ClientCommands(response.region, response.agent, this);
            return response;
        });
    }
    changeRegion(region, requested) {
        return __awaiter(this, void 0, void 0, function* () {
            this.closeCircuit();
            this.currentRegion = region;
            this.clientCommands = new ClientCommands_1.ClientCommands(this.currentRegion, this.agent, this);
            if (this.ping !== null) {
                clearInterval(this.ping);
                this.ping = null;
            }
            yield this.connectToSim(requested);
        });
    }
    waitForEventQueue(timeout = 1000) {
        return new Promise((resolve, reject) => {
            if (this.eventQueueRunning) {
                resolve();
            }
            else {
                const waitID = UUID_1.UUID.random().toString();
                const newWait = {
                    'resolve': resolve
                };
                newWait.timer = setTimeout(() => {
                    delete this.eventQueueWaits[waitID];
                    reject(new Error('Timeout'));
                }, timeout);
                this.eventQueueWaits[waitID] = newWait;
            }
        });
    }
    closeCircuit() {
        this.currentRegion.shutdown();
        if (this.circuitSubscription !== null) {
            this.circuitSubscription.unsubscribe();
            this.circuitSubscription = null;
        }
        delete this.currentRegion;
        this.clientCommands.shutdown();
        delete this.clientCommands;
        if (this.ping !== null) {
            clearInterval(this.ping);
            this.ping = null;
        }
    }
    kicked(message) {
        this.closeCircuit();
        this.agent.shutdown();
        delete this.agent;
        this.disconnected(false, message);
    }
    disconnected(requested, message) {
        const disconnectEvent = new DisconnectEvent_1.DisconnectEvent();
        disconnectEvent.requested = requested;
        disconnectEvent.message = message;
        if (this.clientEvents) {
            this.clientEvents.onDisconnected.next(disconnectEvent);
        }
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            const circuit = this.currentRegion.circuit;
            const msg = new LogoutRequest_1.LogoutRequestMessage();
            msg.AgentData = {
                AgentID: this.agent.agentID,
                SessionID: circuit.sessionID
            };
            circuit.sendMessage(msg, PacketFlags_1.PacketFlags.Reliable);
            yield circuit.waitForMessage(Message_1.Message.LogoutReply, 5000);
            this.stayRegion = '';
            this.stayPosition = new Vector3_1.Vector3();
            this.closeCircuit();
            this.agent.shutdown();
            delete this.agent;
            this.disconnected(true, 'Logout completed');
        });
    }
    connectToSim(requested) {
        return __awaiter(this, void 0, void 0, function* () {
            this.agent.setCurrentRegion(this.currentRegion);
            const circuit = this.currentRegion.circuit;
            circuit.init();
            const msg = new UseCircuitCode_1.UseCircuitCodeMessage();
            msg.CircuitCode = {
                SessionID: circuit.sessionID,
                ID: this.agent.agentID,
                Code: circuit.circuitCode
            };
            yield circuit.waitForAck(circuit.sendMessage(msg, PacketFlags_1.PacketFlags.Reliable), 1000);
            const agentMovement = new CompleteAgentMovement_1.CompleteAgentMovementMessage();
            agentMovement.AgentData = {
                AgentID: this.agent.agentID,
                SessionID: circuit.sessionID,
                CircuitCode: circuit.circuitCode
            };
            circuit.sendMessage(agentMovement, PacketFlags_1.PacketFlags.Reliable);
            let agentPosition = null;
            let regionName = null;
            circuit.waitForMessage(Message_1.Message.AgentMovementComplete, 10000).then((agentMovementMsg) => {
                agentPosition = agentMovementMsg.Data.Position;
                if (regionName !== null) {
                    if (this.stayRegion === '' || requested) {
                        this.stayPut(this.stay, regionName, agentPosition);
                    }
                }
            }).catch(() => {
                console.error('Timed out waiting for AgentMovementComplete');
            });
            const handshakeMessage = yield circuit.waitForMessage(Message_1.Message.RegionHandshake, 10000);
            const handshakeReply = new RegionHandshakeReply_1.RegionHandshakeReplyMessage();
            handshakeReply.AgentData = {
                AgentID: this.agent.agentID,
                SessionID: circuit.sessionID
            };
            handshakeReply.RegionInfo = {
                Flags: RegionProtocolFlags_1.RegionProtocolFlags.SelfAppearanceSupport | RegionProtocolFlags_1.RegionProtocolFlags.AgentAppearanceService
            };
            yield circuit.waitForAck(circuit.sendMessage(handshakeReply, PacketFlags_1.PacketFlags.Reliable), 10000);
            this.currentRegion.handshake(handshakeMessage).then(() => {
                regionName = this.currentRegion.regionName;
                console.log('Arrived in region: ' + regionName);
                if (agentPosition !== null) {
                    if (this.stayRegion === '' || requested) {
                        this.stayPut(this.stay, regionName, agentPosition);
                    }
                }
            }).catch((error) => {
                console.error('Timed out getting handshake');
                console.error(error);
            });
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
            this.ping = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                this.pingNumber++;
                if (this.pingNumber % 12 === 0 && this.stay) {
                    if (this.currentRegion.regionName !== this.stayRegion) {
                        console.log('Stay Put: Attempting to teleport to ' + this.stayRegion);
                        this.clientCommands.teleport.teleportTo(this.stayRegion, this.stayPosition, this.stayPosition).then(() => {
                            console.log('I found my way home.');
                        }).catch(() => {
                            console.log('Cannot teleport home right now.');
                        });
                    }
                }
                if (this.pingNumber > 255) {
                    this.pingNumber = 0;
                }
                const ping = new StartPingCheck_1.StartPingCheckMessage();
                ping.PingID = {
                    PingID: this.pingNumber,
                    OldestUnacked: this.currentRegion.circuit.getOldestUnacked()
                };
                circuit.sendMessage(ping, PacketFlags_1.PacketFlags.Reliable);
                circuit.waitForMessage(Message_1.Message.CompletePingCheck, 10000, ((pingData, cpc) => {
                    if (cpc.PingID.PingID === pingData.pingID) {
                        this.lastSuccessfulPing = new Date().getTime();
                        const pingTime = this.lastSuccessfulPing - pingData.timeSent;
                        if (this.clientEvents !== null) {
                            this.clientEvents.onCircuitLatency.next(pingTime);
                        }
                        return FilterResponse_1.FilterResponse.Finish;
                    }
                    return FilterResponse_1.FilterResponse.NoMatch;
                }).bind(this, {
                    pingID: this.pingNumber,
                    timeSent: new Date().getTime()
                })).then(() => {
                }).catch(() => {
                    console.error('Timeout waiting for ping from the simulator - possible disconnection');
                });
                if ((new Date().getTime() - this.lastSuccessfulPing) > 60000) {
                    this.kicked('Circuit Timeout');
                }
            }), 5000);
            this.circuitSubscription = circuit.subscribeToMessages([
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
                                this.kicked('ClientEvents is null');
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
                                this.kicked('ClientEvents is null');
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
                                this.kicked('ClientEvents is null');
                            }
                            this.clientEvents.onTeleportEvent.next(tpEvent);
                            break;
                        }
                    case Message_1.Message.KickUser:
                        {
                            const kickUser = packet.message;
                            this.kicked(Utils_1.Utils.BufferToStringSimple(kickUser.UserInfo.Reason));
                            break;
                        }
                }
            });
        });
    }
}
exports.Bot = Bot;
//# sourceMappingURL=Bot.js.map