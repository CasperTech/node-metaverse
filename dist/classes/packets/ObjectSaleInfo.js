"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class ObjectSaleInfoPacket {
    constructor() {
        this.name = 'ObjectSaleInfo';
        this.flags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901866;
    }
    getSize() {
        return ((9) * this.ObjectData.length) + 33;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        const count = this.ObjectData.length;
        buf.writeUInt8(this.ObjectData.length, pos++);
        for (let i = 0; i < count; i++) {
            buf.writeUInt32LE(this.ObjectData[i]['LocalID'], pos);
            pos += 4;
            buf.writeUInt8(this.ObjectData[i]['SaleType'], pos++);
            buf.writeInt32LE(this.ObjectData[i]['SalePrice'], pos);
            pos += 4;
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
        const count = buf.readUInt8(pos++);
        this.ObjectData = [];
        for (let i = 0; i < count; i++) {
            const newObjObjectData = {
                LocalID: 0,
                SaleType: 0,
                SalePrice: 0
            };
            newObjObjectData['LocalID'] = buf.readUInt32LE(pos);
            pos += 4;
            newObjObjectData['SaleType'] = buf.readUInt8(pos++);
            newObjObjectData['SalePrice'] = buf.readInt32LE(pos);
            pos += 4;
            this.ObjectData.push(newObjObjectData);
        }
        return pos - startPos;
    }
}
exports.ObjectSaleInfoPacket = ObjectSaleInfoPacket;
//# sourceMappingURL=ObjectSaleInfo.js.map