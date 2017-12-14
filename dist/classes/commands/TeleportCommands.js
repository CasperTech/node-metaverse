"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CommandsBase_1 = require("./CommandsBase");
const Region_1 = require("../Region");
const TeleportEventType_1 = require("../../enums/TeleportEventType");
const PacketFlags_1 = require("../../enums/PacketFlags");
const TeleportLureRequest_1 = require("../messages/TeleportLureRequest");
const TeleportFlags_1 = require("../../enums/TeleportFlags");
class TeleportCommands extends CommandsBase_1.CommandsBase {
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
                if (this.bot.clientEvents === null) {
                    reject(new Error('ClientEvents is null'));
                    return;
                }
                const subscription = this.bot.clientEvents.onTeleportEvent.subscribe((e) => {
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
                        if (this.bot.clientEvents === null) {
                            reject(new Error('ClientEvents is null'));
                            return;
                        }
                        this.currentRegion.shutdown();
                        const region = new Region_1.Region(this.agent, this.bot.clientEvents, this.currentRegion.options);
                        region.circuit.circuitCode = this.currentRegion.circuit.circuitCode;
                        region.circuit.secureSessionID = this.currentRegion.circuit.secureSessionID;
                        region.circuit.sessionID = this.currentRegion.circuit.sessionID;
                        region.circuit.udpBlacklist = this.currentRegion.circuit.udpBlacklist;
                        region.circuit.ipAddress = e.simIP;
                        region.circuit.port = e.simPort;
                        this.agent.setCurrentRegion(region);
                        this.currentRegion = region;
                        this.currentRegion.activateCaps(e.seedCapability);
                        this.bot.changeRegion(this.currentRegion).then(() => {
                            resolve(e);
                        }).catch((error) => {
                            reject(error);
                        });
                    }
                });
            }
        });
    }
}
exports.TeleportCommands = TeleportCommands;
//# sourceMappingURL=TeleportCommands.js.map