"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageFlags_1 = require("../../enums/MessageFlags");
class SetCPURatioPacket {
    constructor() {
        this.name = 'SetCPURatio';
        this.flags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902087;
    }
    getSize() {
        return 1;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeUInt8(this.Data['Ratio'], pos++);
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjData = {
            Ratio: 0
        };
        newObjData['Ratio'] = buf.readUInt8(pos++);
        this.Data = newObjData;
        return pos - startPos;
    }
}
exports.SetCPURatioPacket = SetCPURatioPacket;
//# sourceMappingURL=SetCPURatio.js.map