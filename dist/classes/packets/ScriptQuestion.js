"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class ScriptQuestionPacket {
    constructor() {
        this.name = 'ScriptQuestion';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901948;
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
        buf.write(this.Data['ObjectName'], pos);
        pos += this.Data['ObjectName'].length;
        buf.write(this.Data['ObjectOwner'], pos);
        pos += this.Data['ObjectOwner'].length;
        buf.writeInt32LE(this.Data['Questions'], pos);
        pos += 4;
        this.Experience['ExperienceID'].writeToBuffer(buf, pos);
        pos += 16;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjData = {
            TaskID: UUID_1.UUID.zero(),
            ItemID: UUID_1.UUID.zero(),
            ObjectName: '',
            ObjectOwner: '',
            Questions: 0
        };
        newObjData['TaskID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjData['ItemID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjData['ObjectName'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjData['ObjectOwner'] = buf.toString('utf8', pos, length);
        pos += length;
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
exports.ScriptQuestionPacket = ScriptQuestionPacket;
//# sourceMappingURL=ScriptQuestion.js.map