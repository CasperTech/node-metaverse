"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class ObjectFlagUpdateMessage {
    constructor() {
        this.name = 'ObjectFlagUpdate';
        this.messageFlags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.ObjectFlagUpdate;
    }
    getSize() {
        return ((17) * this.ExtraPhysics.length) + 41;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt32LE(this.AgentData['ObjectLocalID'], pos);
        pos += 4;
        buf.writeUInt8((this.AgentData['UsePhysics']) ? 1 : 0, pos++);
        buf.writeUInt8((this.AgentData['IsTemporary']) ? 1 : 0, pos++);
        buf.writeUInt8((this.AgentData['IsPhantom']) ? 1 : 0, pos++);
        buf.writeUInt8((this.AgentData['CastsShadows']) ? 1 : 0, pos++);
        const count = this.ExtraPhysics.length;
        buf.writeUInt8(this.ExtraPhysics.length, pos++);
        for (let i = 0; i < count; i++) {
            buf.writeUInt8(this.ExtraPhysics[i]['PhysicsShapeType'], pos++);
            buf.writeFloatLE(this.ExtraPhysics[i]['Density'], pos);
            pos += 4;
            buf.writeFloatLE(this.ExtraPhysics[i]['Friction'], pos);
            pos += 4;
            buf.writeFloatLE(this.ExtraPhysics[i]['Restitution'], pos);
            pos += 4;
            buf.writeFloatLE(this.ExtraPhysics[i]['GravityMultiplier'], pos);
            pos += 4;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            SessionID: UUID_1.UUID.zero(),
            ObjectLocalID: 0,
            UsePhysics: false,
            IsTemporary: false,
            IsPhantom: false,
            CastsShadows: false
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['SessionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['ObjectLocalID'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjAgentData['UsePhysics'] = (buf.readUInt8(pos++) === 1);
        newObjAgentData['IsTemporary'] = (buf.readUInt8(pos++) === 1);
        newObjAgentData['IsPhantom'] = (buf.readUInt8(pos++) === 1);
        newObjAgentData['CastsShadows'] = (buf.readUInt8(pos++) === 1);
        this.AgentData = newObjAgentData;
        const count = buf.readUInt8(pos++);
        this.ExtraPhysics = [];
        for (let i = 0; i < count; i++) {
            const newObjExtraPhysics = {
                PhysicsShapeType: 0,
                Density: 0,
                Friction: 0,
                Restitution: 0,
                GravityMultiplier: 0
            };
            newObjExtraPhysics['PhysicsShapeType'] = buf.readUInt8(pos++);
            newObjExtraPhysics['Density'] = buf.readFloatLE(pos);
            pos += 4;
            newObjExtraPhysics['Friction'] = buf.readFloatLE(pos);
            pos += 4;
            newObjExtraPhysics['Restitution'] = buf.readFloatLE(pos);
            pos += 4;
            newObjExtraPhysics['GravityMultiplier'] = buf.readFloatLE(pos);
            pos += 4;
            this.ExtraPhysics.push(newObjExtraPhysics);
        }
        return pos - startPos;
    }
}
exports.ObjectFlagUpdateMessage = ObjectFlagUpdateMessage;
//# sourceMappingURL=ObjectFlagUpdate.js.map