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
const Message_1 = require("../../enums/Message");
const MapBlockRequest_1 = require("../messages/MapBlockRequest");
const UUID_1 = require("../UUID");
const MapItemRequest_1 = require("../messages/MapItemRequest");
const Utils_1 = require("../Utils");
const GridItemType_1 = require("../../enums/GridItemType");
const CommandsBase_1 = require("./CommandsBase");
const AvatarPickerRequest_1 = require("../messages/AvatarPickerRequest");
const FilterResponse_1 = require("../../enums/FilterResponse");
const MapNameRequest_1 = require("../messages/MapNameRequest");
const GridLayerType_1 = require("../../enums/GridLayerType");
const MapBlock_1 = require("../MapBlock");
const __1 = require("../..");
const TimeoutError_1 = require("../TimeoutError");
const UUIDNameRequest_1 = require("../messages/UUIDNameRequest");
class GridCommands extends CommandsBase_1.CommandsBase {
    getRegionByName(regionName) {
        return new Promise((resolve, reject) => {
            const circuit = this.currentRegion.circuit;
            const msg = new MapNameRequest_1.MapNameRequestMessage();
            msg.AgentData = {
                AgentID: this.agent.agentID,
                SessionID: circuit.sessionID,
                Flags: GridLayerType_1.GridLayerType.Objects,
                EstateID: 0,
                Godlike: false
            };
            msg.NameData = {
                Name: Utils_1.Utils.StringToBuffer(regionName)
            };
            circuit.sendMessage(msg, __1.PacketFlags.Reliable);
            circuit.waitForMessage(Message_1.Message.MapBlockReply, 10000, (filterMsg) => {
                let found = false;
                filterMsg.Data.forEach((region) => {
                    const name = Utils_1.Utils.BufferToStringSimple(region.Name);
                    if (name.trim().toLowerCase() === regionName.trim().toLowerCase()) {
                        found = true;
                    }
                });
                if (found) {
                    return FilterResponse_1.FilterResponse.Finish;
                }
                return FilterResponse_1.FilterResponse.NoMatch;
            }).then((responseMsg) => {
                responseMsg.Data.forEach((region) => {
                    const name = Utils_1.Utils.BufferToStringSimple(region.Name);
                    if (name.trim().toLowerCase() === regionName.trim().toLowerCase() && !(region.X === 0 && region.Y === 0)) {
                        const reply = new class {
                            constructor() {
                                this.X = region.X;
                                this.Y = region.Y;
                                this.name = name;
                                this.access = region.Access;
                                this.regionFlags = region.RegionFlags;
                                this.waterHeight = region.WaterHeight;
                                this.agents = region.Agents;
                                this.mapImageID = region.MapImageID;
                                this.handle = Utils_1.Utils.RegionCoordinatesToHandle(region.X * 256, region.Y * 256).regionHandle;
                            }
                        };
                        resolve(reply);
                    }
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }
    getRegionMapInfo(gridX, gridY) {
        return new Promise((resolve, reject) => {
            const circuit = this.currentRegion.circuit;
            const response = new __1.MapInfoReplyEvent();
            const msg = new MapBlockRequest_1.MapBlockRequestMessage();
            msg.AgentData = {
                AgentID: this.agent.agentID,
                SessionID: circuit.sessionID,
                Flags: 0,
                EstateID: 0,
                Godlike: false
            };
            msg.PositionData = {
                MinX: gridX,
                MaxX: gridX,
                MinY: gridY,
                MaxY: gridY
            };
            circuit.sendMessage(msg, __1.PacketFlags.Reliable);
            circuit.waitForMessage(Message_1.Message.MapBlockReply, 10000, (filterMsg) => {
                let found = false;
                filterMsg.Data.forEach((data) => {
                    if (data.X === gridX && data.Y === gridY) {
                        found = true;
                    }
                });
                if (found) {
                    return FilterResponse_1.FilterResponse.Finish;
                }
                return FilterResponse_1.FilterResponse.NoMatch;
            }).then((responseMsg) => {
                responseMsg.Data.forEach((data) => {
                    if (data.X === gridX && data.Y === gridY) {
                        response.block = new MapBlock_1.MapBlock();
                        response.block.name = Utils_1.Utils.BufferToStringSimple(data.Name);
                        response.block.accessFlags = data.Access;
                        response.block.mapImage = data.MapImageID;
                    }
                });
                const regionHandle = Utils_1.Utils.RegionCoordinatesToHandle(gridX * 256, gridY * 256).regionHandle;
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
                circuit.sendMessage(mi, __1.PacketFlags.Reliable);
                const minX = gridX * 256;
                const maxX = minX + 256;
                const minY = gridY * 256;
                const maxY = minY + 256;
                response.avatars = [];
                circuit.waitForMessage(Message_1.Message.MapItemReply, 10000, (filterMsg) => {
                    let found = false;
                    filterMsg.Data.forEach((data) => {
                        if (data.X >= minX && data.X <= maxX && data.Y >= minY && data.Y <= maxY) {
                            found = true;
                        }
                    });
                    if (found) {
                        return FilterResponse_1.FilterResponse.Finish;
                    }
                    else {
                        return FilterResponse_1.FilterResponse.NoMatch;
                    }
                }).then((responseMsg2) => {
                    responseMsg2.Data.forEach((data) => {
                        response.avatars.push(new __1.Vector2([
                            data.X,
                            data.Y
                        ]));
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
    getRegionMapInfoRange(minX, minY, maxX, maxY) {
        return new Promise((resolve, reject) => {
            const circuit = this.currentRegion.circuit;
            const response = new __1.MapInfoRangeReplyEvent();
            const msg = new MapBlockRequest_1.MapBlockRequestMessage();
            msg.AgentData = {
                AgentID: this.agent.agentID,
                SessionID: circuit.sessionID,
                Flags: 0,
                EstateID: 0,
                Godlike: false
            };
            msg.PositionData = {
                MinX: minX,
                MaxX: maxX,
                MinY: minY,
                MaxY: maxY
            };
            response.regions = [];
            circuit.sendMessage(msg, __1.PacketFlags.Reliable);
            circuit.waitForMessage(Message_1.Message.MapBlockReply, 30000, (filterMsg) => {
                let found = false;
                filterMsg.Data.forEach((data) => {
                    if (data.X >= minX && data.X <= maxX && data.Y >= minY && data.Y <= maxY) {
                        found = true;
                        const mapBlock = new MapBlock_1.MapBlock();
                        mapBlock.name = Utils_1.Utils.BufferToStringSimple(data.Name);
                        mapBlock.accessFlags = data.Access;
                        mapBlock.mapImage = data.MapImageID;
                        response.regions.push(mapBlock);
                    }
                });
                if (found) {
                    return FilterResponse_1.FilterResponse.Match;
                }
                return FilterResponse_1.FilterResponse.NoMatch;
            }).then((ignore) => {
            }).catch((err) => {
                if (err instanceof TimeoutError_1.TimeoutError && err.timeout === true) {
                    resolve(response);
                }
                else {
                    reject(err);
                }
            });
        });
    }
    avatarName2Key(name) {
        const check = name.split('.');
        if (check.length > 1) {
            name = check.join(' ');
        }
        else {
            name += ' resident';
        }
        name = name.toLowerCase();
        const queryID = UUID_1.UUID.random();
        return new Promise((resolve, reject) => {
            const aprm = new AvatarPickerRequest_1.AvatarPickerRequestMessage();
            aprm.AgentData = {
                AgentID: this.agent.agentID,
                SessionID: this.circuit.sessionID,
                QueryID: queryID
            };
            aprm.Data = {
                Name: Utils_1.Utils.StringToBuffer(name)
            };
            this.circuit.sendMessage(aprm, __1.PacketFlags.Reliable);
            this.circuit.waitForMessage(Message_1.Message.AvatarPickerReply, 10000, (apr) => {
                if (apr.AgentData.QueryID.toString() === queryID.toString()) {
                    return FilterResponse_1.FilterResponse.Finish;
                }
                else {
                    return FilterResponse_1.FilterResponse.NoMatch;
                }
            }).then((apr) => {
                let found = null;
                apr.Data.forEach((dataBlock) => {
                    const resultName = (Utils_1.Utils.BufferToStringSimple(dataBlock.FirstName) + ' ' +
                        Utils_1.Utils.BufferToStringSimple(dataBlock.LastName)).toLowerCase();
                    if (resultName === name) {
                        found = dataBlock.AvatarID;
                    }
                });
                if (found !== null) {
                    resolve(found);
                }
                else {
                    reject('Name not found');
                }
            }).catch((err) => {
                reject(err);
            });
        });
    }
    avatarKey2Name(uuid) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const req = new UUIDNameRequest_1.UUIDNameRequestMessage();
            req.UUIDNameBlock = [];
            let arr = true;
            if (!Array.isArray(uuid)) {
                arr = false;
                uuid = [uuid];
            }
            const waitingFor = {};
            let remaining = 0;
            for (const id of uuid) {
                waitingFor[id.toString()] = null;
                req.UUIDNameBlock.push({ 'ID': id });
                remaining++;
            }
            this.circuit.sendMessage(req, __1.PacketFlags.Reliable);
            try {
                yield this.circuit.waitForMessage(Message_1.Message.UUIDNameReply, 10000, (reply) => {
                    let found = false;
                    for (const name of reply.UUIDNameBlock) {
                        if (waitingFor[name.ID.toString()] !== undefined) {
                            found = true;
                            if (waitingFor[name.ID.toString()] === null) {
                                waitingFor[name.ID.toString()] = {
                                    'firstName': Utils_1.Utils.BufferToStringSimple(name.FirstName),
                                    'lastName': Utils_1.Utils.BufferToStringSimple(name.LastName)
                                };
                                remaining--;
                            }
                        }
                    }
                    if (remaining < 1) {
                        return FilterResponse_1.FilterResponse.Finish;
                    }
                    else if (found) {
                        return FilterResponse_1.FilterResponse.Match;
                    }
                    return FilterResponse_1.FilterResponse.NoMatch;
                });
                if (!arr) {
                    const result = waitingFor[uuid[0].toString()];
                    const av = new __1.Avatar(uuid[0], result.firstName, result.lastName);
                    resolve(av);
                }
                else {
                    const response = [];
                    for (const k of uuid) {
                        const result = waitingFor[k.toString()];
                        const av = new __1.Avatar(k, result.firstName, result.lastName);
                        response.push(av);
                    }
                    resolve(response);
                }
            }
            catch (e) {
                reject(e);
            }
        }));
    }
}
exports.GridCommands = GridCommands;
//# sourceMappingURL=GridCommands.js.map