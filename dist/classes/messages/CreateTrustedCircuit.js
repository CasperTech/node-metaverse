"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class CreateTrustedCircuitMessage {
    constructor() {
        this.name = 'CreateTrustedCircuit';
        this.messageFlags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.CreateTrustedCircuit;
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
        let varLength = 0;
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
exports.CreateTrustedCircuitMessage = CreateTrustedCircuitMessage;
//# sourceMappingURL=CreateTrustedCircuit.js.map