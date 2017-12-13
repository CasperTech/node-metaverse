"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class CoarseLocationUpdateMessage {
    constructor() {
        this.name = 'CoarseLocationUpdate';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyMedium;
        this.id = Message_1.Message.CoarseLocationUpdate;
    }
    getSize() {
        return ((3) * this.Location.length) + ((16) * this.AgentData.length) + 6;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        let count = this.Location.length;
        buf.writeUInt8(this.Location.length, pos++);
        for (let i = 0; i < count; i++) {
            buf.writeUInt8(this.Location[i]['X'], pos++);
            buf.writeUInt8(this.Location[i]['Y'], pos++);
            buf.writeUInt8(this.Location[i]['Z'], pos++);
        }
        buf.writeInt16LE(this.Index['You'], pos);
        pos += 2;
        buf.writeInt16LE(this.Index['Prey'], pos);
        pos += 2;
        count = this.AgentData.length;
        buf.writeUInt8(this.AgentData.length, pos++);
        for (let i = 0; i < count; i++) {
            this.AgentData[i]['AgentID'].writeToBuffer(buf, pos);
            pos += 16;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        let count = buf.readUInt8(pos++);
        this.Location = [];
        for (let i = 0; i < count; i++) {
            const newObjLocation = {
                X: 0,
                Y: 0,
                Z: 0
            };
            newObjLocation['X'] = buf.readUInt8(pos++);
            newObjLocation['Y'] = buf.readUInt8(pos++);
            newObjLocation['Z'] = buf.readUInt8(pos++);
            this.Location.push(newObjLocation);
        }
        const newObjIndex = {
            You: 0,
            Prey: 0
        };
        newObjIndex['You'] = buf.readInt16LE(pos);
        pos += 2;
        newObjIndex['Prey'] = buf.readInt16LE(pos);
        pos += 2;
        this.Index = newObjIndex;
        count = buf.readUInt8(pos++);
        this.AgentData = [];
        for (let i = 0; i < count; i++) {
            const newObjAgentData = {
                AgentID: UUID_1.UUID.zero()
            };
            newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            this.AgentData.push(newObjAgentData);
        }
        return pos - startPos;
    }
}
exports.CoarseLocationUpdateMessage = CoarseLocationUpdateMessage;
//# sourceMappingURL=CoarseLocationUpdate.js.map