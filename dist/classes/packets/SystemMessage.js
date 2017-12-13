"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class SystemMessagePacket {
    constructor() {
        this.name = 'SystemMessage';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902164;
    }
    getSize() {
        return (this.MethodData['Method'].length + 1) + ((this.calculateVarVarSize(this.ParamList, 'Parameter', 1)) * this.ParamList.length) + 49;
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
        buf.write(this.MethodData['Method'], pos);
        pos += this.MethodData['Method'].length;
        this.MethodData['Invoice'].writeToBuffer(buf, pos);
        pos += 16;
        this.MethodData['Digest'].copy(buf, pos);
        pos += 32;
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
        const newObjMethodData = {
            Method: '',
            Invoice: UUID_1.UUID.zero(),
            Digest: Buffer.allocUnsafe(0)
        };
        newObjMethodData['Method'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjMethodData['Invoice'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjMethodData['Digest'] = buf.slice(pos, pos + 32);
        pos += 32;
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
exports.SystemMessagePacket = SystemMessagePacket;
//# sourceMappingURL=SystemMessage.js.map