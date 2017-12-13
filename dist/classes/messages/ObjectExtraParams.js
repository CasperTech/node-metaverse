"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class ObjectExtraParamsMessage {
    constructor() {
        this.name = 'ObjectExtraParams';
        this.messageFlags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.ObjectExtraParams;
    }
    getSize() {
        return ((this.calculateVarVarSize(this.ObjectData, 'ParamData', 1) + 11) * this.ObjectData.length) + 33;
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
            buf.writeUInt16LE(this.ObjectData[i]['ParamType'], pos);
            pos += 2;
            buf.writeUInt8((this.ObjectData[i]['ParamInUse']) ? 1 : 0, pos++);
            buf.writeUInt32LE(this.ObjectData[i]['ParamSize'], pos);
            pos += 4;
            buf.writeUInt8(this.ObjectData[i]['ParamData'].length, pos++);
            this.ObjectData[i]['ParamData'].copy(buf, pos);
            pos += this.ObjectData[i]['ParamData'].length;
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
                ParamType: 0,
                ParamInUse: false,
                ParamSize: 0,
                ParamData: Buffer.allocUnsafe(0)
            };
            newObjObjectData['ObjectLocalID'] = buf.readUInt32LE(pos);
            pos += 4;
            newObjObjectData['ParamType'] = buf.readUInt16LE(pos);
            pos += 2;
            newObjObjectData['ParamInUse'] = (buf.readUInt8(pos++) === 1);
            newObjObjectData['ParamSize'] = buf.readUInt32LE(pos);
            pos += 4;
            varLength = buf.readUInt8(pos++);
            newObjObjectData['ParamData'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            this.ObjectData.push(newObjObjectData);
        }
        return pos - startPos;
    }
}
exports.ObjectExtraParamsMessage = ObjectExtraParamsMessage;
//# sourceMappingURL=ObjectExtraParams.js.map