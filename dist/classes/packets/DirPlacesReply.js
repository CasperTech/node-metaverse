"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class DirPlacesReplyPacket {
    constructor() {
        this.name = 'DirPlacesReply';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901795;
    }
    getSize() {
        return ((16) * this.QueryData.length) + ((this.calculateVarVarSize(this.QueryReplies, 'Name', 1) + 22) * this.QueryReplies.length) + ((4) * this.StatusData.length) + 19;
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
        let count = this.QueryData.length;
        buf.writeUInt8(this.QueryData.length, pos++);
        for (let i = 0; i < count; i++) {
            this.QueryData[i]['QueryID'].writeToBuffer(buf, pos);
            pos += 16;
        }
        count = this.QueryReplies.length;
        buf.writeUInt8(this.QueryReplies.length, pos++);
        for (let i = 0; i < count; i++) {
            this.QueryReplies[i]['ParcelID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.write(this.QueryReplies[i]['Name'], pos);
            pos += this.QueryReplies[i]['Name'].length;
            buf.writeUInt8((this.QueryReplies[i]['ForSale']) ? 1 : 0, pos++);
            buf.writeUInt8((this.QueryReplies[i]['Auction']) ? 1 : 0, pos++);
            buf.writeFloatLE(this.QueryReplies[i]['Dwell'], pos);
            pos += 4;
        }
        count = this.StatusData.length;
        buf.writeUInt8(this.StatusData.length, pos++);
        for (let i = 0; i < count; i++) {
            buf.writeUInt32LE(this.StatusData[i]['Status'], pos);
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
        let count = buf.readUInt8(pos++);
        this.QueryData = [];
        for (let i = 0; i < count; i++) {
            const newObjQueryData = {
                QueryID: UUID_1.UUID.zero()
            };
            newObjQueryData['QueryID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            this.QueryData.push(newObjQueryData);
        }
        count = buf.readUInt8(pos++);
        this.QueryReplies = [];
        for (let i = 0; i < count; i++) {
            const newObjQueryReplies = {
                ParcelID: UUID_1.UUID.zero(),
                Name: '',
                ForSale: false,
                Auction: false,
                Dwell: 0
            };
            newObjQueryReplies['ParcelID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjQueryReplies['Name'] = buf.toString('utf8', pos, length);
            pos += length;
            newObjQueryReplies['ForSale'] = (buf.readUInt8(pos++) === 1);
            newObjQueryReplies['Auction'] = (buf.readUInt8(pos++) === 1);
            newObjQueryReplies['Dwell'] = buf.readFloatLE(pos);
            pos += 4;
            this.QueryReplies.push(newObjQueryReplies);
        }
        count = buf.readUInt8(pos++);
        this.StatusData = [];
        for (let i = 0; i < count; i++) {
            const newObjStatusData = {
                Status: 0
            };
            newObjStatusData['Status'] = buf.readUInt32LE(pos);
            pos += 4;
            this.StatusData.push(newObjStatusData);
        }
        return pos - startPos;
    }
}
exports.DirPlacesReplyPacket = DirPlacesReplyPacket;
//# sourceMappingURL=DirPlacesReply.js.map