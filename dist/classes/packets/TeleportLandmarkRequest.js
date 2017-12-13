"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class TeleportLandmarkRequestPacket {
    constructor() {
        this.name = 'TeleportLandmarkRequest';
        this.flags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901825;
    }
    getSize() {
        return 48;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.Info['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.Info['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.Info['LandmarkID'].writeToBuffer(buf, pos);
        pos += 16;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjInfo = {
            AgentID: UUID_1.UUID.zero(),
            SessionID: UUID_1.UUID.zero(),
            LandmarkID: UUID_1.UUID.zero()
        };
        newObjInfo['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjInfo['SessionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjInfo['LandmarkID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.Info = newObjInfo;
        return pos - startPos;
    }
}
exports.TeleportLandmarkRequestPacket = TeleportLandmarkRequestPacket;
//# sourceMappingURL=TeleportLandmarkRequest.js.map