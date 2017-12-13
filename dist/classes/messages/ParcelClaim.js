"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class ParcelClaimMessage {
    constructor() {
        this.name = 'ParcelClaim';
        this.messageFlags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.ParcelClaim;
    }
    getSize() {
        return ((16) * this.ParcelData.length) + 51;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.Data['GroupID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8((this.Data['IsGroupOwned']) ? 1 : 0, pos++);
        buf.writeUInt8((this.Data['Final']) ? 1 : 0, pos++);
        const count = this.ParcelData.length;
        buf.writeUInt8(this.ParcelData.length, pos++);
        for (let i = 0; i < count; i++) {
            buf.writeFloatLE(this.ParcelData[i]['West'], pos);
            pos += 4;
            buf.writeFloatLE(this.ParcelData[i]['South'], pos);
            pos += 4;
            buf.writeFloatLE(this.ParcelData[i]['East'], pos);
            pos += 4;
            buf.writeFloatLE(this.ParcelData[i]['North'], pos);
            pos += 4;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            SessionID: UUID_1.UUID.zero()
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['SessionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.AgentData = newObjAgentData;
        const newObjData = {
            GroupID: UUID_1.UUID.zero(),
            IsGroupOwned: false,
            Final: false
        };
        newObjData['GroupID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjData['IsGroupOwned'] = (buf.readUInt8(pos++) === 1);
        newObjData['Final'] = (buf.readUInt8(pos++) === 1);
        this.Data = newObjData;
        const count = buf.readUInt8(pos++);
        this.ParcelData = [];
        for (let i = 0; i < count; i++) {
            const newObjParcelData = {
                West: 0,
                South: 0,
                East: 0,
                North: 0
            };
            newObjParcelData['West'] = buf.readFloatLE(pos);
            pos += 4;
            newObjParcelData['South'] = buf.readFloatLE(pos);
            pos += 4;
            newObjParcelData['East'] = buf.readFloatLE(pos);
            pos += 4;
            newObjParcelData['North'] = buf.readFloatLE(pos);
            pos += 4;
            this.ParcelData.push(newObjParcelData);
        }
        return pos - startPos;
    }
}
exports.ParcelClaimMessage = ParcelClaimMessage;
//# sourceMappingURL=ParcelClaim.js.map