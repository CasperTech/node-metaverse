"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CommandsBase_1 = require("./CommandsBase");
const Region_1 = require("../Region");
const TeleportEventType_1 = require("../../enums/TeleportEventType");
const TeleportLureRequest_1 = require("../messages/TeleportLureRequest");
const TeleportLocationRequest_1 = require("../messages/TeleportLocationRequest");
const __1 = require("../..");
class TeleportCommands extends CommandsBase_1.CommandsBase {
    constructor(region, agent, bot) {
        super(region, agent, bot);
        this.expectingTeleport = false;
        this.teleportSubscription = this.bot.clientEvents.onTeleportEvent.subscribe((e) => {
            if (e.eventType === TeleportEventType_1.TeleportEventType.TeleportCompleted) {
                if (!this.expectingTeleport) {
                    if (e.simIP === 'local') {
                        return;
                    }
                    const newRegion = new Region_1.Region(this.agent, this.bot.clientEvents, this.currentRegion.options);
                    newRegion.circuit.circuitCode = this.currentRegion.circuit.circuitCode;
                    newRegion.circuit.secureSessionID = this.currentRegion.circuit.secureSessionID;
                    newRegion.circuit.sessionID = this.currentRegion.circuit.sessionID;
                    newRegion.circuit.udpBlacklist = this.currentRegion.circuit.udpBlacklist;
                    newRegion.circuit.ipAddress = e.simIP;
                    newRegion.circuit.port = e.simPort;
                    newRegion.activateCaps(e.seedCapability);
                    this.bot.changeRegion(newRegion, false).then(() => {
                    }).catch((error) => {
                        console.log('Failed to change region');
                        console.error(error);
                    });
                }
            }
        });
    }
    shutdown() {
        this.teleportSubscription.unsubscribe();
    }
    awaitTeleportEvent(requested) {
        return new Promise((resolve, reject) => {
            if (this.currentRegion.caps.eventQueueClient) {
                if (this.bot.clientEvents === null) {
                    reject(new Error('ClientEvents is null'));
                    return;
                }
                this.expectingTeleport = true;
                const subscription = this.bot.clientEvents.onTeleportEvent.subscribe((e) => {
                    if (e.eventType === TeleportEventType_1.TeleportEventType.TeleportFailed || e.eventType === TeleportEventType_1.TeleportEventType.TeleportCompleted) {
                        setTimeout(() => {
                            this.expectingTeleport = false;
                        });
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
                        if (this.bot.clientEvents === null) {
                            reject(new Error('ClientEvents is null'));
                            return;
                        }
                        const region = new Region_1.Region(this.agent, this.bot.clientEvents, this.currentRegion.options);
                        region.circuit.circuitCode = this.currentRegion.circuit.circuitCode;
                        region.circuit.secureSessionID = this.currentRegion.circuit.secureSessionID;
                        region.circuit.sessionID = this.currentRegion.circuit.sessionID;
                        region.circuit.udpBlacklist = this.currentRegion.circuit.udpBlacklist;
                        region.circuit.ipAddress = e.simIP;
                        region.circuit.port = e.simPort;
                        region.activateCaps(e.seedCapability);
                        this.bot.changeRegion(region, requested).then(() => {
                            resolve(e);
                        }).catch((error) => {
                            reject(error);
                        });
                    }
                });
            }
            else {
                reject(new Error('EventQueue not ready'));
            }
        });
    }
    acceptTeleport(lure) {
        return new Promise((resolve, reject) => {
            const circuit = this.currentRegion.circuit;
            const tlr = new TeleportLureRequest_1.TeleportLureRequestMessage();
            tlr.Info = {
                AgentID: this.agent.agentID,
                SessionID: circuit.sessionID,
                LureID: lure.lureID,
                TeleportFlags: __1.TeleportFlags.ViaLure
            };
            circuit.sendMessage(tlr, __1.PacketFlags.Reliable);
            this.awaitTeleportEvent(true).then((event) => {
                resolve(event);
            }).catch((err) => {
                reject(err);
            });
        });
    }
    teleportToHandle(handle, position, lookAt) {
        return new Promise((resolve, reject) => {
            const rtm = new TeleportLocationRequest_1.TeleportLocationRequestMessage();
            rtm.AgentData = {
                AgentID: this.agent.agentID,
                SessionID: this.circuit.sessionID
            };
            rtm.Info = {
                LookAt: lookAt,
                Position: position,
                RegionHandle: handle
            };
            this.circuit.sendMessage(rtm, __1.PacketFlags.Reliable);
            this.awaitTeleportEvent(true).then((event) => {
                resolve(event);
            }).catch((err) => {
                reject(err);
            });
        });
    }
    teleportTo(regionName, position, lookAt) {
        return new Promise((resolve, reject) => {
            this.bot.clientCommands.grid.getRegionByName(regionName).then((region) => {
                this.teleportToHandle(region.handle, position, lookAt).then((event) => {
                    resolve(event);
                }).catch((err) => {
                    reject(err);
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }
}
exports.TeleportCommands = TeleportCommands;
//# sourceMappingURL=TeleportCommands.js.map