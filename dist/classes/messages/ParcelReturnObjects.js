"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class ParcelReturnObjectsMessage {
    constructor() {
        this.name = 'ParcelReturnObjects';
        this.messageFlags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.ParcelReturnObjects;
    }
    getSize() {
        return ((16) * this.TaskIDs.length) + ((16) * this.OwnerIDs.length) + 42;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeInt32LE(this.ParcelData['LocalID'], pos);
        pos += 4;
        buf.writeUInt32LE(this.ParcelData['ReturnType'], pos);
        pos += 4;
        let count = this.TaskIDs.length;
        buf.writeUInt8(this.TaskIDs.length, pos++);
        for (let i = 0; i < count; i++) {
            this.TaskIDs[i]['TaskID'].writeToBuffer(buf, pos);
            pos += 16;
        }
        count = this.OwnerIDs.length;
        buf.writeUInt8(this.OwnerIDs.length, pos++);
        for (let i = 0; i < count; i++) {
            this.OwnerIDs[i]['OwnerID'].writeToBuffer(buf, pos);
            pos += 16;
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
        const newObjParcelData = {
            LocalID: 0,
            ReturnType: 0
        };
        newObjParcelData['LocalID'] = buf.readInt32LE(pos);
        pos += 4;
        newObjParcelData['ReturnType'] = buf.readUInt32LE(pos);
        pos += 4;
        this.ParcelData = newObjParcelData;
        let count = buf.readUInt8(pos++);
        this.TaskIDs = [];
        for (let i = 0; i < count; i++) {
            const newObjTaskIDs = {
                TaskID: UUID_1.UUID.zero()
            };
            newObjTaskIDs['TaskID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            this.TaskIDs.push(newObjTaskIDs);
        }
        count = buf.readUInt8(pos++);
        this.OwnerIDs = [];
        for (let i = 0; i < count; i++) {
            const newObjOwnerIDs = {
                OwnerID: UUID_1.UUID.zero()
            };
            newObjOwnerIDs['OwnerID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            this.OwnerIDs.push(newObjOwnerIDs);
        }
        return pos - startPos;
    }
}
exports.ParcelReturnObjectsMessage = ParcelReturnObjectsMessage;
//# sourceMappingURL=ParcelReturnObjects.js.map