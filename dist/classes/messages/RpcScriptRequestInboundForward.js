"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const IPAddress_1 = require("../IPAddress");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class RpcScriptRequestInboundForwardMessage {
    constructor() {
        this.name = 'RpcScriptRequestInboundForward';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Deprecated | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.RpcScriptRequestInboundForward;
    }
    getSize() {
        return (this.DataBlock['StringValue'].length + 2) + 58;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.DataBlock['RPCServerIP'].writeToBuffer(buf, pos);
        pos += 4;
        buf.writeUInt16LE(this.DataBlock['RPCServerPort'], pos);
        pos += 2;
        this.DataBlock['TaskID'].writeToBuffer(buf, pos);
        pos += 16;
        this.DataBlock['ItemID'].writeToBuffer(buf, pos);
        pos += 16;
        this.DataBlock['ChannelID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt32LE(this.DataBlock['IntValue'], pos);
        pos += 4;
        buf.writeUInt16LE(this.DataBlock['StringValue'].length, pos);
        pos += 2;
        this.DataBlock['StringValue'].copy(buf, pos);
        pos += this.DataBlock['StringValue'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjDataBlock = {
            RPCServerIP: IPAddress_1.IPAddress.zero(),
            RPCServerPort: 0,
            TaskID: UUID_1.UUID.zero(),
            ItemID: UUID_1.UUID.zero(),
            ChannelID: UUID_1.UUID.zero(),
            IntValue: 0,
            StringValue: Buffer.allocUnsafe(0)
        };
        newObjDataBlock['RPCServerIP'] = new IPAddress_1.IPAddress(buf, pos);
        pos += 4;
        newObjDataBlock['RPCServerPort'] = buf.readUInt16LE(pos);
        pos += 2;
        newObjDataBlock['TaskID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjDataBlock['ItemID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjDataBlock['ChannelID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjDataBlock['IntValue'] = buf.readUInt32LE(pos);
        pos += 4;
        varLength = buf.readUInt16LE(pos);
        pos += 2;
        newObjDataBlock['StringValue'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.DataBlock = newObjDataBlock;
        return pos - startPos;
    }
}
exports.RpcScriptRequestInboundForwardMessage = RpcScriptRequestInboundForwardMessage;
//# sourceMappingURL=RpcScriptRequestInboundForward.js.map