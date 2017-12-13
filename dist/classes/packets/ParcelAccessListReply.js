"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class ParcelAccessListReplyPacket {
    constructor() {
        this.name = 'ParcelAccessListReply';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901976;
    }
    getSize() {
        return ((24) * this.List.length) + 29;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.Data['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeInt32LE(this.Data['SequenceID'], pos);
        pos += 4;
        buf.writeUInt32LE(this.Data['Flags'], pos);
        pos += 4;
        buf.writeInt32LE(this.Data['LocalID'], pos);
        pos += 4;
        const count = this.List.length;
        buf.writeUInt8(this.List.length, pos++);
        for (let i = 0; i < count; i++) {
            this.List[i]['ID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeInt32LE(this.List[i]['Time'], pos);
            pos += 4;
            buf.writeUInt32LE(this.List[i]['Flags'], pos);
            pos += 4;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjData = {
            AgentID: UUID_1.UUID.zero(),
            SequenceID: 0,
            Flags: 0,
            LocalID: 0
        };
        newObjData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjData['SequenceID'] = buf.readInt32LE(pos);
        pos += 4;
        newObjData['Flags'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjData['LocalID'] = buf.readInt32LE(pos);
        pos += 4;
        this.Data = newObjData;
        const count = buf.readUInt8(pos++);
        this.List = [];
        for (let i = 0; i < count; i++) {
            const newObjList = {
                ID: UUID_1.UUID.zero(),
                Time: 0,
                Flags: 0
            };
            newObjList['ID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjList['Time'] = buf.readInt32LE(pos);
            pos += 4;
            newObjList['Flags'] = buf.readUInt32LE(pos);
            pos += 4;
            this.List.push(newObjList);
        }
        return pos - startPos;
    }
}
exports.ParcelAccessListReplyPacket = ParcelAccessListReplyPacket;
//# sourceMappingURL=ParcelAccessListReply.js.map