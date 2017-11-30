import {LoginHandler} from './LoginHandler';
import {LoginResponse} from './classes/LoginResponse';
import {LoginParameters} from './classes/LoginParameters';
import {Agent} from './classes/Agent';
import {UUID} from './classes/UUID';
import {PacketFlags} from './enums/PacketFlags';
import {UseCircuitCodeMessage} from './classes/messages/UseCircuitCode';
import {CompleteAgentMovementMessage} from './classes/messages/CompleteAgentMovement';
import {Message} from './enums/Message';
import {Packet} from './classes/Packet';
import {Region} from './classes/Region';
import {LogoutRequestMessage} from './classes/messages/LogoutRequest';
import {Utils} from './classes/Utils';
import {RegionHandshakeReplyMessage} from './classes/messages/RegionHandshakeReply';
import {RegionProtocolFlags} from './enums/RegionProtocolFlags';
import {AgentThrottleMessage} from './classes/messages/AgentThrottle';
import {AgentDataUpdateRequestMessage} from './classes/messages/AgentDataUpdateRequest';
import {RegionHandleRequestMessage} from './classes/messages/RegionHandleRequest';
import {RegionIDAndHandleReplyMessage} from './classes/messages/RegionIDAndHandleReply';
import * as Long from 'long';
import {MapItemRequestMessage} from './classes/messages/MapItemRequest';
import {GridItemType} from './enums/GridItemType';
import {MapItemReplyMessage} from './classes/messages/MapItemReply';
import {MapBlockRequestMessage} from './classes/messages/MapBlockRequest';
import {MapBlockReplyMessage} from './classes/messages/MapBlockReply';
import {MapInfoReply} from './events/MapInfoReply';
import {TeleportLureRequestMessage} from './classes/messages/TeleportLureRequest';
import {LureEvent} from './events/LureEvent';
import {TeleportFlags} from './enums/TeleportFlags';
import {TeleportProgressMessage} from './classes/messages/TeleportProgress';
import {TeleportStartMessage} from './classes/messages/TeleportStart';
import {SoundTriggerMessage} from './classes/messages/SoundTrigger';
import {AttachedSoundMessage} from './classes/messages/AttachedSound';
import {AvatarAnimationMessage} from './classes/messages/AvatarAnimation';
import {HTTPAssets} from './enums/HTTPAssets';
import * as LLSD from 'llsd';
import {TeleportEvent} from './events/TeleportEvent';
import {ClientEvents} from './classes/ClientEvents';
import {TeleportEventType} from './enums/TeleportEventType';

export class Bot
{
    private loginParams: LoginParameters;
    private currentRegion: Region;
    private agent: Agent;
    private throttleGenCounter = 0;
    private clientEvents: ClientEvents | null = null;

    constructor(login: LoginParameters)
    {
        this.loginParams = login;
    }

    login()
    {
        return new Promise((resolve, reject) =>
        {
            const loginHandler = new LoginHandler();
            loginHandler.Login(this.loginParams).then((response: LoginResponse) =>
            {
                this.clientEvents = response.clientEvents;
                this.currentRegion = response.region;
                this.agent = response.agent;
                resolve(response);
            }).catch((error: Error) =>
            {
                reject(error);
            });
        });
    }

    close()
    {
        return new Promise((resolve, reject) =>
        {
            const circuit = this.currentRegion.circuit;
            const msg: LogoutRequestMessage = new LogoutRequestMessage();
            msg.AgentData = {
                AgentID: this.agent.agentID,
                SessionID: circuit.sessionID
            };
            circuit.sendMessage(msg, PacketFlags.Reliable);
            circuit.waitForMessage(Message.LogoutReply, 5000).then((packet: Packet) =>
            {

            }).catch((error) =>
            {
                console.error('Timeout waiting for logout reply')
            }).then(() =>
            {
                this.agent.shutdown();
                this.currentRegion.shutdown();
                delete this.currentRegion;
                delete this.agent;
                resolve();
            });
        });
    }

