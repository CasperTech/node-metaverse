"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class AvatarAnimationPacket {
    constructor() {
        this.name = 'AvatarAnimation';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyHigh;
        this.id = 20;
    }
    getSize() {
        return ((20) * this.AnimationList.length) + ((16) * this.AnimationSourceList.length) + ((this.calculateVarVarSize(this.PhysicalAvatarEventList, 'TypeData', 1)) * this.PhysicalAvatarEventList.length) + 19;
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
        this.Sender['ID'].writeToBuffer(buf, pos);
        pos += 16;
        let count = this.AnimationList.length;
        buf.writeUInt8(this.AnimationList.length, pos++);
        for (let i = 0; i < count; i++) {
            this.AnimationList[i]['AnimID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeInt32LE(this.AnimationList[i]['AnimSequenceID'], pos);
            pos += 4;
        }
        count = this.AnimationSourceList.length;
        buf.writeUInt8(this.AnimationSourceList.length, pos++);
        for (let i = 0; i < count; i++) {
            this.AnimationSourceList[i]['ObjectID'].writeToBuffer(buf, pos);
            pos += 16;
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
        const newObjSender = {
            ID: UUID_1.UUID.zero()
        };
        newObjSender['ID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.Sender = newObjSender;
        let count = buf.readUInt8(pos++);
        this.AnimationList = [];
        for (let i = 0; i < count; i++) {
            const newObjAnimationList = {
                AnimID: UUID_1.UUID.zero(),
                AnimSequenceID: 0
            };
            newObjAnimationList['AnimID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjAnimationList['AnimSequenceID'] = buf.readInt32LE(pos);
            pos += 4;
            this.AnimationList.push(newObjAnimationList);
        }
        count = buf.readUInt8(pos++);
        this.AnimationSourceList = [];
        for (let i = 0; i < count; i++) {
            const newObjAnimationSourceList = {
                ObjectID: UUID_1.UUID.zero()
            };
            newObjAnimationSourceList['ObjectID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            this.AnimationSourceList.push(newObjAnimationSourceList);
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
exports.AvatarAnimationPacket = AvatarAnimationPacket;
//# sourceMappingURL=AvatarAnimation.js.map