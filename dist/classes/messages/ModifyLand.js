"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class ModifyLandMessage {
    constructor() {
        this.name = 'ModifyLand';
        this.messageFlags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.ModifyLand;
    }
    getSize() {
        return ((20) * this.ParcelData.length) + ((4) * this.ModifyBlockExtended.length) + 44;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.ModifyBlock['Action'], pos++);
        buf.writeUInt8(this.ModifyBlock['BrushSize'], pos++);
        buf.writeFloatLE(this.ModifyBlock['Seconds'], pos);
        pos += 4;
        buf.writeFloatLE(this.ModifyBlock['Height'], pos);
        pos += 4;
        let count = this.ParcelData.length;
        buf.writeUInt8(this.ParcelData.length, pos++);
        for (let i = 0; i < count; i++) {
            buf.writeInt32LE(this.ParcelData[i]['LocalID'], pos);
            pos += 4;
            buf.writeFloatLE(this.ParcelData[i]['West'], pos);
            pos += 4;
            buf.writeFloatLE(this.ParcelData[i]['South'], pos);
            pos += 4;
            buf.writeFloatLE(this.ParcelData[i]['East'], pos);
            pos += 4;
            buf.writeFloatLE(this.ParcelData[i]['North'], pos);
            pos += 4;
        }
        count = this.ModifyBlockExtended.length;
        buf.writeUInt8(this.ModifyBlockExtended.length, pos++);
        for (let i = 0; i < count; i++) {
            buf.writeFloatLE(this.ModifyBlockExtended[i]['BrushSize'], pos);
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
        const newObjModifyBlock = {
            Action: 0,
            BrushSize: 0,
            Seconds: 0,
            Height: 0
        };
        newObjModifyBlock['Action'] = buf.readUInt8(pos++);
        newObjModifyBlock['BrushSize'] = buf.readUInt8(pos++);
        newObjModifyBlock['Seconds'] = buf.readFloatLE(pos);
        pos += 4;
        newObjModifyBlock['Height'] = buf.readFloatLE(pos);
        pos += 4;
        this.ModifyBlock = newObjModifyBlock;
        let count = buf.readUInt8(pos++);
        this.ParcelData = [];
        for (let i = 0; i < count; i++) {
            const newObjParcelData = {
                LocalID: 0,
                West: 0,
                South: 0,
                East: 0,
                North: 0
            };
            newObjParcelData['LocalID'] = buf.readInt32LE(pos);
            pos += 4;
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
        count = buf.readUInt8(pos++);
        this.ModifyBlockExtended = [];
        for (let i = 0; i < count; i++) {
            const newObjModifyBlockExtended = {
                BrushSize: 0
            };
            newObjModifyBlockExtended['BrushSize'] = buf.readFloatLE(pos);
            pos += 4;
            this.ModifyBlockExtended.push(newObjModifyBlockExtended);
        }
        return pos - startPos;
    }
}
exports.ModifyLandMessage = ModifyLandMessage;
//# sourceMappingURL=ModifyLand.js.map