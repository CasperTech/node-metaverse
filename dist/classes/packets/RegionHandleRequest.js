"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class RegionHandleRequestPacket {
    constructor() {
        this.name = 'RegionHandleRequest';
        this.flags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902069;
    }
    getSize() {
        return 16;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.RequestBlock['RegionID'].writeToBuffer(buf, pos);
        pos += 16;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjRequestBlock = {
            RegionID: UUID_1.UUID.zero()
        };
        newObjRequestBlock['RegionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.RequestBlock = newObjRequestBlock;
        return pos - startPos;
    }
}
exports.RegionHandleRequestPacket = RegionHandleRequestPacket;
//# sourceMappingURL=RegionHandleRequest.js.map