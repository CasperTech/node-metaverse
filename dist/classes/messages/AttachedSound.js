"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class AttachedSoundMessage {
    constructor() {
        this.name = 'AttachedSound';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyMedium;
        this.id = Message_1.Message.AttachedSound;
    }
    getSize() {
        return 53;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.DataBlock['SoundID'].writeToBuffer(buf, pos);
        pos += 16;
        this.DataBlock['ObjectID'].writeToBuffer(buf, pos);
        pos += 16;
        this.DataBlock['OwnerID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeFloatLE(this.DataBlock['Gain'], pos);
        pos += 4;
        buf.writeUInt8(this.DataBlock['Flags'], pos++);
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjDataBlock = {
            SoundID: UUID_1.UUID.zero(),
            ObjectID: UUID_1.UUID.zero(),
            OwnerID: UUID_1.UUID.zero(),
            Gain: 0,
            Flags: 0
        };
        newObjDataBlock['SoundID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjDataBlock['ObjectID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjDataBlock['OwnerID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjDataBlock['Gain'] = buf.readFloatLE(pos);
        pos += 4;
        newObjDataBlock['Flags'] = buf.readUInt8(pos++);
        this.DataBlock = newObjDataBlock;
        return pos - startPos;
    }
}
exports.AttachedSoundMessage = AttachedSoundMessage;
//# sourceMappingURL=AttachedSound.js.map