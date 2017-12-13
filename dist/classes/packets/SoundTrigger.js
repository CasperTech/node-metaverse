"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Vector3_1 = require("../Vector3");
const Long = require("long");
const MessageFlags_1 = require("../../enums/MessageFlags");
class SoundTriggerPacket {
    constructor() {
        this.name = 'SoundTrigger';
        this.flags = MessageFlags_1.MessageFlags.FrequencyHigh;
        this.id = 29;
    }
    getSize() {
        return 88;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.SoundData['SoundID'].writeToBuffer(buf, pos);
        pos += 16;
        this.SoundData['OwnerID'].writeToBuffer(buf, pos);
        pos += 16;
        this.SoundData['ObjectID'].writeToBuffer(buf, pos);
        pos += 16;
        this.SoundData['ParentID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeInt32LE(this.SoundData['Handle'].low, pos);
        pos += 4;
        buf.writeInt32LE(this.SoundData['Handle'].high, pos);
        pos += 4;
        this.SoundData['Position'].writeToBuffer(buf, pos, false);
        pos += 12;
        buf.writeFloatLE(this.SoundData['Gain'], pos);
        pos += 4;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjSoundData = {
            SoundID: UUID_1.UUID.zero(),
            OwnerID: UUID_1.UUID.zero(),
            ObjectID: UUID_1.UUID.zero(),
            ParentID: UUID_1.UUID.zero(),
            Handle: Long.ZERO,
            Position: Vector3_1.Vector3.getZero(),
            Gain: 0
        };
        newObjSoundData['SoundID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjSoundData['OwnerID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjSoundData['ObjectID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjSoundData['ParentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjSoundData['Handle'] = new Long(buf.readInt32LE(pos), buf.readInt32LE(pos + 4));
        pos += 8;
        newObjSoundData['Position'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjSoundData['Gain'] = buf.readFloatLE(pos);
        pos += 4;
        this.SoundData = newObjSoundData;
        return pos - startPos;
    }
}
exports.SoundTriggerPacket = SoundTriggerPacket;
//# sourceMappingURL=SoundTrigger.js.map