"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class RemoveAttachmentPacket {
    constructor() {
        this.name = 'RemoveAttachment';
        this.flags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902092;
    }
    getSize() {
        return 49;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.AttachmentBlock['AttachmentPoint'], pos++);
        this.AttachmentBlock['ItemID'].writeToBuffer(buf, pos);
        pos += 16;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            SessionID: UUID_1.UUID.zero()
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['SessionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.AgentData = newObjAgentData;
        const newObjAttachmentBlock = {
            AttachmentPoint: 0,
            ItemID: UUID_1.UUID.zero()
        };
        newObjAttachmentBlock['AttachmentPoint'] = buf.readUInt8(pos++);
        newObjAttachmentBlock['ItemID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.AttachmentBlock = newObjAttachmentBlock;
        return pos - startPos;
    }
}
exports.RemoveAttachmentPacket = RemoveAttachmentPacket;
//# sourceMappingURL=RemoveAttachment.js.map