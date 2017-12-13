"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class AgentAnimationPacket {
    constructor() {
        this.name = 'AgentAnimation';
        this.flags = MessageFlags_1.MessageFlags.FrequencyHigh;
        this.id = 5;
    }
    getSize() {
        return ((17) * this.AnimationList.length) + ((this.calculateVarVarSize(this.PhysicalAvatarEventList, 'TypeData', 1)) * this.PhysicalAvatarEventList.length) + 34;
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
        let count = this.AnimationList.length;
        buf.writeUInt8(this.AnimationList.length, pos++);
        for (let i = 0; i < count; i++) {
            this.AnimationList[i]['AnimID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeUInt8((this.AnimationList[i]['StartAnim']) ? 1 : 0, pos++);
        }
        count = this.PhysicalAvatarEventList.length;
        buf.writeUInt8(this.PhysicalAvatarEventList.length, pos++);
        for (let i = 0; i < count; i++) {
            buf.write(this.PhysicalAvatarEventList[i]['TypeData'], pos);
            pos += this.PhysicalAvatarEventList[i]['TypeData'].length;
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
        let count = buf.readUInt8(pos++);
        this.AnimationList = [];
        for (let i = 0; i < count; i++) {
            const newObjAnimationList = {
                AnimID: UUID_1.UUID.zero(),
                StartAnim: false
            };
            newObjAnimationList['AnimID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjAnimationList['StartAnim'] = (buf.readUInt8(pos++) === 1);
            this.AnimationList.push(newObjAnimationList);
        }
        count = buf.readUInt8(pos++);
        this.PhysicalAvatarEventList = [];
        for (let i = 0; i < count; i++) {
            const newObjPhysicalAvatarEventList = {
                TypeData: ''
            };
            newObjPhysicalAvatarEventList['TypeData'] = buf.toString('utf8', pos, length);
            pos += length;
            this.PhysicalAvatarEventList.push(newObjPhysicalAvatarEventList);
        }
        return pos - startPos;
    }
}
exports.AgentAnimationPacket = AgentAnimationPacket;
//# sourceMappingURL=AgentAnimation.js.map