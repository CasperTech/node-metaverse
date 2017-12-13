"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class DerezContainerPacket {
    constructor() {
        this.name = 'DerezContainer';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901864;
    }
    getSize() {
        return 17;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.Data['ObjectID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8((this.Data['Delete']) ? 1 : 0, pos++);
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjData = {
            ObjectID: UUID_1.UUID.zero(),
            Delete: false
        };
        newObjData['ObjectID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjData['Delete'] = (buf.readUInt8(pos++) === 1);
        this.Data = newObjData;
        return pos - startPos;
    }
}
exports.DerezContainerPacket = DerezContainerPacket;
//# sourceMappingURL=DerezContainer.js.map