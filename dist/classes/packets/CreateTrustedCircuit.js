"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class CreateTrustedCircuitPacket {
    constructor() {
        this.name = 'CreateTrustedCircuit';
        this.flags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902152;
    }
    getSize() {
        return 48;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.DataBlock['EndPointID'].writeToBuffer(buf, pos);
        pos += 16;
        this.DataBlock['Digest'].copy(buf, pos);
        pos += 32;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjDataBlock = {
            EndPointID: UUID_1.UUID.zero(),
            Digest: Buffer.allocUnsafe(0)
        };
        newObjDataBlock['EndPointID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjDataBlock['Digest'] = buf.slice(pos, pos + 32);
        pos += 32;
        this.DataBlock = newObjDataBlock;
        return pos - startPos;
    }
}
exports.CreateTrustedCircuitPacket = CreateTrustedCircuitPacket;
//# sourceMappingURL=CreateTrustedCircuit.js.map