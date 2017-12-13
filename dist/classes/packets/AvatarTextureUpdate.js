"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class AvatarTextureUpdatePacket {
    constructor() {
        this.name = 'AvatarTextureUpdate';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901764;
    }
    getSize() {
        return ((this.calculateVarVarSize(this.WearableData, 'HostName', 1) + 17) * this.WearableData.length) + ((16) * this.TextureData.length) + 19;
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
        buf.writeUInt8((this.AgentData['TexturesChanged']) ? 1 : 0, pos++);
        let count = this.WearableData.length;
        buf.writeUInt8(this.WearableData.length, pos++);
        for (let i = 0; i < count; i++) {
            this.WearableData[i]['CacheID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeUInt8(this.WearableData[i]['TextureIndex'], pos++);
            buf.write(this.WearableData[i]['HostName'], pos);
            pos += this.WearableData[i]['HostName'].length;
        }
        count = this.TextureData.length;
        buf.writeUInt8(this.TextureData.length, pos++);
        for (let i = 0; i < count; i++) {
            this.TextureData[i]['TextureID'].writeToBuffer(buf, pos);
            pos += 16;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            TexturesChanged: false
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['TexturesChanged'] = (buf.readUInt8(pos++) === 1);
        this.AgentData = newObjAgentData;
        let count = buf.readUInt8(pos++);
        this.WearableData = [];
        for (let i = 0; i < count; i++) {
            const newObjWearableData = {
                CacheID: UUID_1.UUID.zero(),
                TextureIndex: 0,
                HostName: ''
            };
            newObjWearableData['CacheID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjWearableData['TextureIndex'] = buf.readUInt8(pos++);
            newObjWearableData['HostName'] = buf.toString('utf8', pos, length);
            pos += length;
            this.WearableData.push(newObjWearableData);
        }
        count = buf.readUInt8(pos++);
        this.TextureData = [];
        for (let i = 0; i < count; i++) {
            const newObjTextureData = {
                TextureID: UUID_1.UUID.zero()
            };
            newObjTextureData['TextureID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            this.TextureData.push(newObjTextureData);
        }
        return pos - startPos;
    }
}
exports.AvatarTextureUpdatePacket = AvatarTextureUpdatePacket;
//# sourceMappingURL=AvatarTextureUpdate.js.map