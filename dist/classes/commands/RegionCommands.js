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
const RegionHandleRequest_1 = require("../messages/RegionHandleRequest");
const Message_1 = require("../../enums/Message");
const FilterResponse_1 = require("../../enums/FilterResponse");
const __1 = require("../..");
const ObjectGrab_1 = require("../messages/ObjectGrab");
const ObjectDeGrab_1 = require("../messages/ObjectDeGrab");
const ObjectGrabUpdate_1 = require("../messages/ObjectGrabUpdate");
const ObjectSelect_1 = require("../messages/ObjectSelect");
const Utils_1 = require("../Utils");
const ObjectDeselect_1 = require("../messages/ObjectDeselect");
const PCode_1 = require("../../enums/PCode");
class RegionCommands extends CommandsBase_1.CommandsBase {
    getRegionHandle(regionID) {
        return __awaiter(this, void 0, void 0, function* () {
            const circuit = this.currentRegion.circuit;
            const msg = new RegionHandleRequest_1.RegionHandleRequestMessage();
            msg.RequestBlock = {
                RegionID: regionID,
            };
            circuit.sendMessage(msg, __1.PacketFlags.Reliable);
            const responseMsg = yield circuit.waitForMessage(Message_1.Message.RegionIDAndHandleReply, 10000, (filterMsg) => {
                if (filterMsg.ReplyBlock.RegionID.toString() === regionID.toString()) {
                    return FilterResponse_1.FilterResponse.Finish;
                }
                else {
                    return FilterResponse_1.FilterResponse.NoMatch;
                }
            });
            return responseMsg.ReplyBlock.RegionHandle;
        });
    }
    deselectObjects(objects) {
        return __awaiter(this, void 0, void 0, function* () {
            const selectLimit = 255;
            if (objects.length > selectLimit) {
                for (let x = 0; x < objects.length; x += selectLimit) {
                    const selectList = [];
                    for (let y = 0; y < selectLimit; y++) {
                        if (y < objects.length) {
                            selectList.push(objects[x + y]);
                        }
                    }
                    yield this.deselectObjects(selectList);
                }
                return;
            }
            else {
                const deselectObject = new ObjectDeselect_1.ObjectDeselectMessage();
                deselectObject.AgentData = {
                    AgentID: this.agent.agentID,
                    SessionID: this.circuit.sessionID
                };
                deselectObject.ObjectData = [];
                const uuidMap = {};
                for (const obj of objects) {
                    const uuidStr = obj.FullID.toString();
                    if (!uuidMap[uuidStr]) {
                        uuidMap[uuidStr] = obj;
                        deselectObject.ObjectData.push({
                            ObjectLocalID: obj.ID
                        });
                    }
                }
                const sequenceID = this.circuit.sendMessage(deselectObject, __1.PacketFlags.Reliable);
                return yield this.circuit.waitForAck(sequenceID, 10000);
            }
        });
    }
    countObjects() {
        return this.currentRegion.objects.getNumberOfObjects();
    }
    selectObjects(objects) {
        return __awaiter(this, void 0, void 0, function* () {
            const selectLimit = 255;
            if (objects.length > selectLimit) {
                for (let x = 0; x < objects.length; x += selectLimit) {
                    const selectList = [];
                    for (let y = 0; y < selectLimit; y++) {
                        if (y < objects.length) {
                            selectList.push(objects[x + y]);
                        }
                    }
                    yield this.selectObjects(selectList);
                }
                return;
            }
            else {
                const selectObject = new ObjectSelect_1.ObjectSelectMessage();
                selectObject.AgentData = {
                    AgentID: this.agent.agentID,
                    SessionID: this.circuit.sessionID
                };
                selectObject.ObjectData = [];
                const uuidMap = {};
                for (const obj of objects) {
                    const uuidStr = obj.FullID.toString();
                    if (!uuidMap[uuidStr]) {
                        uuidMap[uuidStr] = obj;
                        selectObject.ObjectData.push({
                            ObjectLocalID: obj.ID
                        });
                    }
                }
                let resolved = 0;
                this.circuit.sendMessage(selectObject, __1.PacketFlags.Reliable);
                return yield this.circuit.waitForMessage(Message_1.Message.ObjectProperties, 10000, (propertiesMessage) => {
                    let found = false;
                    for (const objData of propertiesMessage.ObjectData) {
                        const objDataUUID = objData.ObjectID.toString();
                        if (uuidMap[objDataUUID] !== undefined) {
                            resolved++;
                            const obj = uuidMap[objDataUUID];
                            obj.creatorID = objData.CreatorID;
                            obj.creationDate = objData.CreationDate;
                            obj.baseMask = objData.BaseMask;
                            obj.ownerMask = objData.OwnerMask;
                            obj.groupMask = objData.GroupMask;
                            obj.everyoneMask = objData.EveryoneMask;
                            obj.nextOwnerMask = objData.NextOwnerMask;
                            obj.ownershipCost = objData.OwnershipCost;
                            obj.saleType = objData.SaleType;
                            obj.salePrice = objData.SalePrice;
                            obj.aggregatePerms = objData.AggregatePerms;
                            obj.aggregatePermTextures = objData.AggregatePermTextures;
                            obj.aggregatePermTexturesOwner = objData.AggregatePermTexturesOwner;
                            obj.category = objData.Category;
                            obj.inventorySerial = objData.InventorySerial;
                            obj.itemID = objData.ItemID;
                            obj.folderID = objData.FolderID;
                            obj.fromTaskID = objData.FromTaskID;
                            obj.lastOwnerID = objData.LastOwnerID;
                            obj.name = Utils_1.Utils.BufferToStringSimple(objData.Name);
                            obj.description = Utils_1.Utils.BufferToStringSimple(objData.Description);
                            obj.touchName = Utils_1.Utils.BufferToStringSimple(objData.TouchName);
                            obj.sitName = Utils_1.Utils.BufferToStringSimple(objData.SitName);
                            obj.textureID = Utils_1.Utils.BufferToStringSimple(objData.TextureID);
                            obj.resolvedAt = new Date().getTime() / 1000;
                            delete uuidMap[objDataUUID];
                            found = true;
                        }
                    }
                    if (Object.keys(uuidMap).length === 0) {
                        return FilterResponse_1.FilterResponse.Finish;
                    }
                    if (!found) {
                        return FilterResponse_1.FilterResponse.NoMatch;
                    }
                    else {
                        return FilterResponse_1.FilterResponse.Match;
                    }
                });
            }
        });
    }
    resolveObjects(objects) {
        return __awaiter(this, void 0, void 0, function* () {
            const objs = {};
            const scanObject = function (obj) {
                const localID = obj.ID;
                if (!objs[localID]) {
                    objs[localID] = obj;
                    if (obj.children) {
                        for (const child of obj.children) {
                            scanObject(child);
                        }
                    }
                }
            };
            for (const obj of objects) {
                scanObject(obj);
            }
            const resolveTime = new Date().getTime() / 1000;
            let objectList = [];
            let totalRemaining = 0;
            try {
                for (const k of Object.keys(objs)) {
                    const ky = parseInt(k, 10);
                    if (objs[ky] !== undefined) {
                        const o = objs[ky];
                        if (o.resolvedAt === undefined) {
                            o.resolvedAt = 0;
                        }
                        if (o.resolvedAt !== undefined && o.resolvedAt < resolveTime && o.PCode !== PCode_1.PCode.Avatar) {
                            objs[ky].name = undefined;
                            totalRemaining++;
                            objectList.push(objs[ky]);
                            if (objectList.length > 254) {
                                try {
                                    yield this.selectObjects(objectList);
                                    yield this.deselectObjects(objectList);
                                    for (const chk of objectList) {
                                        if (chk.resolvedAt !== undefined && chk.resolvedAt >= resolveTime) {
                                            totalRemaining--;
                                        }
                                    }
                                }
                                catch (ignore) {
                                }
                                finally {
                                    objectList = [];
                                }
                            }
                        }
                    }
                }
                if (objectList.length > 0) {
                    yield this.selectObjects(objectList);
                    yield this.deselectObjects(objectList);
                    for (const chk of objectList) {
                        if (chk.resolvedAt !== undefined && chk.resolvedAt >= resolveTime) {
                            totalRemaining--;
                        }
                    }
                }
            }
            catch (ignore) {
            }
            finally {
                if (totalRemaining < 1) {
                    totalRemaining = 0;
                    for (const obj of objectList) {
                        if (obj.resolvedAt === undefined || obj.resolvedAt < resolveTime) {
                            totalRemaining++;
                        }
                    }
                    if (totalRemaining > 0) {
                        console.error(totalRemaining + ' objects could not be resolved');
                    }
                }
            }
        });
    }
    getAllObjects(resolve = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const objs = this.currentRegion.objects.getAllObjects();
            if (resolve) {
                yield this.resolveObjects(objs);
            }
            return objs;
        });
    }
    getObjectsInArea(minX, maxX, minY, maxY, minZ, maxZ, resolve = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const objs = this.currentRegion.objects.getObjectsInArea(minX, maxX, minY, maxY, minZ, maxZ);
            if (resolve) {
                yield this.resolveObjects(objs);
            }
            return objs;
        });
    }
    grabObject(localID, grabOffset = __1.Vector3.getZero(), uvCoordinate = __1.Vector3.getZero(), stCoordinate = __1.Vector3.getZero(), faceIndex = 0, position = __1.Vector3.getZero(), normal = __1.Vector3.getZero(), binormal = __1.Vector3.getZero()) {
        return __awaiter(this, void 0, void 0, function* () {
            if (localID instanceof UUID_1.UUID) {
                const obj = this.currentRegion.objects.getObjectByUUID(localID);
                localID = obj.ID;
            }
            const msg = new ObjectGrab_1.ObjectGrabMessage();
            msg.AgentData = {
                AgentID: this.agent.agentID,
                SessionID: this.circuit.sessionID
            };
            msg.ObjectData = {
                LocalID: localID,
                GrabOffset: grabOffset
            };
            msg.SurfaceInfo = [
                {
                    UVCoord: uvCoordinate,
                    STCoord: stCoordinate,
                    FaceIndex: faceIndex,
                    Position: position,
                    Normal: normal,
                    Binormal: binormal
                }
            ];
            const seqID = this.circuit.sendMessage(msg, __1.PacketFlags.Reliable);
            yield this.circuit.waitForAck(seqID, 10000);
        });
    }
    deGrabObject(localID, grabOffset = __1.Vector3.getZero(), uvCoordinate = __1.Vector3.getZero(), stCoordinate = __1.Vector3.getZero(), faceIndex = 0, position = __1.Vector3.getZero(), normal = __1.Vector3.getZero(), binormal = __1.Vector3.getZero()) {
        return __awaiter(this, void 0, void 0, function* () {
            if (localID instanceof UUID_1.UUID) {
                const obj = this.currentRegion.objects.getObjectByUUID(localID);
                localID = obj.ID;
            }
            const msg = new ObjectDeGrab_1.ObjectDeGrabMessage();
            msg.AgentData = {
                AgentID: this.agent.agentID,
                SessionID: this.circuit.sessionID
            };
            msg.ObjectData = {
                LocalID: localID
            };
            msg.SurfaceInfo = [
                {
                    UVCoord: uvCoordinate,
                    STCoord: stCoordinate,
                    FaceIndex: faceIndex,
                    Position: position,
                    Normal: normal,
                    Binormal: binormal
                }
            ];
            const seqID = this.circuit.sendMessage(msg, __1.PacketFlags.Reliable);
            yield this.circuit.waitForAck(seqID, 10000);
        });
    }
    dragGrabbedObject(localID, grabPosition, grabOffset = __1.Vector3.getZero(), uvCoordinate = __1.Vector3.getZero(), stCoordinate = __1.Vector3.getZero(), faceIndex = 0, position = __1.Vector3.getZero(), normal = __1.Vector3.getZero(), binormal = __1.Vector3.getZero()) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(localID instanceof UUID_1.UUID)) {
                const obj = this.currentRegion.objects.getObjectByLocalID(localID);
                localID = obj.FullID;
            }
            const msg = new ObjectGrabUpdate_1.ObjectGrabUpdateMessage();
            msg.AgentData = {
                AgentID: this.agent.agentID,
                SessionID: this.circuit.sessionID
            };
            msg.ObjectData = {
                ObjectID: localID,
                GrabOffsetInitial: grabOffset,
                GrabPosition: grabPosition,
                TimeSinceLast: 0
            };
            msg.SurfaceInfo = [
                {
                    UVCoord: uvCoordinate,
                    STCoord: stCoordinate,
                    FaceIndex: faceIndex,
                    Position: position,
                    Normal: normal,
                    Binormal: binormal
                }
            ];
            const seqID = this.circuit.sendMessage(msg, __1.PacketFlags.Reliable);
            yield this.circuit.waitForAck(seqID, 10000);
        });
    }
    touchObject(localID, grabOffset = __1.Vector3.getZero(), uvCoordinate = __1.Vector3.getZero(), stCoordinate = __1.Vector3.getZero(), faceIndex = 0, position = __1.Vector3.getZero(), normal = __1.Vector3.getZero(), binormal = __1.Vector3.getZero()) {
        return __awaiter(this, void 0, void 0, function* () {
            if (localID instanceof UUID_1.UUID) {
                const obj = this.currentRegion.objects.getObjectByUUID(localID);
                localID = obj.ID;
            }
            yield this.grabObject(localID, grabOffset, uvCoordinate, stCoordinate, faceIndex, position, normal, binormal);
            yield this.deGrabObject(localID, grabOffset, uvCoordinate, stCoordinate, faceIndex, position, normal, binormal);
        });
    }
}
exports.RegionCommands = RegionCommands;
//# sourceMappingURL=RegionCommands.js.map