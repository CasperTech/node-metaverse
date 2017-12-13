"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class ObjectOwnerMessage {
    constructor() {
        this.name = 'ObjectOwner';
        this.messageFlags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.ObjectOwner;
    }
    getSize() {
        return ((4) * this.ObjectData.length) + 66;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8((this.HeaderData['Override']) ? 1 : 0, pos++);
        this.HeaderData['OwnerID'].writeToBuffer(buf, pos);
        pos += 16;
        this.HeaderData['GroupID'].writeToBuffer(buf, pos);
        pos += 16;
        const count = this.ObjectData.length;
        buf.writeUInt8(this.ObjectData.length, pos++);
        for (let i = 0; i < count; i++) {
            buf.writeUInt32LE(this.ObjectData[i]['ObjectLocalID'], pos);
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
        const newObjHeaderData = {
            Override: false,
            OwnerID: UUID_1.UUID.zero(),
            GroupID: UUID_1.UUID.zero()
        };
        newObjHeaderData['Override'] = (buf.readUInt8(pos++) === 1);
        newObjHeaderData['OwnerID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjHeaderData['GroupID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.HeaderData = newObjHeaderData;
        const count = buf.readUInt8(pos++);
        this.ObjectData = [];
        for (let i = 0; i < count; i++) {
            const newObjObjectData = {
                ObjectLocalID: 0
            };
            newObjObjectData['ObjectLocalID'] = buf.readUInt32LE(pos);
            pos += 4;
            this.ObjectData.push(newObjObjectData);
        }
        return pos - startPos;
    }
}
exports.ObjectOwnerMessage = ObjectOwnerMessage;
//# sourceMappingURL=ObjectOwner.js.map