    setBandwidth(total: number)
    {
        const circuit = this.currentRegion.circuit;
        const agentThrottle: AgentThrottleMessage = new AgentThrottleMessage();
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


        throttleData.writeFloatLE(resendThrottle, pos); pos += 4;
        throttleData.writeFloatLE(landThrottle, pos); pos += 4;
        throttleData.writeFloatLE(windThrottle, pos); pos += 4;
        throttleData.writeFloatLE(cloudThrottle, pos); pos += 4;
        throttleData.writeFloatLE(taskThrottle, pos); pos += 4;
        throttleData.writeFloatLE(textureThrottle, pos); pos += 4;
        throttleData.writeFloatLE(assetThrottle, pos);

        agentThrottle.Throttle = {
            GenCounter: this.throttleGenCounter++,
            Throttles: throttleData
        };
        circuit.sendMessage(agentThrottle, PacketFlags.Reliable);
    }

    acceptTeleport(lure: LureEvent): Promise<TeleportEvent>
    {
        return new Promise<TeleportEvent>((resolve, reject) =>
        {
            const circuit = this.currentRegion.circuit;
            const tlr = new TeleportLureRequestMessage();
            tlr.Info = {
                AgentID: this.agent.agentID,
                SessionID: circuit.sessionID,
                LureID: lure.lureID,
                TeleportFlags: TeleportFlags.ViaLure
            };
            circuit.sendMessage(tlr, PacketFlags.Reliable);
            if (this.currentRegion.caps.eventQueueClient)
            {
                if (this.clientEvents === null)
                {
                    reject(new Error('ClientEvents is null'));
                    return;
                }
                const subscription = this.clientEvents.onTeleportEvent.subscribe((e: TeleportEvent) =>
                {
                    if (e.eventType === TeleportEventType.TeleportFailed || e.eventType === TeleportEventType.TeleportCompleted)
                    {
                        subscription.unsubscribe();
                    }
                    if (e.eventType === TeleportEventType.TeleportFailed)
                    {
                        reject(e);
                    }
                    else if (e.eventType === TeleportEventType.TeleportCompleted)
                    {
                        if (e.simIP === 'local')
                        {
                            // Local TP - no need for any other shindiggery
                            resolve(e);
                            return;
                        }

                        if (this.clientEvents === null)
                        {
                            reject(new Error('ClientEvents is null'));
                            return;
                        }

                        // Successful teleport! First, rip apart circuit
                        this.currentRegion.shutdown();
                        const region: Region = new Region(this.agent, this.clientEvents);
                        region.circuit.circuitCode = this.currentRegion.circuit.circuitCode;
                        region.circuit.secureSessionID = this.currentRegion.circuit.secureSessionID;
                        region.circuit.sessionID = this.currentRegion.circuit.sessionID;
                        region.circuit.udpBlacklist = this.currentRegion.circuit.udpBlacklist;
                        region.circuit.ipAddress = e.simIP;
                        region.circuit.port = e.simPort;
                        this.agent.setCurrentRegion(region);
                        this.currentRegion = region;
                        this.currentRegion.activateCaps(e.seedCapability);
                        this.connectToSim().then(() =>
                        {
                            resolve(e);
                        }).catch((error) =>
                        {
                            reject(e);
                        });
                    }
                });
            }
        });
    }

    getRegionHandle(regionID: UUID): Promise<Long>
    {
        return new Promise<Long>((resolve, reject) =>
        {
            const circuit = this.currentRegion.circuit;
            const msg: RegionHandleRequestMessage = new RegionHandleRequestMessage();
            msg.RequestBlock = {
                RegionID: regionID,
            };
            circuit.sendMessage(msg, PacketFlags.Reliable);
            circuit.waitForMessage(Message.RegionIDAndHandleReply, 10000, (packet: Packet) =>
            {
                const filterMsg = packet.message as RegionIDAndHandleReplyMessage;
                return (filterMsg.ReplyBlock.RegionID.toString() === regionID.toString());
            }).then((packet: Packet) =>
            {
                const responseMsg = packet.message as RegionIDAndHandleReplyMessage;
                resolve(responseMsg.ReplyBlock.RegionHandle);
            });
        });
    }

