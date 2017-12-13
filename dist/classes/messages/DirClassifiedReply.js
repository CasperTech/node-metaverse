"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class DirClassifiedReplyMessage {
    constructor() {
        this.name = 'DirClassifiedReply';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.DirClassifiedReply;
    }
    getSize() {
        return ((this.calculateVarVarSize(this.QueryReplies, 'Name', 1) + 29) * this.QueryReplies.length) + ((4) * this.StatusData.length) + 34;
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
        let count = this.QueryReplies.length;
        buf.writeUInt8(this.QueryReplies.length, pos++);
        for (let i = 0; i < count; i++) {
            this.QueryReplies[i]['ClassifiedID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeUInt8(this.QueryReplies[i]['Name'].length, pos++);
            this.QueryReplies[i]['Name'].copy(buf, pos);
            pos += this.QueryReplies[i]['Name'].length;
            buf.writeUInt8(this.QueryReplies[i]['ClassifiedFlags'], pos++);
            buf.writeUInt32LE(this.QueryReplies[i]['CreationDate'], pos);
            pos += 4;
            buf.writeUInt32LE(this.QueryReplies[i]['ExpirationDate'], pos);
            pos += 4;
            buf.writeInt32LE(this.QueryReplies[i]['PriceForListing'], pos);
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
        const newObjQueryData = {
            QueryID: UUID_1.UUID.zero()
        };
        newObjQueryData['QueryID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.QueryData = newObjQueryData;
        let count = buf.readUInt8(pos++);
        this.QueryReplies = [];
        for (let i = 0; i < count; i++) {
            const newObjQueryReplies = {
                ClassifiedID: UUID_1.UUID.zero(),
                Name: Buffer.allocUnsafe(0),
                ClassifiedFlags: 0,
                CreationDate: 0,
                ExpirationDate: 0,
                PriceForListing: 0
            };
            newObjQueryReplies['ClassifiedID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            varLength = buf.readUInt8(pos++);
            newObjQueryReplies['Name'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            newObjQueryReplies['ClassifiedFlags'] = buf.readUInt8(pos++);
            newObjQueryReplies['CreationDate'] = buf.readUInt32LE(pos);
            pos += 4;
            newObjQueryReplies['ExpirationDate'] = buf.readUInt32LE(pos);
            pos += 4;
            newObjQueryReplies['PriceForListing'] = buf.readInt32LE(pos);
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
exports.DirClassifiedReplyMessage = DirClassifiedReplyMessage;
//# sourceMappingURL=DirClassifiedReply.js.map