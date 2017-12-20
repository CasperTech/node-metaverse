"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class DirPlacesReplyMessage {
    constructor() {
        this.name = 'DirPlacesReply';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.DirPlacesReply;
    }
    getSize() {
        return ((16) * this.QueryData.length) + this.calculateVarVarSize(this.QueryReplies, 'Name', 1) + ((22) * this.QueryReplies.length) + ((4) * this.StatusData.length) + 19;
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
            buf.writeUInt8(this.QueryReplies[i]['Name'].length, pos++);
            this.QueryReplies[i]['Name'].copy(buf, pos);
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
        let varLength = 0;
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
                Name: Buffer.allocUnsafe(0),
                ForSale: false,
                Auction: false,
                Dwell: 0
            };
            newObjQueryReplies['ParcelID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            varLength = buf.readUInt8(pos++);
            newObjQueryReplies['Name'] = buf.slice(pos, pos + varLength);
            pos += varLength;
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
exports.DirPlacesReplyMessage = DirPlacesReplyMessage;
//# sourceMappingURL=DirPlacesReply.js.map