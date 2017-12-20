"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class MultipleObjectUpdateMessage {
    constructor() {
        this.name = 'MultipleObjectUpdate';
        this.messageFlags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyMedium;
        this.id = Message_1.Message.MultipleObjectUpdate;
    }
    getSize() {
        return this.calculateVarVarSize(this.ObjectData, 'Data', 1) + ((5) * this.ObjectData.length) + 33;
    }
    calculateVarVarSize(block, paramName, extraPerVar) {
        let size = 0;
        block.forEach((bl) => {
            size += bl[paramName].length + extraPerVar;
        });
        return size;
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
            buf.writeUInt32LE(this.ObjectData[i]['ObjectLocalID'], pos);
            pos += 4;
            buf.writeUInt8(this.ObjectData[i]['Type'], pos++);
            buf.writeUInt8(this.ObjectData[i]['Data'].length, pos++);
            this.ObjectData[i]['Data'].copy(buf, pos);
            pos += this.ObjectData[i]['Data'].length;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
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
                ObjectLocalID: 0,
                Type: 0,
                Data: Buffer.allocUnsafe(0)
            };
            newObjObjectData['ObjectLocalID'] = buf.readUInt32LE(pos);
            pos += 4;
            newObjObjectData['Type'] = buf.readUInt8(pos++);
            varLength = buf.readUInt8(pos++);
            newObjObjectData['Data'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            this.ObjectData.push(newObjObjectData);
        }
        return pos - startPos;
    }
}
exports.MultipleObjectUpdateMessage = MultipleObjectUpdateMessage;
//# sourceMappingURL=MultipleObjectUpdate.js.map