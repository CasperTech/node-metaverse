"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Vector3_1 = require("../Vector3");
const Quaternion_1 = require("../Quaternion");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class AgentUpdateMessage {
    constructor() {
        this.name = 'AgentUpdate';
        this.messageFlags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyHigh;
        this.id = Message_1.Message.AgentUpdate;
    }
    getSize() {
        return 114;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['BodyRotation'].writeToBuffer(buf, pos);
        pos += 12;
        this.AgentData['HeadRotation'].writeToBuffer(buf, pos);
        pos += 12;
        buf.writeUInt8(this.AgentData['State'], pos++);
        this.AgentData['CameraCenter'].writeToBuffer(buf, pos, false);
        pos += 12;
        this.AgentData['CameraAtAxis'].writeToBuffer(buf, pos, false);
        pos += 12;
        this.AgentData['CameraLeftAxis'].writeToBuffer(buf, pos, false);
        pos += 12;
        this.AgentData['CameraUpAxis'].writeToBuffer(buf, pos, false);
        pos += 12;
        buf.writeFloatLE(this.AgentData['Far'], pos);
        pos += 4;
        buf.writeUInt32LE(this.AgentData['ControlFlags'], pos);
        pos += 4;
        buf.writeUInt8(this.AgentData['Flags'], pos++);
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            SessionID: UUID_1.UUID.zero(),
            BodyRotation: Quaternion_1.Quaternion.getIdentity(),
            HeadRotation: Quaternion_1.Quaternion.getIdentity(),
            State: 0,
            CameraCenter: Vector3_1.Vector3.getZero(),
            CameraAtAxis: Vector3_1.Vector3.getZero(),
            CameraLeftAxis: Vector3_1.Vector3.getZero(),
            CameraUpAxis: Vector3_1.Vector3.getZero(),
            Far: 0,
            ControlFlags: 0,
            Flags: 0
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['SessionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['BodyRotation'] = new Quaternion_1.Quaternion(buf, pos);
        pos += 12;
        newObjAgentData['HeadRotation'] = new Quaternion_1.Quaternion(buf, pos);
        pos += 12;
        newObjAgentData['State'] = buf.readUInt8(pos++);
        newObjAgentData['CameraCenter'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjAgentData['CameraAtAxis'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjAgentData['CameraLeftAxis'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjAgentData['CameraUpAxis'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjAgentData['Far'] = buf.readFloatLE(pos);
        pos += 4;
        newObjAgentData['ControlFlags'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjAgentData['Flags'] = buf.readUInt8(pos++);
        this.AgentData = newObjAgentData;
        return pos - startPos;
    }
}
exports.AgentUpdateMessage = AgentUpdateMessage;
//# sourceMappingURL=AgentUpdate.js.map