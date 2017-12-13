"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MapInfoReply_1 = require("../../events/MapInfoReply");
const RegionHandleRequest_1 = require("../messages/RegionHandleRequest");
const Message_1 = require("../../enums/Message");
const MapBlockRequest_1 = require("../messages/MapBlockRequest");
const MapItemRequest_1 = require("../messages/MapItemRequest");
const Utils_1 = require("../Utils");
const PacketFlags_1 = require("../../enums/PacketFlags");
const GridItemType_1 = require("../../enums/GridItemType");
const CommandsBase_1 = require("./CommandsBase");
class GridCommands extends CommandsBase_1.CommandsBase {
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
}
exports.GridCommands = GridCommands;
//# sourceMappingURL=GridCommands.js.map