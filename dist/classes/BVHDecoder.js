"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("./Utils");
class BVHDecoder {
    readFromBuffer(buf, pos) {
        const header1 = buf.readUInt16LE(pos);
        pos = pos + 2;
        const header2 = buf.readUInt16LE(pos);
        pos = pos + 2;
        if (header1 !== 1 || header2 !== 0) {
            console.error('BVH Decoder: invalid data');
            return;
        }
        else {
            console.log('Header: OK');
        }
        this.priority = buf.readInt32LE(pos);
        pos = pos + 4;
        this.length = buf.readFloatLE(pos);
        pos = pos + 4;
        let result = Utils_1.Utils.BufferToString(buf, pos);
        pos += result.readLength;
        console.log(result);
        this.expressionName = result.result;
        this.inPoint = buf.readFloatLE(pos);
        pos += 4;
        this.outPoint = buf.readFloatLE(pos);
        pos += 4;
        this.loop = buf.readInt32LE(pos);
        pos += 4;
        this.easeInTime = buf.readFloatLE(pos);
        pos += 4;
        this.easeOutTime = buf.readFloatLE(pos);
        pos += 4;
        this.handPose = buf.readUInt32LE(pos);
        pos += 4;
        this.jointCount = buf.readUInt32LE(pos);
        pos += 4;
        console.log(this);
    }
}
exports.BVHDecoder = BVHDecoder;
//# sourceMappingURL=BVHDecoder.js.map