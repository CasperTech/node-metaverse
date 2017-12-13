"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class ParcelAccessListUpdateMessage {
    constructor() {
        this.name = 'ParcelAccessListUpdate';
        this.messageFlags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.ParcelAccessListUpdate;
    }
    getSize() {
        return ((24) * this.List.length) + 65;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt32LE(this.Data['Flags'], pos);
        pos += 4;
        buf.writeInt32LE(this.Data['LocalID'], pos);
        pos += 4;
        this.Data['TransactionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeInt32LE(this.Data['SequenceID'], pos);
        pos += 4;
        buf.writeInt32LE(this.Data['Sections'], pos);
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
            Flags: 0,
            LocalID: 0,
            TransactionID: UUID_1.UUID.zero(),
            SequenceID: 0,
            Sections: 0
        };
        newObjData['Flags'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjData['LocalID'] = buf.readInt32LE(pos);
        pos += 4;
        newObjData['TransactionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjData['SequenceID'] = buf.readInt32LE(pos);
        pos += 4;
        newObjData['Sections'] = buf.readInt32LE(pos);
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
exports.ParcelAccessListUpdateMessage = ParcelAccessListUpdateMessage;
//# sourceMappingURL=ParcelAccessListUpdate.js.map