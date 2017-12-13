"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class AttachedSoundGainChangeMessage {
    constructor() {
        this.name = 'AttachedSoundGainChange';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyMedium;
        this.id = Message_1.Message.AttachedSoundGainChange;
    }
    getSize() {
        return 20;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.DataBlock['ObjectID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeFloatLE(this.DataBlock['Gain'], pos);
        pos += 4;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjDataBlock = {
            ObjectID: UUID_1.UUID.zero(),
            Gain: 0
        };
        newObjDataBlock['ObjectID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjDataBlock['Gain'] = buf.readFloatLE(pos);
        pos += 4;
        this.DataBlock = newObjDataBlock;
        return pos - startPos;
    }
}
exports.AttachedSoundGainChangeMessage = AttachedSoundGainChangeMessage;
//# sourceMappingURL=AttachedSoundGainChange.js.map