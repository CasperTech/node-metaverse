"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class SimulatorMapUpdateMessage {
    constructor() {
        this.name = 'SimulatorMapUpdate';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.SimulatorMapUpdate;
    }
    getSize() {
        return 4;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeUInt32LE(this.MapData['Flags'], pos);
        pos += 4;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjMapData = {
            Flags: 0
        };
        newObjMapData['Flags'] = buf.readUInt32LE(pos);
        pos += 4;
        this.MapData = newObjMapData;
        return pos - startPos;
    }
}
exports.SimulatorMapUpdateMessage = SimulatorMapUpdateMessage;
//# sourceMappingURL=SimulatorMapUpdate.js.map