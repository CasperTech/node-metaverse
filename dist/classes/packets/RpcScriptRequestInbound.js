"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class RpcScriptRequestInboundPacket {
    constructor() {
        this.name = 'RpcScriptRequestInbound';
        this.flags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902175;
    }
    getSize() {
        return (this.DataBlock['StringValue'].length + 2) + 60;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeUInt32LE(this.TargetBlock['GridX'], pos);
        pos += 4;
        buf.writeUInt32LE(this.TargetBlock['GridY'], pos);
        pos += 4;
        this.DataBlock['TaskID'].writeToBuffer(buf, pos);
        pos += 16;
        this.DataBlock['ItemID'].writeToBuffer(buf, pos);
        pos += 16;
        this.DataBlock['ChannelID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt32LE(this.DataBlock['IntValue'], pos);
        pos += 4;
        buf.write(this.DataBlock['StringValue'], pos);
        pos += this.DataBlock['StringValue'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjTargetBlock = {
            GridX: 0,
            GridY: 0
        };
        newObjTargetBlock['GridX'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjTargetBlock['GridY'] = buf.readUInt32LE(pos);
        pos += 4;
        this.TargetBlock = newObjTargetBlock;
        const newObjDataBlock = {
            TaskID: UUID_1.UUID.zero(),
            ItemID: UUID_1.UUID.zero(),
            ChannelID: UUID_1.UUID.zero(),
            IntValue: 0,
            StringValue: ''
        };
        newObjDataBlock['TaskID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjDataBlock['ItemID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjDataBlock['ChannelID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjDataBlock['IntValue'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjDataBlock['StringValue'] = buf.toString('utf8', pos, length);
        pos += length;
        this.DataBlock = newObjDataBlock;
        return pos - startPos;
    }
}
exports.RpcScriptRequestInboundPacket = RpcScriptRequestInboundPacket;
//# sourceMappingURL=RpcScriptRequestInbound.js.map