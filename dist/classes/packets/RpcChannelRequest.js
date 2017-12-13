"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class RpcChannelRequestPacket {
    constructor() {
        this.name = 'RpcChannelRequest';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902173;
    }
    getSize() {
        return 40;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeUInt32LE(this.DataBlock['GridX'], pos);
        pos += 4;
        buf.writeUInt32LE(this.DataBlock['GridY'], pos);
        pos += 4;
        this.DataBlock['TaskID'].writeToBuffer(buf, pos);
        pos += 16;
        this.DataBlock['ItemID'].writeToBuffer(buf, pos);
        pos += 16;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjDataBlock = {
            GridX: 0,
            GridY: 0,
            TaskID: UUID_1.UUID.zero(),
            ItemID: UUID_1.UUID.zero()
        };
        newObjDataBlock['GridX'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjDataBlock['GridY'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjDataBlock['TaskID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjDataBlock['ItemID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.DataBlock = newObjDataBlock;
        return pos - startPos;
    }
}
exports.RpcChannelRequestPacket = RpcChannelRequestPacket;
//# sourceMappingURL=RpcChannelRequest.js.map