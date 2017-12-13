"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Vector3_1 = require("../Vector3");
const Long = require("long");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class ChildAgentPositionUpdateMessage {
    constructor() {
        this.name = 'ChildAgentPositionUpdate';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyHigh;
        this.id = Message_1.Message.ChildAgentPositionUpdate;
    }
    getSize() {
        return 129;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeInt32LE(this.AgentData['RegionHandle'].low, pos);
        pos += 4;
        buf.writeInt32LE(this.AgentData['RegionHandle'].high, pos);
        pos += 4;
        buf.writeUInt32LE(this.AgentData['ViewerCircuitCode'], pos);
        pos += 4;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['AgentPos'].writeToBuffer(buf, pos, false);
        pos += 12;
        this.AgentData['AgentVel'].writeToBuffer(buf, pos, false);
        pos += 12;
        this.AgentData['Center'].writeToBuffer(buf, pos, false);
        pos += 12;
        this.AgentData['Size'].writeToBuffer(buf, pos, false);
        pos += 12;
        this.AgentData['AtAxis'].writeToBuffer(buf, pos, false);
        pos += 12;
        this.AgentData['LeftAxis'].writeToBuffer(buf, pos, false);
        pos += 12;
        this.AgentData['UpAxis'].writeToBuffer(buf, pos, false);
        pos += 12;
        buf.writeUInt8((this.AgentData['ChangedGrid']) ? 1 : 0, pos++);
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjAgentData = {
            RegionHandle: Long.ZERO,
            ViewerCircuitCode: 0,
            AgentID: UUID_1.UUID.zero(),
            SessionID: UUID_1.UUID.zero(),
            AgentPos: Vector3_1.Vector3.getZero(),
            AgentVel: Vector3_1.Vector3.getZero(),
            Center: Vector3_1.Vector3.getZero(),
            Size: Vector3_1.Vector3.getZero(),
            AtAxis: Vector3_1.Vector3.getZero(),
            LeftAxis: Vector3_1.Vector3.getZero(),
            UpAxis: Vector3_1.Vector3.getZero(),
            ChangedGrid: false
        };
        newObjAgentData['RegionHandle'] = new Long(buf.readInt32LE(pos), buf.readInt32LE(pos + 4));
        pos += 8;
        newObjAgentData['ViewerCircuitCode'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['SessionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['AgentPos'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjAgentData['AgentVel'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjAgentData['Center'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjAgentData['Size'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjAgentData['AtAxis'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjAgentData['LeftAxis'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjAgentData['UpAxis'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjAgentData['ChangedGrid'] = (buf.readUInt8(pos++) === 1);
        this.AgentData = newObjAgentData;
        return pos - startPos;
    }
}
exports.ChildAgentPositionUpdateMessage = ChildAgentPositionUpdateMessage;
//# sourceMappingURL=ChildAgentPositionUpdate.js.map