    getRegionMapInfo(gridX: number, gridY: number): Promise<MapInfoReply>
    {
        return new Promise<MapInfoReply>((resolve, reject) =>
        {
            const circuit = this.currentRegion.circuit;
            const response = new MapInfoReply();
            const msg: MapBlockRequestMessage = new MapBlockRequestMessage();
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
            circuit.sendMessage(msg, PacketFlags.Reliable);
            circuit.waitForMessage(Message.MapBlockReply, 10000, (packet: Packet) =>
            {
                const filterMsg = packet.message as MapBlockReplyMessage;
                let found = false;
                filterMsg.Data.forEach((data) =>
                {
                    if (data.X === (gridX / 256) && data.Y === (gridY / 256))
                    {
                        found = true;
                    }
                });
                return found;
            }).then((packet: Packet) =>
            {
                const responseMsg = packet.message as MapBlockReplyMessage;
                responseMsg.Data.forEach((data) =>
                {
                    if (data.X === (gridX / 256) && data.Y === (gridY / 256))
                    {
                        response.name = Utils.BufferToStringSimple(data.Name);
                        response.accessFlags = data.Access;
                        response.mapImage = data.MapImageID;
                    }
                });

                //  Now get the region handle
                const regionHandle: Long = Utils.RegionCoordinatesToHandle(gridX, gridY);

                const mi = new MapItemRequestMessage();
                mi.AgentData = {
                    AgentID: this.agent.agentID,
                    SessionID: circuit.sessionID,
                    Flags: 2,
                    EstateID: 0,
                    Godlike: false
                };
                mi.RequestData = {
                    ItemType: GridItemType.AgentLocations,
                    RegionHandle: regionHandle
                };
                circuit.sendMessage(mi, PacketFlags.Reliable);
                const minX = Math.floor(gridX / 256) * 256;
                const maxX = minX + 256;
                const minY = Math.floor(gridY / 256) * 256;
                const maxY = minY + 256;
                response.avatars = [];
                circuit.waitForMessage(Message.MapItemReply, 10000, (packet: Packet) =>
                {
                    const filterMsg = packet.message as MapItemReplyMessage;
                    let found = false;
                    filterMsg.Data.forEach((data) =>
                    {
                        // Check if avatar is within our bounds
                        if (data.X >= minX && data.X <= maxX && data.Y >= minY && data.Y <= maxY)
                        {
                            found = true;
                        }
                    });
                    return found;
                }).then((packet2: Packet) =>
                {
                    const responseMsg2 = packet2.message as MapItemReplyMessage;
                    responseMsg2.Data.forEach((data) =>
                    {
                        response.avatars.push({
                            X: data.X,
                            Y: data.Y
                        });
                    });
                    resolve(response);
                }).catch((err) =>
                {
                    reject(err);
                });
            }).catch((err) =>
            {
                reject(err);
            });
        });
    }

