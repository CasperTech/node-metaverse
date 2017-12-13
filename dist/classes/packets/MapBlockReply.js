"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class MapBlockReplyPacket {
    constructor() {
        this.name = 'MapBlockReply';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902169;
    }
    getSize() {
        return ((this.calculateVarVarSize(this.Data, 'Name', 1) + 27) * this.Data.length) + 21;
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
        buf.writeUInt32LE(this.AgentData['Flags'], pos);
        pos += 4;
        const count = this.Data.length;
        buf.writeUInt8(this.Data.length, pos++);
        for (let i = 0; i < count; i++) {
            buf.writeUInt16LE(this.Data[i]['X'], pos);
            pos += 2;
            buf.writeUInt16LE(this.Data[i]['Y'], pos);
            pos += 2;
            buf.write(this.Data[i]['Name'], pos);
            pos += this.Data[i]['Name'].length;
            buf.writeUInt8(this.Data[i]['Access'], pos++);
            buf.writeUInt32LE(this.Data[i]['RegionFlags'], pos);
            pos += 4;
            buf.writeUInt8(this.Data[i]['WaterHeight'], pos++);
            buf.writeUInt8(this.Data[i]['Agents'], pos++);
            this.Data[i]['MapImageID'].writeToBuffer(buf, pos);
            pos += 16;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            Flags: 0
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['Flags'] = buf.readUInt32LE(pos);
        pos += 4;
        this.AgentData = newObjAgentData;
        const count = buf.readUInt8(pos++);
        this.Data = [];
        for (let i = 0; i < count; i++) {
            const newObjData = {
                X: 0,
                Y: 0,
                Name: '',
                Access: 0,
                RegionFlags: 0,
                WaterHeight: 0,
                Agents: 0,
                MapImageID: UUID_1.UUID.zero()
            };
            newObjData['X'] = buf.readUInt16LE(pos);
            pos += 2;
            newObjData['Y'] = buf.readUInt16LE(pos);
            pos += 2;
            newObjData['Name'] = buf.toString('utf8', pos, length);
            pos += length;
            newObjData['Access'] = buf.readUInt8(pos++);
            newObjData['RegionFlags'] = buf.readUInt32LE(pos);
            pos += 4;
            newObjData['WaterHeight'] = buf.readUInt8(pos++);
            newObjData['Agents'] = buf.readUInt8(pos++);
            newObjData['MapImageID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            this.Data.push(newObjData);
        }
        return pos - startPos;
    }
}
exports.MapBlockReplyPacket = MapBlockReplyPacket;
//# sourceMappingURL=MapBlockReply.js.map