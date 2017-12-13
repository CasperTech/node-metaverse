"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class DirLandReplyPacket {
    constructor() {
        this.name = 'DirLandReply';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.Deprecated | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901810;
    }
    getSize() {
        return ((this.calculateVarVarSize(this.QueryReplies, 'Name', 1) + 26) * this.QueryReplies.length) + 33;
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
        this.QueryData['QueryID'].writeToBuffer(buf, pos);
        pos += 16;
        const count = this.QueryReplies.length;
        buf.writeUInt8(this.QueryReplies.length, pos++);
        for (let i = 0; i < count; i++) {
            this.QueryReplies[i]['ParcelID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.write(this.QueryReplies[i]['Name'], pos);
            pos += this.QueryReplies[i]['Name'].length;
            buf.writeUInt8((this.QueryReplies[i]['Auction']) ? 1 : 0, pos++);
            buf.writeUInt8((this.QueryReplies[i]['ForSale']) ? 1 : 0, pos++);
            buf.writeInt32LE(this.QueryReplies[i]['SalePrice'], pos);
            pos += 4;
            buf.writeInt32LE(this.QueryReplies[i]['ActualArea'], pos);
            pos += 4;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero()
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.AgentData = newObjAgentData;
        const newObjQueryData = {
            QueryID: UUID_1.UUID.zero()
        };
        newObjQueryData['QueryID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.QueryData = newObjQueryData;
        const count = buf.readUInt8(pos++);
        this.QueryReplies = [];
        for (let i = 0; i < count; i++) {
            const newObjQueryReplies = {
                ParcelID: UUID_1.UUID.zero(),
                Name: '',
                Auction: false,
                ForSale: false,
                SalePrice: 0,
                ActualArea: 0
            };
            newObjQueryReplies['ParcelID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjQueryReplies['Name'] = buf.toString('utf8', pos, length);
            pos += length;
            newObjQueryReplies['Auction'] = (buf.readUInt8(pos++) === 1);
            newObjQueryReplies['ForSale'] = (buf.readUInt8(pos++) === 1);
            newObjQueryReplies['SalePrice'] = buf.readInt32LE(pos);
            pos += 4;
            newObjQueryReplies['ActualArea'] = buf.readInt32LE(pos);
            pos += 4;
            this.QueryReplies.push(newObjQueryReplies);
        }
        return pos - startPos;
    }
}
exports.DirLandReplyPacket = DirLandReplyPacket;
//# sourceMappingURL=DirLandReply.js.map