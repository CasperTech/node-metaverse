"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Vector3_1 = require("../Vector3");
const MessageFlags_1 = require("../../enums/MessageFlags");
class SetStartLocationRequestPacket {
    constructor() {
        this.name = 'SetStartLocationRequest';
        this.flags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902084;
    }
    getSize() {
        return (this.StartLocationData['SimName'].length + 1) + 60;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.write(this.StartLocationData['SimName'], pos);
        pos += this.StartLocationData['SimName'].length;
        buf.writeUInt32LE(this.StartLocationData['LocationID'], pos);
        pos += 4;
        this.StartLocationData['LocationPos'].writeToBuffer(buf, pos, false);
        pos += 12;
        this.StartLocationData['LocationLookAt'].writeToBuffer(buf, pos, false);
        pos += 12;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            SessionID: UUID_1.UUID.zero()
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['SessionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.AgentData = newObjAgentData;
        const newObjStartLocationData = {
            SimName: '',
            LocationID: 0,
            LocationPos: Vector3_1.Vector3.getZero(),
            LocationLookAt: Vector3_1.Vector3.getZero()
        };
        newObjStartLocationData['SimName'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjStartLocationData['LocationID'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjStartLocationData['LocationPos'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjStartLocationData['LocationLookAt'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        this.StartLocationData = newObjStartLocationData;
        return pos - startPos;
    }
}
exports.SetStartLocationRequestPacket = SetStartLocationRequestPacket;
//# sourceMappingURL=SetStartLocationRequest.js.map