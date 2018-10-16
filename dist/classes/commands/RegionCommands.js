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
    getObjectsInArea(minX, maxX, minY, maxY, minZ, maxZ) {
        return this.currentRegion.objects.getObjectsInArea(minX, maxX, minY, maxY, minZ, maxZ);
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