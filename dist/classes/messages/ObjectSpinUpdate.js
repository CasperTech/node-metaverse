"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Quaternion_1 = require("../Quaternion");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class ObjectSpinUpdateMessage {
    constructor() {
        this.name = 'ObjectSpinUpdate';
        this.messageFlags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.ObjectSpinUpdate;
    }
    getSize() {
        return 60;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.ObjectData['ObjectID'].writeToBuffer(buf, pos);
        pos += 16;
        this.ObjectData['Rotation'].writeToBuffer(buf, pos);
        pos += 12;
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
        const newObjObjectData = {
            ObjectID: UUID_1.UUID.zero(),
            Rotation: Quaternion_1.Quaternion.getIdentity()
        };
        newObjObjectData['ObjectID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjObjectData['Rotation'] = new Quaternion_1.Quaternion(buf, pos);
        pos += 12;
        this.ObjectData = newObjObjectData;
        return pos - startPos;
    }
}
exports.ObjectSpinUpdateMessage = ObjectSpinUpdateMessage;
//# sourceMappingURL=ObjectSpinUpdate.js.map