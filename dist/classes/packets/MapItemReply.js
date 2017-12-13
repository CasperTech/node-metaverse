"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class MapItemReplyPacket {
    constructor() {
        this.name = 'MapItemReply';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902171;
    }
    getSize() {
        return ((this.calculateVarVarSize(this.Data, 'Name', 1) + 32) * this.Data.length) + 25;
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
        buf.writeUInt32LE(this.RequestData['ItemType'], pos);
        pos += 4;
        const count = this.Data.length;
        buf.writeUInt8(this.Data.length, pos++);
        for (let i = 0; i < count; i++) {
            buf.writeUInt32LE(this.Data[i]['X'], pos);
            pos += 4;
            buf.writeUInt32LE(this.Data[i]['Y'], pos);
            pos += 4;
            this.Data[i]['ID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeInt32LE(this.Data[i]['Extra'], pos);
            pos += 4;
            buf.writeInt32LE(this.Data[i]['Extra2'], pos);
            pos += 4;
            buf.write(this.Data[i]['Name'], pos);
            pos += this.Data[i]['Name'].length;
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
        const newObjRequestData = {
            ItemType: 0
        };
        newObjRequestData['ItemType'] = buf.readUInt32LE(pos);
        pos += 4;
        this.RequestData = newObjRequestData;
        const count = buf.readUInt8(pos++);
        this.Data = [];
        for (let i = 0; i < count; i++) {
            const newObjData = {
                X: 0,
                Y: 0,
                ID: UUID_1.UUID.zero(),
                Extra: 0,
                Extra2: 0,
                Name: ''
            };
            newObjData['X'] = buf.readUInt32LE(pos);
            pos += 4;
            newObjData['Y'] = buf.readUInt32LE(pos);
            pos += 4;
            newObjData['ID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjData['Extra'] = buf.readInt32LE(pos);
            pos += 4;
            newObjData['Extra2'] = buf.readInt32LE(pos);
            pos += 4;
            newObjData['Name'] = buf.toString('utf8', pos, length);
            pos += length;
            this.Data.push(newObjData);
        }
        return pos - startPos;
    }
}
exports.MapItemReplyPacket = MapItemReplyPacket;
//# sourceMappingURL=MapItemReply.js.map