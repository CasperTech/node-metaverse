"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class ScriptQuestionMessage {
    constructor() {
        this.name = 'ScriptQuestion';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.ScriptQuestion;
    }
    getSize() {
        return (this.Data['ObjectName'].length + 1 + this.Data['ObjectOwner'].length + 1) + 52;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.Data['TaskID'].writeToBuffer(buf, pos);
        pos += 16;
        this.Data['ItemID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.Data['ObjectName'].length, pos++);
        this.Data['ObjectName'].copy(buf, pos);
        pos += this.Data['ObjectName'].length;
        buf.writeUInt8(this.Data['ObjectOwner'].length, pos++);
        this.Data['ObjectOwner'].copy(buf, pos);
        pos += this.Data['ObjectOwner'].length;
        buf.writeInt32LE(this.Data['Questions'], pos);
        pos += 4;
        this.Experience['ExperienceID'].writeToBuffer(buf, pos);
        pos += 16;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjData = {
            TaskID: UUID_1.UUID.zero(),
            ItemID: UUID_1.UUID.zero(),
            ObjectName: Buffer.allocUnsafe(0),
            ObjectOwner: Buffer.allocUnsafe(0),
            Questions: 0
        };
        newObjData['TaskID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjData['ItemID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        varLength = buf.readUInt8(pos++);
        newObjData['ObjectName'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        varLength = buf.readUInt8(pos++);
        newObjData['ObjectOwner'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        newObjData['Questions'] = buf.readInt32LE(pos);
        pos += 4;
        this.Data = newObjData;
        const newObjExperience = {
            ExperienceID: UUID_1.UUID.zero()
        };
        newObjExperience['ExperienceID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.Experience = newObjExperience;
        return pos - startPos;
    }
}
exports.ScriptQuestionMessage = ScriptQuestionMessage;
//# sourceMappingURL=ScriptQuestion.js.map