"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class ParcelSelectObjectsPacket {
    constructor() {
        this.name = 'ParcelSelectObjects';
        this.flags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901962;
    }
    getSize() {
        return ((16) * this.ReturnIDs.length) + 41;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeInt32LE(this.ParcelData['LocalID'], pos);
        pos += 4;
        buf.writeUInt32LE(this.ParcelData['ReturnType'], pos);
        pos += 4;
        const count = this.ReturnIDs.length;
        buf.writeUInt8(this.ReturnIDs.length, pos++);
        for (let i = 0; i < count; i++) {
            this.ReturnIDs[i]['ReturnID'].writeToBuffer(buf, pos);
            pos += 16;
        }
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
        const newObjParcelData = {
            LocalID: 0,
            ReturnType: 0
        };
        newObjParcelData['LocalID'] = buf.readInt32LE(pos);
        pos += 4;
        newObjParcelData['ReturnType'] = buf.readUInt32LE(pos);
        pos += 4;
        this.ParcelData = newObjParcelData;
        const count = buf.readUInt8(pos++);
        this.ReturnIDs = [];
        for (let i = 0; i < count; i++) {
            const newObjReturnIDs = {
                ReturnID: UUID_1.UUID.zero()
            };
            newObjReturnIDs['ReturnID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            this.ReturnIDs.push(newObjReturnIDs);
        }
        return pos - startPos;
    }
}
exports.ParcelSelectObjectsPacket = ParcelSelectObjectsPacket;
//# sourceMappingURL=ParcelSelectObjects.js.map