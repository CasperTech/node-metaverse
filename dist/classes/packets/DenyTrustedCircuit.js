"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class DenyTrustedCircuitPacket {
    constructor() {
        this.name = 'DenyTrustedCircuit';
        this.flags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902153;
    }
    getSize() {
        return 16;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.DataBlock['EndPointID'].writeToBuffer(buf, pos);
        pos += 16;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjDataBlock = {
            EndPointID: UUID_1.UUID.zero()
        };
        newObjDataBlock['EndPointID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.DataBlock = newObjDataBlock;
        return pos - startPos;
    }
}
exports.DenyTrustedCircuitPacket = DenyTrustedCircuitPacket;
//# sourceMappingURL=DenyTrustedCircuit.js.map