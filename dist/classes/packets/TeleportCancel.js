"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class TeleportCancelPacket {
    constructor() {
        this.name = 'TeleportCancel';
        this.flags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901832;
    }
    getSize() {
        return 32;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.Info['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.Info['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjInfo = {
            AgentID: UUID_1.UUID.zero(),
            SessionID: UUID_1.UUID.zero()
        };
        newObjInfo['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjInfo['SessionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.Info = newObjInfo;
        return pos - startPos;
    }
}
exports.TeleportCancelPacket = TeleportCancelPacket;
//# sourceMappingURL=TeleportCancel.js.map