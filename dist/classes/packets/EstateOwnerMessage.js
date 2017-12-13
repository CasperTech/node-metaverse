"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class EstateOwnerMessagePacket {
    constructor() {
        this.name = 'EstateOwnerMessage';
        this.flags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902020;
    }
    getSize() {
        return (this.MethodData['Method'].length + 1) + ((this.calculateVarVarSize(this.ParamList, 'Parameter', 1)) * this.ParamList.length) + 65;
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
        this.AgentData['TransactionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.write(this.MethodData['Method'], pos);
        pos += this.MethodData['Method'].length;
        this.MethodData['Invoice'].writeToBuffer(buf, pos);
        pos += 16;
        const count = this.ParamList.length;
        buf.writeUInt8(this.ParamList.length, pos++);
        for (let i = 0; i < count; i++) {
            buf.write(this.ParamList[i]['Parameter'], pos);
            pos += this.ParamList[i]['Parameter'].length;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            SessionID: UUID_1.UUID.zero(),
            TransactionID: UUID_1.UUID.zero()
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['SessionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['TransactionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.AgentData = newObjAgentData;
        const newObjMethodData = {
            Method: '',
            Invoice: UUID_1.UUID.zero()
        };
        newObjMethodData['Method'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjMethodData['Invoice'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.MethodData = newObjMethodData;
        const count = buf.readUInt8(pos++);
        this.ParamList = [];
        for (let i = 0; i < count; i++) {
            const newObjParamList = {
                Parameter: ''
            };
            newObjParamList['Parameter'] = buf.toString('utf8', pos, length);
            pos += length;
            this.ParamList.push(newObjParamList);
        }
        return pos - startPos;
    }
}
exports.EstateOwnerMessagePacket = EstateOwnerMessagePacket;
//# sourceMappingURL=EstateOwnerMessage.js.map