"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class ViewerEffectMessage {
    constructor() {
        this.name = 'ViewerEffect';
        this.messageFlags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyMedium;
        this.id = Message_1.Message.ViewerEffect;
    }
    getSize() {
        return this.calculateVarVarSize(this.Effect, 'TypeData', 1) + ((41) * this.Effect.length) + 33;
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
        const count = this.Effect.length;
        buf.writeUInt8(this.Effect.length, pos++);
        for (let i = 0; i < count; i++) {
            this.Effect[i]['ID'].writeToBuffer(buf, pos);
            pos += 16;
            this.Effect[i]['AgentID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeUInt8(this.Effect[i]['Type'], pos++);
            buf.writeFloatLE(this.Effect[i]['Duration'], pos);
            pos += 4;
            this.Effect[i]['Color'].copy(buf, pos);
            pos += 4;
            buf.writeUInt8(this.Effect[i]['TypeData'].length, pos++);
            this.Effect[i]['TypeData'].copy(buf, pos);
            pos += this.Effect[i]['TypeData'].length;
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
        this.Effect = [];
        for (let i = 0; i < count; i++) {
            const newObjEffect = {
                ID: UUID_1.UUID.zero(),
                AgentID: UUID_1.UUID.zero(),
                Type: 0,
                Duration: 0,
                Color: Buffer.allocUnsafe(0),
                TypeData: Buffer.allocUnsafe(0)
            };
            newObjEffect['ID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjEffect['AgentID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjEffect['Type'] = buf.readUInt8(pos++);
            newObjEffect['Duration'] = buf.readFloatLE(pos);
            pos += 4;
            newObjEffect['Color'] = buf.slice(pos, pos + 4);
            pos += 4;
            varLength = buf.readUInt8(pos++);
            newObjEffect['TypeData'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            this.Effect.push(newObjEffect);
        }
        return pos - startPos;
    }
}
exports.ViewerEffectMessage = ViewerEffectMessage;
//# sourceMappingURL=ViewerEffect.js.map