    connectToSim()
    {
        return new Promise((resolve, reject) =>
        {
            const circuit = this.currentRegion.circuit;
            circuit.init();
            const msg: UseCircuitCodeMessage = new UseCircuitCodeMessage();
            msg.CircuitCode = {
                SessionID: circuit.sessionID,
                ID: this.agent.agentID,
                Code: circuit.circuitCode
            };
            circuit.waitForAck(circuit.sendMessage(msg, PacketFlags.Reliable), 1000).then(() =>
            {
                const agentMovement: CompleteAgentMovementMessage = new CompleteAgentMovementMessage();
                agentMovement.AgentData = {
                    AgentID: this.agent.agentID,
                    SessionID: circuit.sessionID,
                    CircuitCode: circuit.circuitCode
                };
                circuit.sendMessage(agentMovement, PacketFlags.Reliable);
                return circuit.waitForMessage(Message.RegionHandshake, 10000);
            }).then((packet: Packet) =>
            {
                const handshakeReply: RegionHandshakeReplyMessage = new RegionHandshakeReplyMessage();
                handshakeReply.AgentData = {
                    AgentID: this.agent.agentID,
                    SessionID: circuit.sessionID
                };
                handshakeReply.RegionInfo = {
                    Flags: RegionProtocolFlags.SelfAppearanceSupport | RegionProtocolFlags.AgentAppearanceService
                };
                return circuit.waitForAck(circuit.sendMessage(handshakeReply, PacketFlags.Reliable), 10000)
            }).then(() =>
            {
                this.setBandwidth(1536000);

                const agentRequest = new AgentDataUpdateRequestMessage();
                agentRequest.AgentData = {
                    AgentID: this.agent.agentID,
                    SessionID: circuit.sessionID
                };
                circuit.sendMessage(agentRequest, PacketFlags.Reliable);
                this.agent.setInitialAppearance();
                this.agent.circuitActive();

                circuit.subscribeToMessages(
                   [
                       Message.TeleportFailed,
                       Message.TeleportFinish,
                       Message.TeleportLocal,
                       Message.TeleportStart,
                       Message.TeleportProgress,
                       Message.TeleportCancel,
                       Message.SoundTrigger,
                       Message.AttachedSound,
                       Message.AvatarAnimation
                   ], (packet: Packet) =>
                    {
                        switch (packet.message.id)
                        {
                            case Message.TeleportLocal:
                            {
                                const tpEvent = new TeleportEvent();
                                tpEvent.message = '';
                                tpEvent.eventType = TeleportEventType.TeleportCompleted;
                                tpEvent.simIP = 'local';
                                tpEvent.simPort = 0;
                                tpEvent.seedCapability = '';

                                if (this.clientEvents === null)
                                {
                                    reject(new Error('ClientEvents is null'));
                                    return;
                                }

                                this.clientEvents.onTeleportEvent.next(tpEvent);
                                break;
                            }
                            case Message.TeleportStart:
                            {
                                const teleportStart = packet.message as TeleportStartMessage;

                                const tpEvent = new TeleportEvent();
                                tpEvent.message = '';
                                tpEvent.eventType = TeleportEventType.TeleportStarted;
                                tpEvent.simIP = '';
                                tpEvent.simPort = 0;
                                tpEvent.seedCapability = '';

                                if (this.clientEvents === null)
                                {
                                    reject(new Error('ClientEvents is null'));
                                    return;
                                }

                                this.clientEvents.onTeleportEvent.next(tpEvent);
                                break;
                            }
                            case Message.TeleportProgress:
                            {
                                const teleportProgress = packet.message as TeleportProgressMessage;
                                const message = Utils.BufferToStringSimple(teleportProgress.Info.Message);

                                const tpEvent = new TeleportEvent();
                                tpEvent.message = message;
                                tpEvent.eventType = TeleportEventType.TeleportProgress;
                                tpEvent.simIP = '';
                                tpEvent.simPort = 0;
                                tpEvent.seedCapability = '';

                                if (this.clientEvents === null)
                                {
                                    reject(new Error('ClientEvents is null'));
                                    return;
                                }

                                this.clientEvents.onTeleportEvent.next(tpEvent);
                                break;
                            }
                            case Message.SoundTrigger:
                            {
                                const soundTrigger = packet.message as SoundTriggerMessage;
                                const soundID = soundTrigger.SoundData.SoundID;
                                // TODO: SoundTrigger clientEvent
                                break;
                            }
                            case Message.AttachedSound:
                            {
                                const attachedSound = packet.message as AttachedSoundMessage;
                                const soundID = attachedSound.DataBlock.SoundID;
                                // TODO: AttachedSound clientEvent
                                break;
                            }
                            case Message.AvatarAnimation:
                            {
                                const avatarAnimation = packet.message as AvatarAnimationMessage;
                                // TODO: AvatarAnimation clientEvent
                                break;
                            }
                        }
                    });


                resolve();
            }).catch((error) =>
            {
                reject(error);
            });
        });
    }

    downloadAsset(type: HTTPAssets, uuid: UUID)
    {
        return this.currentRegion.caps.downloadAsset(uuid, type);
    }

    uploadAsset(type: HTTPAssets, data: Buffer, name: string, description: string): Promise<UUID>
    {
        return new Promise<UUID>((resolve, reject) =>
        {
            if (this.agent && this.agent.inventory && this.agent.inventory.main && this.agent.inventory.main.root)
            {
                this.currentRegion.caps.capsRequestXML('NewFileAgentInventory', {
                    'folder_id': new LLSD.UUID(this.agent.inventory.main.root.toString()),
                    'asset_type': type,
                    'inventory_type': Utils.HTTPAssetTypeToInventoryType(type),
                    'name': name,
                    'description': description,
                    'everyone_mask': (1 << 13) | (1 << 14) | (1 << 15) | (1 << 19),
                    'group_mask': (1 << 13) | (1 << 14) | (1 << 15) | (1 << 19),
                    'next_owner_mask': (1 << 13) | (1 << 14) | (1 << 15) | (1 << 19),
                    'expected_upload_cost': 0
                }).then((response: any) =>
                {
                    if (response['state'] === 'upload')
                    {
                        const uploadURL = response['uploader'];
                        this.currentRegion.caps.capsRequestUpload(uploadURL, data).then((responseUpload: any) =>
                        {
                            resolve(new UUID(responseUpload['new_asset'].toString()));
                        }).catch((err) =>
                        {
                            reject(err);
                        });
                    }
                }).catch((err) =>
                {
                    console.log(err);
                })
            }
        });
    }
}
