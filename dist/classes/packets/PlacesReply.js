"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class PlacesReplyPacket {
    constructor() {
        this.name = 'PlacesReply';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.Deprecated | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901790;
    }
    getSize() {
        return ((this.calculateVarVarSize(this.QueryData, 'Name', 1) + this.calculateVarVarSize(this.QueryData, 'Desc', 1) + this.calculateVarVarSize(this.QueryData, 'SimName', 1) + 61) * this.QueryData.length) + 49;
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
            buf.write(this.QueryData[i]['Name'], pos);
            pos += this.QueryData[i]['Name'].length;
            buf.write(this.QueryData[i]['Desc'], pos);
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
            buf.write(this.QueryData[i]['SimName'], pos);
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
                Name: '',
                Desc: '',
                ActualArea: 0,
                BillableArea: 0,
                Flags: 0,
                GlobalX: 0,
                GlobalY: 0,
                GlobalZ: 0,
                SimName: '',
                SnapshotID: UUID_1.UUID.zero(),
                Dwell: 0,
                Price: 0
            };
            newObjQueryData['OwnerID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjQueryData['Name'] = buf.toString('utf8', pos, length);
            pos += length;
            newObjQueryData['Desc'] = buf.toString('utf8', pos, length);
            pos += length;
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
            newObjQueryData['SimName'] = buf.toString('utf8', pos, length);
            pos += length;
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
exports.PlacesReplyPacket = PlacesReplyPacket;
//# sourceMappingURL=PlacesReply.js.map