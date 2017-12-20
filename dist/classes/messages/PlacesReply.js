"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class PlacesReplyMessage {
    constructor() {
        this.name = 'PlacesReply';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.Deprecated | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.PlacesReply;
    }
    getSize() {
        return this.calculateVarVarSize(this.QueryData, 'Name', 1) + this.calculateVarVarSize(this.QueryData, 'Desc', 1) + this.calculateVarVarSize(this.QueryData, 'SimName', 1) + ((61) * this.QueryData.length) + 49;
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
        this.AgentData['QueryID'].writeToBuffer(buf, pos);
        pos += 16;
        this.TransactionData['TransactionID'].writeToBuffer(buf, pos);
        pos += 16;
        const count = this.QueryData.length;
        buf.writeUInt8(this.QueryData.length, pos++);
        for (let i = 0; i < count; i++) {
            this.QueryData[i]['OwnerID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeUInt8(this.QueryData[i]['Name'].length, pos++);
            this.QueryData[i]['Name'].copy(buf, pos);
            pos += this.QueryData[i]['Name'].length;
            buf.writeUInt8(this.QueryData[i]['Desc'].length, pos++);
            this.QueryData[i]['Desc'].copy(buf, pos);
            pos += this.QueryData[i]['Desc'].length;
            buf.writeInt32LE(this.QueryData[i]['ActualArea'], pos);
            pos += 4;
            buf.writeInt32LE(this.QueryData[i]['BillableArea'], pos);
            pos += 4;
            buf.writeUInt8(this.QueryData[i]['Flags'], pos++);
            buf.writeFloatLE(this.QueryData[i]['GlobalX'], pos);
            pos += 4;
            buf.writeFloatLE(this.QueryData[i]['GlobalY'], pos);
            pos += 4;
            buf.writeFloatLE(this.QueryData[i]['GlobalZ'], pos);
            pos += 4;
            buf.writeUInt8(this.QueryData[i]['SimName'].length, pos++);
            this.QueryData[i]['SimName'].copy(buf, pos);
            pos += this.QueryData[i]['SimName'].length;
            this.QueryData[i]['SnapshotID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeFloatLE(this.QueryData[i]['Dwell'], pos);
            pos += 4;
            buf.writeInt32LE(this.QueryData[i]['Price'], pos);
            pos += 4;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            QueryID: UUID_1.UUID.zero()
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['QueryID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.AgentData = newObjAgentData;
        const newObjTransactionData = {
            TransactionID: UUID_1.UUID.zero()
        };
        newObjTransactionData['TransactionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.TransactionData = newObjTransactionData;
        const count = buf.readUInt8(pos++);
        this.QueryData = [];
        for (let i = 0; i < count; i++) {
            const newObjQueryData = {
                OwnerID: UUID_1.UUID.zero(),
                Name: Buffer.allocUnsafe(0),
                Desc: Buffer.allocUnsafe(0),
                ActualArea: 0,
                BillableArea: 0,
                Flags: 0,
                GlobalX: 0,
                GlobalY: 0,
                GlobalZ: 0,
                SimName: Buffer.allocUnsafe(0),
                SnapshotID: UUID_1.UUID.zero(),
                Dwell: 0,
                Price: 0
            };
            newObjQueryData['OwnerID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            varLength = buf.readUInt8(pos++);
            newObjQueryData['Name'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            varLength = buf.readUInt8(pos++);
            newObjQueryData['Desc'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            newObjQueryData['ActualArea'] = buf.readInt32LE(pos);
            pos += 4;
            newObjQueryData['BillableArea'] = buf.readInt32LE(pos);
            pos += 4;
            newObjQueryData['Flags'] = buf.readUInt8(pos++);
            newObjQueryData['GlobalX'] = buf.readFloatLE(pos);
            pos += 4;
            newObjQueryData['GlobalY'] = buf.readFloatLE(pos);
            pos += 4;
            newObjQueryData['GlobalZ'] = buf.readFloatLE(pos);
            pos += 4;
            varLength = buf.readUInt8(pos++);
            newObjQueryData['SimName'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            newObjQueryData['SnapshotID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjQueryData['Dwell'] = buf.readFloatLE(pos);
            pos += 4;
            newObjQueryData['Price'] = buf.readInt32LE(pos);
            pos += 4;
            this.QueryData.push(newObjQueryData);
        }
        return pos - startPos;
    }
}
exports.PlacesReplyMessage = PlacesReplyMessage;
//# sourceMappingURL=PlacesReply.js.map