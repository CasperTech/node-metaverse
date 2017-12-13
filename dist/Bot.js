"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LoginHandler_1 = require("./LoginHandler");
const UUID_1 = require("./classes/UUID");
const PacketFlags_1 = require("./enums/PacketFlags");
const UseCircuitCode_1 = require("./classes/messages/UseCircuitCode");
const CompleteAgentMovement_1 = require("./classes/messages/CompleteAgentMovement");
const Message_1 = require("./enums/Message");
const Region_1 = require("./classes/Region");
const LogoutRequest_1 = require("./classes/messages/LogoutRequest");
const Utils_1 = require("./classes/Utils");
const RegionHandshakeReply_1 = require("./classes/messages/RegionHandshakeReply");
const RegionProtocolFlags_1 = require("./enums/RegionProtocolFlags");
const AgentThrottle_1 = require("./classes/messages/AgentThrottle");
const AgentDataUpdateRequest_1 = require("./classes/messages/AgentDataUpdateRequest");
const RegionHandleRequest_1 = require("./classes/messages/RegionHandleRequest");
const MapItemRequest_1 = require("./classes/messages/MapItemRequest");
const GridItemType_1 = require("./enums/GridItemType");
const MapBlockRequest_1 = require("./classes/messages/MapBlockRequest");
const MapInfoReply_1 = require("./events/MapInfoReply");
const TeleportLureRequest_1 = require("./classes/messages/TeleportLureRequest");
const TeleportFlags_1 = require("./enums/TeleportFlags");
const LLSD = require("llsd");
const TeleportEvent_1 = require("./events/TeleportEvent");
const TeleportEventType_1 = require("./enums/TeleportEventType");
class Bot {
    constructor(login) {
        this.throttleGenCounter = 0;
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
                resolve(response);
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
                resolve();
            });
        });
    }
    setBandwidth(total) {
        const circuit = this.currentRegion.circuit;
        const agentThrottle = new AgentThrottle_1.AgentThrottleMessage();
        agentThrottle.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: circuit.sessionID,
            CircuitCode: circuit.circuitCode
        };
        const throttleData = Buffer.allocUnsafe(28);
        let pos = 0;
        const resendThrottle = total * 0.1;
        const landThrottle = total * 0.172;
        const windThrottle = total * 0.05;
        const cloudThrottle = total * 0.05;
        const taskThrottle = total * 0.234;
        const textureThrottle = total * 0.234;
        const assetThrottle = total * 0.160;
        throttleData.writeFloatLE(resendThrottle, pos);
        pos += 4;
        throttleData.writeFloatLE(landThrottle, pos);
        pos += 4;
        throttleData.writeFloatLE(windThrottle, pos);
        pos += 4;
        throttleData.writeFloatLE(cloudThrottle, pos);
        pos += 4;
        throttleData.writeFloatLE(taskThrottle, pos);
        pos += 4;
        throttleData.writeFloatLE(textureThrottle, pos);
        pos += 4;
        throttleData.writeFloatLE(assetThrottle, pos);
        agentThrottle.Throttle = {
            GenCounter: this.throttleGenCounter++,
            Throttles: throttleData
        };
        circuit.sendMessage(agentThrottle, PacketFlags_1.PacketFlags.Reliable);
    }
    acceptTeleport(lure) {
        return new Promise((resolve, reject) => {
            const circuit = this.currentRegion.circuit;
            const tlr = new TeleportLureRequest_1.TeleportLureRequestMessage();
            tlr.Info = {
                AgentID: this.agent.agentID,
                SessionID: circuit.sessionID,
                LureID: lure.lureID,
                TeleportFlags: TeleportFlags_1.TeleportFlags.ViaLure
            };
            circuit.sendMessage(tlr, PacketFlags_1.PacketFlags.Reliable);
            if (this.currentRegion.caps.eventQueueClient) {
                if (this.clientEvents === null) {
                    reject(new Error('ClientEvents is null'));
                    return;
                }
                const subscription = this.clientEvents.onTeleportEvent.subscribe((e) => {
                    if (e.eventType === TeleportEventType_1.TeleportEventType.TeleportFailed || e.eventType === TeleportEventType_1.TeleportEventType.TeleportCompleted) {
                        subscription.unsubscribe();
                    }
                    if (e.eventType === TeleportEventType_1.TeleportEventType.TeleportFailed) {
                        reject(e);
                    }
                    else if (e.eventType === TeleportEventType_1.TeleportEventType.TeleportCompleted) {
                        if (e.simIP === 'local') {
                            resolve(e);
                            return;
                        }
                        if (this.clientEvents === null) {
                            reject(new Error('ClientEvents is null'));
                            return;
                        }
                        this.currentRegion.shutdown();
                        const region = new Region_1.Region(this.agent, this.clientEvents);
                        region.circuit.circuitCode = this.currentRegion.circuit.circuitCode;
                        region.circuit.secureSessionID = this.currentRegion.circuit.secureSessionID;
                        region.circuit.sessionID = this.currentRegion.circuit.sessionID;
                        region.circuit.udpBlacklist = this.currentRegion.circuit.udpBlacklist;
                        region.circuit.ipAddress = e.simIP;
                        region.circuit.port = e.simPort;
                        this.agent.setCurrentRegion(region);
                        this.currentRegion = region;
                        this.currentRegion.activateCaps(e.seedCapability);
                        this.connectToSim().then(() => {
                            resolve(e);
                        }).catch((error) => {
                            reject(e);
                        });
                    }
                });
            }
        });
    }
    getRegionHandle(regionID) {
        return new Promise((resolve, reject) => {
            const circuit = this.currentRegion.circuit;
            const msg = new RegionHandleRequest_1.RegionHandleRequestMessage();
            msg.RequestBlock = {
                RegionID: regionID,
            };
            circuit.sendMessage(msg, PacketFlags_1.PacketFlags.Reliable);
            circuit.waitForMessage(Message_1.Message.RegionIDAndHandleReply, 10000, (packet) => {
                const filterMsg = packet.message;
                return (filterMsg.ReplyBlock.RegionID.toString() === regionID.toString());
            }).then((packet) => {
                const responseMsg = packet.message;
                resolve(responseMsg.ReplyBlock.RegionHandle);
            });
        });
    }
    getRegionMapInfo(gridX, gridY) {
        return new Promise((resolve, reject) => {
            const circuit = this.currentRegion.circuit;
            const response = new MapInfoReply_1.MapInfoReply();
            const msg = new MapBlockRequest_1.MapBlockRequestMessage();
            msg.AgentData = {
                AgentID: this.agent.agentID,
                SessionID: circuit.sessionID,
                Flags: 65536,
                EstateID: 0,
                Godlike: true
            };
            msg.PositionData = {
                MinX: (gridX / 256),
                MaxX: (gridX / 256),
                MinY: (gridY / 256),
                MaxY: (gridY / 256)
            };
            circuit.sendMessage(msg, PacketFlags_1.PacketFlags.Reliable);
            circuit.waitForMessage(Message_1.Message.MapBlockReply, 10000, (packet) => {
                const filterMsg = packet.message;
                let found = false;
                filterMsg.Data.forEach((data) => {
                    if (data.X === (gridX / 256) && data.Y === (gridY / 256)) {
                        found = true;
                    }
                });
                return found;
            }).then((packet) => {
                const responseMsg = packet.message;
                responseMsg.Data.forEach((data) => {
                    if (data.X === (gridX / 256) && data.Y === (gridY / 256)) {
                        response.name = Utils_1.Utils.BufferToStringSimple(data.Name);
                        response.accessFlags = data.Access;
                        response.mapImage = data.MapImageID;
                    }
                });
                const regionHandle = Utils_1.Utils.RegionCoordinatesToHandle(gridX, gridY);
                const mi = new MapItemRequest_1.MapItemRequestMessage();
                mi.AgentData = {
                    AgentID: this.agent.agentID,
                    SessionID: circuit.sessionID,
                    Flags: 2,
                    EstateID: 0,
                    Godlike: false
                };
                mi.RequestData = {
                    ItemType: GridItemType_1.GridItemType.AgentLocations,
                    RegionHandle: regionHandle
                };
                circuit.sendMessage(mi, PacketFlags_1.PacketFlags.Reliable);
                const minX = Math.floor(gridX / 256) * 256;
                const maxX = minX + 256;
                const minY = Math.floor(gridY / 256) * 256;
                const maxY = minY + 256;
                response.avatars = [];
                circuit.waitForMessage(Message_1.Message.MapItemReply, 10000, (packet) => {
                    const filterMsg = packet.message;
                    let found = false;
                    filterMsg.Data.forEach((data) => {
                        if (data.X >= minX && data.X <= maxX && data.Y >= minY && data.Y <= maxY) {
                            found = true;
                        }
                    });
                    return found;
                }).then((packet2) => {
                    const responseMsg2 = packet2.message;
                    responseMsg2.Data.forEach((data) => {
                        response.avatars.push({
                            X: data.X,
                            Y: data.Y
                        });
                    });
                    resolve(response);
                }).catch((err) => {
                    reject(err);
                });
            }).catch((err) => {
                reject(err);
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
                this.setBandwidth(1536000);
                const agentRequest = new AgentDataUpdateRequest_1.AgentDataUpdateRequestMessage();
                agentRequest.AgentData = {
                    AgentID: this.agent.agentID,
                    SessionID: circuit.sessionID
                };
                circuit.sendMessage(agentRequest, PacketFlags_1.PacketFlags.Reliable);
                this.agent.setInitialAppearance();
                this.agent.circuitActive();
                circuit.subscribeToMessages([
                    Message_1.Message.TeleportFailed,
                    Message_1.Message.TeleportFinish,
                    Message_1.Message.TeleportLocal,
                    Message_1.Message.TeleportStart,
                    Message_1.Message.TeleportProgress,
                    Message_1.Message.TeleportCancel,
                    Message_1.Message.SoundTrigger,
                    Message_1.Message.AttachedSound,
                    Message_1.Message.AvatarAnimation
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
                                const flags = teleportStart.Info.TeleportFlags;
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
                        case Message_1.Message.SoundTrigger:
                            {
                                const soundTrigger = packet.message;
                                const soundID = soundTrigger.SoundData.SoundID;
                                break;
                            }
                        case Message_1.Message.AttachedSound:
                            {
                                const attachedSound = packet.message;
                                const soundID = attachedSound.DataBlock.SoundID;
                                break;
                            }
                        case Message_1.Message.AvatarAnimation:
                            {
                                const avatarAnimation = packet.message;
                                break;
                            }
                        default:
                            console.log('Unrecognised message');
                            break;
                    }
                });
                resolve();
            }).catch((error) => {
                reject(error);
            });
        });
    }
    downloadAsset(type, uuid) {
        return this.currentRegion.caps.downloadAsset(uuid, type);
    }
    uploadAsset(type, data, name, description) {
        return new Promise((resolve, reject) => {
            if (this.agent && this.agent.inventory && this.agent.inventory.main && this.agent.inventory.main.root) {
                this.currentRegion.caps.capsRequestXML('NewFileAgentInventory', {
                    'folder_id': new LLSD.UUID(this.agent.inventory.main.root.toString()),
                    'asset_type': type,
                    'inventory_type': Utils_1.Utils.HTTPAssetTypeToInventoryType(type),
                    'name': name,
                    'description': description,
                    'everyone_mask': (1 << 13) | (1 << 14) | (1 << 15) | (1 << 19),
                    'group_mask': (1 << 13) | (1 << 14) | (1 << 15) | (1 << 19),
                    'next_owner_mask': (1 << 13) | (1 << 14) | (1 << 15) | (1 << 19),
                    'expected_upload_cost': 0
                }).then((response) => {
                    if (response['state'] === 'upload') {
                        const uploadURL = response['uploader'];
                        this.currentRegion.caps.capsRequestUpload(uploadURL, data).then((responseUpload) => {
                            resolve(new UUID_1.UUID(responseUpload['new_asset'].toString()));
                        }).catch((err) => {
                            reject(err);
                        });
                    }
                }).catch((err) => {
                    console.log(err);
                });
            }
        });
    }
}
exports.Bot = Bot;
//# sourceMappingURL=Bot.js.map