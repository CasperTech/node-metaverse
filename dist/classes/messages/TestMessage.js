"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class TestMessageMessage {
    constructor() {
        this.name = 'TestMessage';
        this.messageFlags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.TestMessage;
    }
    getSize() {
        return 52;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeUInt32LE(this.TestBlock1['Test1'], pos);
        pos += 4;
        const count = 4;
        for (let i = 0; i < count; i++) {
            buf.writeUInt32LE(this.NeighborBlock[i]['Test0'], pos);
            pos += 4;
            buf.writeUInt32LE(this.NeighborBlock[i]['Test1'], pos);
            pos += 4;
            buf.writeUInt32LE(this.NeighborBlock[i]['Test2'], pos);
            pos += 4;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjTestBlock1 = {
            Test1: 0
        };
        newObjTestBlock1['Test1'] = buf.readUInt32LE(pos);
        pos += 4;
        this.TestBlock1 = newObjTestBlock1;
        const count = 4;
        this.NeighborBlock = [];
        for (let i = 0; i < count; i++) {
            const newObjNeighborBlock = {
                Test0: 0,
                Test1: 0,
                Test2: 0
            };
            newObjNeighborBlock['Test0'] = buf.readUInt32LE(pos);
            pos += 4;
            newObjNeighborBlock['Test1'] = buf.readUInt32LE(pos);
            pos += 4;
            newObjNeighborBlock['Test2'] = buf.readUInt32LE(pos);
            pos += 4;
            this.NeighborBlock.push(newObjNeighborBlock);
        }
        return pos - startPos;
    }
}
exports.TestMessageMessage = TestMessageMessage;
//# sourceMappingURL=TestMessage.js.map