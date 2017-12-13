"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class ParcelMediaCommandMessageMessage {
    constructor() {
        this.name = 'ParcelMediaCommandMessage';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.ParcelMediaCommandMessage;
    }
    getSize() {
        return 12;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeUInt32LE(this.CommandBlock['Flags'], pos);
        pos += 4;
        buf.writeUInt32LE(this.CommandBlock['Command'], pos);
        pos += 4;
        buf.writeFloatLE(this.CommandBlock['Time'], pos);
        pos += 4;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjCommandBlock = {
            Flags: 0,
            Command: 0,
            Time: 0
        };
        newObjCommandBlock['Flags'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjCommandBlock['Command'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjCommandBlock['Time'] = buf.readFloatLE(pos);
        pos += 4;
        this.CommandBlock = newObjCommandBlock;
        return pos - startPos;
    }
}
exports.ParcelMediaCommandMessageMessage = ParcelMediaCommandMessageMessage;
//# sourceMappingURL=ParcelMediaCommandMessage.js.map