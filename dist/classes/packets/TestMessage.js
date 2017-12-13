"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageFlags_1 = require("../../enums/MessageFlags");
class TestMessagePacket {
    constructor() {
        this.name = 'TestMessage';
        this.flags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901761;
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
exports.TestMessagePacket = TestMessagePacket;
//# sourceMappingURL=TestMessage.js.map