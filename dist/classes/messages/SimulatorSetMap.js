"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Long = require("long");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class SimulatorSetMapMessage {
    constructor() {
        this.name = 'SimulatorSetMap';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.SimulatorSetMap;
    }
    getSize() {
        return 28;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeInt32LE(this.MapData['RegionHandle'].low, pos);
        pos += 4;
        buf.writeInt32LE(this.MapData['RegionHandle'].high, pos);
        pos += 4;
        buf.writeInt32LE(this.MapData['Type'], pos);
        pos += 4;
        this.MapData['MapImage'].writeToBuffer(buf, pos);
        pos += 16;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjMapData = {
            RegionHandle: Long.ZERO,
            Type: 0,
            MapImage: UUID_1.UUID.zero()
        };
        newObjMapData['RegionHandle'] = new Long(buf.readInt32LE(pos), buf.readInt32LE(pos + 4));
        pos += 8;
        newObjMapData['Type'] = buf.readInt32LE(pos);
        pos += 4;
        newObjMapData['MapImage'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.MapData = newObjMapData;
        return pos - startPos;
    }
}
exports.SimulatorSetMapMessage = SimulatorSetMapMessage;
//# sourceMappingURL=SimulatorSetMap.js.map