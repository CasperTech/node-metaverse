"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Long = require("long");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class LogParcelChangesMessage {
    constructor() {
        this.name = 'LogParcelChanges';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.LogParcelChanges;
    }
    getSize() {
        return ((54) * this.ParcelData.length) + 25;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeInt32LE(this.RegionData['RegionHandle'].low, pos);
        pos += 4;
        buf.writeInt32LE(this.RegionData['RegionHandle'].high, pos);
        pos += 4;
        const count = this.ParcelData.length;
        buf.writeUInt8(this.ParcelData.length, pos++);
        for (let i = 0; i < count; i++) {
            this.ParcelData[i]['ParcelID'].writeToBuffer(buf, pos);
            pos += 16;
            this.ParcelData[i]['OwnerID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeUInt8((this.ParcelData[i]['IsOwnerGroup']) ? 1 : 0, pos++);
            buf.writeInt32LE(this.ParcelData[i]['ActualArea'], pos);
            pos += 4;
            buf.writeInt8(this.ParcelData[i]['Action'], pos++);
            this.ParcelData[i]['TransactionID'].writeToBuffer(buf, pos);
            pos += 16;
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
        const newObjRegionData = {
            RegionHandle: Long.ZERO
        };
        newObjRegionData['RegionHandle'] = new Long(buf.readInt32LE(pos), buf.readInt32LE(pos + 4));
        pos += 8;
        this.RegionData = newObjRegionData;
        const count = buf.readUInt8(pos++);
        this.ParcelData = [];
        for (let i = 0; i < count; i++) {
            const newObjParcelData = {
                ParcelID: UUID_1.UUID.zero(),
                OwnerID: UUID_1.UUID.zero(),
                IsOwnerGroup: false,
                ActualArea: 0,
                Action: 0,
                TransactionID: UUID_1.UUID.zero()
            };
            newObjParcelData['ParcelID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjParcelData['OwnerID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjParcelData['IsOwnerGroup'] = (buf.readUInt8(pos++) === 1);
            newObjParcelData['ActualArea'] = buf.readInt32LE(pos);
            pos += 4;
            newObjParcelData['Action'] = buf.readInt8(pos++);
            newObjParcelData['TransactionID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            this.ParcelData.push(newObjParcelData);
        }
        return pos - startPos;
    }
}
exports.LogParcelChangesMessage = LogParcelChangesMessage;
//# sourceMappingURL=LogParcelChanges.js.map